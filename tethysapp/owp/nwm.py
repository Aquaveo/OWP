from django.http import JsonResponse
import pandas as pd
import asyncio
from channels.layers import get_channel_layer
import httpx
from tethys_sdk.routing import controller

from .app import Owp as app
from asgiref.sync import sync_to_async


try:
    BASE_API_URL = app.get_custom_setting("nwmdata_api")
    # BASE_API_URL = "https://nwmdata.nohrsc.noaa.gov/latest/forecasts"
except Exception:
    BASE_API_URL = ""

try:
    BASE_NWM_API_URL = app.get_custom_setting("base_nwp_api_url")
except Exception:
    BASE_NWM_API_URL = ""


async_client = httpx.AsyncClient()

limit = asyncio.Semaphore(3)


@controller
def getForecastData(request):
    station_id = request.GET.get("station_id")
    products = [
        "analysis_assimilation",
        "short_range",
        "medium_range",
        "long_range",
        "medium_range_blend",
    ]
    # products = json.loads(request.GET.get("products"))
    print(station_id)
    response = "executing"
    try:
        api_base_url = BASE_API_URL
        asyncio.run(make_api_calls(api_base_url, station_id, products))

    except Exception as e:
        print("getForecastData error")
        print(e)

    return JsonResponse({"state": response})


async def make_api_calls(api_base_url, station_id, products):
    list_async_task = []
    for product in products:
        task_get_forecast_data = asyncio.create_task(
            api_forecast_call(api_base_url, station_id, product)
        )
        list_async_task.append(task_get_forecast_data)

    results = await asyncio.gather(*list_async_task)

    return results


async def api_forecast_call(api_base_url, station_id, method_name):
    mssge_string = "Complete"
    channel_layer = get_channel_layer()
    try:

        async with httpx.AsyncClient(verify=False) as client:

            response_await = await client.get(
                url=f"{api_base_url}/reaches/{station_id}/streamflow",
                params={"series": method_name},
                timeout=None,
            )
        await channel_layer.group_send(
            "notifications_owp",
            {
                "type": "data_notifications",
                "station_id": station_id,
                "method_name": method_name,
                "command": "Plot_Data_Retrieved",
                "mssg": mssge_string,
                "product": method_name,
                "data": response_await.json(),
            },
        )
        return mssge_string

    except httpx.HTTPError as exc:
        print(f"Error while requesting {exc.request.url!r}.")

        print(str(exc.__class__.__name__))
        mssge_string = "incomplete"
        await channel_layer.group_send(
            "notifications_owp",
            {
                "type": "simple_notifications",
                "station_id": station_id,
                "product": method_name,
                "mssg": mssge_string,
                "command": "Plot_Data_Retrieved Error",
            },
        )
    except Exception as e:
        print("api_call error 2")
        print(e)
    return mssge_string


async def make_nwm_api_calls(api_base_url, feature_ids, types, reference_time):
    list_async_task = []
    # breakpoint()
    for single_type in types:
        type_api_base_url = f"{api_base_url}/{single_type}"
        if single_type == "forecast":
            forecast_types = ["long_range"]
            for forecast_type in forecast_types:
                params = {
                    "comids": feature_ids,
                    "forecast_type": forecast_type,
                    # "type": single_type,
                    # "reference_time": reference_time, ALREADY COMMENTED
                    "format": "json",
                }
                list_async_task.append(
                    asyncio.create_task(nwm_api_call(type_api_base_url, params))
                )

        else:
            params = {
                # "comids": chunked_list,
                "comids": feature_ids,
                "format": "json",
                "run_offset": 1,
                "start_time": "2018-09-17",
                "end_time": "2018-12-17",
            }

            list_async_task.append(
                asyncio.create_task(nwm_api_call(type_api_base_url, params))
            )

    results = await asyncio.gather(*list_async_task)

    return results


async def nwm_api_call(api_base_url, params):
    # breakpoint()
    mssge_string = "Complete"
    x_api_key = await sync_to_async(app.get_custom_setting)("x_api_key")
    headers = {"x-api-key": x_api_key}
    try:
        async with limit:

            response_await = await async_client.get(
                api_base_url, headers=headers, params=params, timeout=None
            )
            print(api_base_url, response_await.status_code)

            if limit.locked():
                print("Concurrency limit reached, waiting ...")
                await asyncio.sleep(0.5)
            if response_await.status_code == httpx.codes.OK:
                df = pd.DataFrame.from_dict(response_await.json())
                dfs_dict = {
                    comid: df.loc[df["feature_id"] == int(comid)]
                    for comid in params["comids"].split(",")
                }
                list_daily_avg = []
                for comid, split_df in dfs_dict.items():
                    split_df["time"] = pd.to_datetime(split_df["time"])
                    split_df = split_df.set_index("time")
                    split_df = split_df.sort_index()
                    split_df = split_df[["velocity"]]
                    if "analysis-assim" in api_base_url:
                        daily_avg = split_df.resample("1H").mean().ffill()
                    else:
                        daily_avg = split_df.resample("24H").mean()

                    daily_avg = daily_avg.rename(columns={"velocity": f"{comid}"})
                    if len(list_daily_avg) > 0:
                        merged_df = pd.concat([list_daily_avg[0], daily_avg], axis=1)
                        list_daily_avg = [merged_df]
                    else:
                        list_daily_avg = [daily_avg]
                # breakpoint()
                response_obj = list_daily_avg[0].to_dict("list")
                if params.get("forecast_type", "") != "":
                    return {"forecast": {f"{params['forecast_type']}": response_obj}}
                else:
                    return {"analysis-assim": response_obj}

            if response_await.status_code == 429:
                print(response_await.text)

    except httpx.HTTPError as exc:
        print(f"Error while requesting {exc.request.url!r}.")

        print(str(exc.__class__.__name__))
        mssge_string = "incomplete"
        return mssge_string

    except Exception as e:
        print("api_call error 2")
        print(e)
        response_obj = {}
        if params.get("forecast_type", "") != "":
            return {"forecast": {f"{params['forecast_type']}": response_obj}}
        else:
            return {"analysis-assim": response_obj}


async def getNwmDataAsync(feature_ids, types_ts, reference_time):
    # Your existing code for make_nwm_api_calls and other related functions...

    # Assuming 'all_calls' is the result of await make_nwm_api_calls(...)
    features_ids_string = ",".join(str(comid) for comid in feature_ids)
    all_calls = await make_nwm_api_calls(
        BASE_NWM_API_URL, features_ids_string, types_ts, reference_time
    )

    # Creating a dictionary to store results with 'types' as keys
    results_dict = {}
    for idx, single_type in enumerate(types_ts):
        if isinstance(all_calls[idx], dict):
            results_dict[single_type] = all_calls[idx].get(single_type, [])
        else:
            results_dict[single_type] = []

    return results_dict

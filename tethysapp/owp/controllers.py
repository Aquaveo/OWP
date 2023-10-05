from django.shortcuts import render
from django.http import JsonResponse
import pandas as pd
import asyncio
from channels.layers import get_channel_layer
import httpx
import json
from tethys_sdk.routing import controller
from django.contrib.auth.models import User

from requests import Request
import geopandas as gpd
from geoalchemy2 import Geometry, WKTElement
import os
from sqlalchemy.orm import sessionmaker
from .model import Base, Region
from .app import Owp as app
from shapely.geometry import GeometryCollection
import shapely.wkt
from .model import Region
import shapely
from asgiref.sync import sync_to_async

BASE_API_URL = "https://nwmdata.nohrsc.noaa.gov/latest/forecasts"
async_client = httpx.AsyncClient()


@controller
def home(request):
    """Controller for the app home page."""
    # The index.html template loads the React frontend
    return render(request, "owp/index.html")


#     station_id = request.GET.get('station_id')
#     url=f'{BASE_API_URL}/analysis_assim/streamflow?station_id={station_id}'
#     # https://nwmdata.nohrsc.noaa.gov/latest/forecasts/short_range/streamflow?station_id=19266232

#     #https://nwmdata.nohrsc.noaa.gov/latest/forecasts/long_range_ensemble_mean/streamflow?station_id=19266232
#     #https://nwmdata.nohrsc.noaa.gov/latest/forecasts/long_range_ensemble_member_4/streamflow?station_id=19266232 this until essemble 1-4

#     #https://nwmdata.nohrsc.noaa.gov/latest/forecasts/medium_range_ensemble_mean/streamflow?station_id=19266232

#     #https://nwmdata.nohrsc.noaa.gov/latest/forecasts/medium_range_ensemble_member_7/streamflow?station_id=19266232 this until ensemble 1-7


@controller
def saveUserRegions(request):
    response_obj = {}
    response_obj["msge"] = "success"
    try:
        if request.user.is_authenticated:
            # Create a session object in preparation for interacting with the database
            engine = app.get_persistent_store_database("user_data")
            SessionMaker = app.get_persistent_store_database(
                "user_data", as_sessionmaker=True
            )
            session = SessionMaker()
            user_name = request.user.username
            # breakpoint()

            region_type = request.POST.get("regionType")
            region_name = request.POST.get("name")
            region_default = request.POST.get("default")
            region_layer_color = request.POST.get("layer_color")
            # breakpoint()

            if region_type == "huc":
                region_data = json.loads(request.POST.get("region_data"))
                df = gpd.GeoDataFrame.from_features(region_data, crs=4326)
            else:
                file_data = request.FILES.getlist("files")[0]
                df = gpd.read_file(file_data)

            df.crs = "EPSG:4326"
            df["geom"] = df["geometry"]
            # df["geom"] = df["geometry"].apply(shapely.wkt.loads)
            df = df.drop("geometry", axis=1)
            dest = gpd.GeoDataFrame(
                columns=["name", "region_type", "default", "user_name", "geom"],
                crs="EPSG:4326",
                geometry=[GeometryCollection(df["geom"].tolist())],
            )
            dest["region_type"] = region_type
            dest["default"] = region_default
            dest["name"] = region_name
            dest["layer_color"] = region_layer_color
            dest["user_name"] = user_name
            dest["geom"] = dest["geometry"]
            dest = dest.drop("geometry", axis=1)
            dest = dest.set_geometry("geom")
            dest["geom"] = dest["geom"].apply(lambda x: WKTElement(x.wkt, srid=4326))

            # geojson_object = json.loads(request.body.decode("utf-8"))
            # df = gpd.GeoDataFrame.from_features(
            #     geojson_object["requestData"]["region_data"], crs=4326
            # )
            # df.crs = "EPSG:4326"
            # df["geom"] = df["geometry"]
            # # df["geom"] = df["geometry"].apply(shapely.wkt.loads)
            # df = df.drop("geometry", axis=1)

            # dest = gpd.GeoDataFrame(columns=["name", "region_type", "default", "user_name", "geom"],crs="EPSG:4326",geometry=[GeometryCollection(df["geom"].tolist())],)
            # dest["region_type"] = geojson_object["requestData"]["regionType"]
            # dest["default"] = geojson_object["requestData"]["default"]
            # dest["name"] = geojson_object["requestData"]["name"]
            # dest["layer_color"] = geojson_object["requestData"]["layer_color"]
            # dest["user_name"] = user_name
            # dest["geom"] = dest["geometry"]
            # dest = dest.drop("geometry", axis=1)
            # dest = dest.set_geometry("geom")
            # dest["geom"] = dest["geom"].apply(lambda x: WKTElement(x.wkt, srid=4326))

            # breakpoint()

            dest.to_sql(
                name="regions",
                con=engine,
                if_exists="append",
                index=False,
                dtype={"geom": Geometry("GEOMETRYCOLLECTION", srid=4326)},
            )

            session.commit()
            # Close the connection to prevent issues
            session.close()
            # breakpoint()
            # return the all regions of the of the user
            sql_query = f"SELECT * FROM regions WHERE user_name='{user_name}'"
            user_regions_df = gpd.GeoDataFrame.from_postgis(sql_query, engine)

            response_obj["regions"] = user_regions_df.to_dict(orient="records")
            default_region = next(
                (item for item in response_obj["regions"] if item["default"]), None
            )

            default_region_geometry = shapely.to_geojson(default_region["geom"])

            response_obj["regions"] = [
                {k: v for k, v in obj.items() if k != "geom"}
                for obj in response_obj["regions"]
            ]
            response_obj["default_geom"] = default_region_geometry
        else:
            response_obj["msge"] = "Please, create an account, and login"
    except Exception:
        response_obj["msge"] = "Error saving the Regions for current user"
    return JsonResponse(response_obj)


@controller
def previewUserRegionFromFile(request):
    region = {}
    # breakpoint()
    file_data = request.FILES.getlist("files")[0]
    df = gpd.read_file(file_data)
    df.crs = "EPSG:4326"
    df["geom"] = df["geometry"]
    # df["geom"] = df["geometry"].apply(shapely.wkt.loads)
    df = df.drop("geometry", axis=1)
    dest = gpd.GeoDataFrame(
        columns=["name", "geom"],
        crs="EPSG:4326",
        geometry=[GeometryCollection(df["geom"].tolist())],
    )
    dest["name"] = "preview"
    dest["geom"] = dest["geometry"]
    dest = dest.drop("geometry", axis=1)
    dest = dest.set_geometry("geom")
    # dest["geom"] = dest["geom"].apply(lambda x: WKTElement(x.wkt, srid=4326))
    region_dict = dest.to_dict(orient="records")
    default_region_geometry = shapely.to_geojson(region_dict[0]["geom"])
    region["geom"] = default_region_geometry
    return JsonResponse(region)


@controller
def getUserRegions(request):
    # breakpoint()
    regions_response = {}
    if request.user.is_authenticated:
        print("authenticated")
        user_name = request.user.username
        engine = app.get_persistent_store_database("user_data")
        sql_query = f"SELECT * FROM regions WHERE user_name='{user_name}'"

        user_regions_df = gpd.GeoDataFrame.from_postgis(sql_query, engine)
        regions_response["regions"] = user_regions_df.to_dict(orient="records")
        # breakpoint()

        for region in regions_response["regions"]:
            region["geom"] = shapely.to_geojson(region["geom"])

        for region in regions_response["regions"]:
            if region["default"]:
                region["is_visible"] = True
            else:
                region["is_visible"] = False

        # get the user_id and user name, get the actual User Object
        # get all the region associated with the userID
        # pass all the regions to front end
    else:
        regions_response["regions"] = []
        regions_response["default_geom"] = {}
    return JsonResponse(regions_response)


@controller
def getForecastData(request):
    station_id = request.GET.get("station_id")
    products = json.loads(request.GET.get("products"))
    print(station_id)
    # breakpoint()
    response = "executing"
    try:
        api_base_url = BASE_API_URL
        asyncio.run(make_api_calls(api_base_url, station_id, products))

    except Exception as e:
        print("getForecastData error")
        print(e)

    return JsonResponse({"state": response})


def updateForecastData(station_id, products):
    response = "updating"
    try:
        api_base_url = BASE_API_URL
        # breakpoint()
        # loop = asyncio.get_event_loop()
        # loop.close()
        # loop = asyncio.get_running_loop()
        # await loop.create_task(make_api_calls(api_base_url,station_id,products))
        # loop.run_until_complete(make_api_calls(api_base_url,station_id,products))

        asyncio.run(make_api_calls(api_base_url, station_id, products))

    except Exception as e:
        print("updateForecastData error")
        print(e)

    return JsonResponse({"state": response})


async def make_api_calls(api_base_url, station_id, products):
    list_async_task = []
    for product in products:
        if products[product].get("is_requested") == True:
            method_name = products[product].get("name_product")
            task_get_forecast_data = asyncio.create_task(
                api_forecast_call(api_base_url, station_id, method_name)
            )
            list_async_task.append(task_get_forecast_data)

    results = await asyncio.gather(*list_async_task)

    return results


async def api_forecast_call(api_base_url, station_id, method_name):
    mssge_string = "Complete"
    channel_layer = get_channel_layer()
    # print(station_id)
    # breakpoint()

    try:
        print(f"{api_base_url}/{method_name}/streamflow/")
        print(station_id)
        print(method_name)
        # response_await = await async_client.get(
        #     url = f"{api_base_url}/{method_name}/streamflow",
        #     params = {
        #         "station_id": station_id
        #     },
        #     timeout=None
        # )
        async with httpx.AsyncClient() as client:
            response_await = await client.get(
                url=f"{api_base_url}/{method_name}/streamflow",
                params={"station_id": station_id},
                timeout=None,
            )
        # print(response_await)
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


async def getUserRegionsMethod(is_authenticated, user_name):
    regions_response = {}
    json_response = {}
    json_response["type"] = "region_notifications"
    json_response["command"] = "update_regions_users"

    if is_authenticated:
        print("authenticated getUserRegionsMethod")
        # breakpoint()
        engine = await sync_to_async(app.get_persistent_store_database)("user_data")
        sql_query = f"SELECT * FROM regions WHERE user_name='{user_name}'"

        user_regions_df = gpd.GeoDataFrame.from_postgis(sql_query, engine)
        regions_response["regions"] = user_regions_df.to_dict(orient="records")

        for region in regions_response["regions"]:
            region["geom"] = shapely.to_geojson(region["geom"])

        for region in regions_response["regions"]:
            if region["default"]:
                region["is_visible"] = True
            else:
                region["is_visible"] = False
        json_response["mssg"] = "completed"

    else:
        regions_response["regions"] = []
        json_response["mssg"] = "not aunthenticated"

    json_response["data"] = regions_response["regions"]

    return json_response

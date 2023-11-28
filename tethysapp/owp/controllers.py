from django.shortcuts import render
from django.http import JsonResponse
import pandas as pd
import asyncio
from channels.layers import get_channel_layer
import httpx
import json
import fiona
from tethys_sdk.routing import controller
from django.contrib.auth.models import User
import io
from fiona.io import ZipMemoryFile

from requests import Request
import geopandas as gpd
from geoalchemy2 import Geometry, WKTElement
import os
from sqlalchemy.orm import sessionmaker
from .model import Base, Region, Reach
from .app import Owp as app
from shapely.geometry import GeometryCollection, box, MultiLineString
import shapely.wkt
from .model import Region
import shapely
from asgiref.sync import sync_to_async
from .utilities import measure_sync, measure_async
import pyogrio
import pygeos as pg
from .model import Region
from pynhd import NLDI, WaterData, NHDPlusHR, NHD
import pynhd as nhd
import pyproj
from pyproj import Transformer
from sqlalchemy import Integer, String, or_
from sqlalchemy.sql import cast, func
from oauthlib.oauth2 import TokenExpiredError
from hs_restclient import (
    HydroShare,
    HydroShareAuthOAuth2,
    HydroShareNotFound,
    HydroShareAuthBasic,
)
from tethys_services.backends.hs_restclient_helper import get_oauth_hs
from .helpers import get_oauth_hs_channels, HSClientInitException
import pickle

BASE_API_URL = "https://nwmdata.nohrsc.noaa.gov/latest/forecasts"
async_client = httpx.AsyncClient()


@controller
def home(request):
    """Controller for the app home page."""
    # The index.html template loads the React frontend
    try:
        hs = get_oauth_hs(request)
        context = {}
    except HSClientInitException:
        context = {"message": "Error saving the Regions for current user"}
    except Exception:
        context = {"message": "Error saving the Regions for current user"}
    return render(request, "owp/index.html", context)


#     station_id = request.GET.get('station_id')
#     url=f'{BASE_API_URL}/analysis_assim/streamflow?station_id={station_id}'
#     # https://nwmdata.nohrsc.noaa.gov/latest/forecasts/short_range/streamflow?station_id=19266232

#     #https://nwmdata.nohrsc.noaa.gov/latest/forecasts/long_range_ensemble_mean/streamflow?station_id=19266232
#     #https://nwmdata.nohrsc.noaa.gov/latest/forecasts/long_range_ensemble_member_4/streamflow?station_id=19266232 this until essemble 1-4

#     #https://nwmdata.nohrsc.noaa.gov/latest/forecasts/medium_range_ensemble_mean/streamflow?station_id=19266232

#     #https://nwmdata.nohrsc.noaa.gov/latest/forecasts/medium_range_ensemble_member_7/streamflow?station_id=19266232 this until ensemble 1-7


def create_hydroshare_resource_for_region(hs, file_obj, file_name, region_name):
    abstract = f"{region_name} Region created using the OWP Hydroviewer"
    title = f"{region_name}"
    keywords = ("OWP_Tethys_App", "NHD", "CIROH", "NWM", "comid_json", "OWP")
    # https://www.hydroshare.org/terms/
    rtype = "CompositeResource"
    fpath = file_obj

    resource_id = hs.createResource(rtype, title, keywords=keywords, abstract=abstract)
    # check if folder for region was created or not
    # breakpoint()

    result = hs.addResourceFile(
        resource_id, resource_file=file_obj, resource_filename=file_name
    )
    hs.setAccessRules(resource_id, public=True)

    return result


def add_file_to_hydroshare_resource_for_region(
    hs, file_obj, file_name, region_name, resource_id
):
    result = hs.addResourceFile(
        resource_id, resource_file=file_obj, resource_filename=file_name
    )
    return result


def create_reaches_json(df):
    data = df["comid"].tolist()
    result = [{"comid": comid} for comid in data]
    return result


# Define a function to convert MultiLineString with 3 dimensions to 2 dimensions
def _to_2d(x, y, z=None):
    if z is None:
        return (x, y)
    return tuple(filter(None, [x, y]))


@controller
@measure_sync
def saveUserRegionsFromReaches(request):
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
            region_name = request.POST.get("name")
            file_data = request.FILES.getlist("files")[0]
            column_id = request.POST.get("column_name")

            # check for file extension
            file_extension = file_data.name.split(".")[-1]

            if file_extension == "csv":
                df_reaches = pd.read_csv(file_data)
                list_of_reaches = df_reaches[column_id].tolist()
                number_reaches = len(list_of_reaches)
            # breakpoint()

            # Create an instance of the Region model
            region_instance = Region(
                name=region_name, region_type="file", user_name=user_name
            )
            session.add(region_instance)
            session.commit()

            new_user_region = (
                session.query(Region.id, Region.number_reaches)
                .filter(Region.user_name == user_name)
                .filter(Region.name == region_name)
            )

            new_user_region_id = new_user_region[0].id

            # mr = NHD("flowline_mr")
            mr = WaterData("nhdflowline_network")

            list_df_nhdp = []
            chunk_size = 3000
            chunks = [
                list_of_reaches[i : i + chunk_size]
                for i in range(0, len(list_of_reaches), chunk_size)
            ]
            try:
                for chunk in chunks:
                    # nhdp_mr = mr.byids("COMID", list_of_reaches)
                    nhdp_mr = mr.byid("comid", chunk)
                    list_df_nhdp.append(nhdp_mr)
            except Exception as e:
                print(e)
            nhdp_mr_final = pd.concat(list_df_nhdp, ignore_index=True)
            nhdp_mr_final["geometry"] = nhdp_mr_final["geometry"].apply(
                lambda geom: shapely.ops.transform(_to_2d, geom)
            )
            nhdp_mr_final = nhdp_mr_final.explode(index_parts=False)
            nhdp_mr_final["region_id"] = new_user_region_id
            # breakpoint()
            # make the geometry from bounding box of all the geometries in the nhdp_mr
            bounding_box = nhdp_mr_final.total_bounds
            minx, miny, maxx, maxy = bounding_box
            bbox_polygon = box(minx, miny, maxx, maxy)
            geometry_collection = GeometryCollection([bbox_polygon])
            geometry_collection_wkt = WKTElement(geometry_collection.wkt, srid=4326)

            nhdp_mr_final["geometry"] = nhdp_mr_final["geometry"].apply(
                lambda x: WKTElement(x.wkt, srid=4326)
            )
            # breakpoint()

            nhdp_mr_final.to_sql(
                name="reaches",
                con=engine,
                if_exists="append",
                index=False,
                dtype={"geometry": Geometry("LINESTRING", srid=4326)},
            )
            session.commit()

            session.query(Region).filter(Region.user_name == user_name).filter(
                Region.name == region_name
            ).update({Region.number_reaches: number_reaches})

            session.query(Region).filter(Region.user_name == user_name).filter(
                Region.name == region_name
            ).update({Region.geom: geometry_collection_wkt})

            session.commit()
            # Close the connection to prevent issues
            session.close()

            # create Hydroshare_resource
            s_buf = io.StringIO()
            nhdp_mr_final.to_csv(s_buf, index=False)
            hs = get_oauth_hs(request)
            response_dict = create_hydroshare_resource_for_region(
                hs, s_buf, "reaches_nhd_data.csv", region_name
            )
            # create json with comids
            comids_json = create_reaches_json(nhdp_mr_final)
            json_data = json.dumps(comids_json)
            file_object = io.BytesIO(json_data.encode("utf-8"))
            hs = get_oauth_hs(request)

            add_file_to_hydroshare_resource_for_region(
                hs,
                file_object,
                "nwm_comids.json",
                region_name,
                response_dict["resource_id"],
            )
            response_obj["regions"] = []
            region = {}
            region["region_type"] = "file"
            region["name"] = region_name
            region["layer_color"] = None
            region["user_name"] = user_name
            region["geom"] = shapely.to_geojson(geometry_collection)
            region["is_visible"] = False
            region["total_reaches"] = number_reaches
            response_obj["regions"].append(region)
        else:
            response_obj["msge"] = "Please, create an account, and login"
    except Exception as e:
        print(e)
        response_obj["msge"] = "Error saving the Regions for current user"

    # breakpoint()
    return JsonResponse(response_obj)


@controller
@measure_sync
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
            region_layer_color = request.POST.get("layer_color")

            if region_type == "huc":
                region_data = json.loads(request.POST.get("region_data"))
                df = gpd.GeoDataFrame.from_features(region_data)
                df = df.set_crs(3857)
                # df.crs = "EPSG:4326"
                df["geom"] = df["geometry"]
                df_copy = df.copy()
                df_copy = df_copy.set_crs(3857)
                df_copy = df_copy.to_crs(4326)
                df_copy["geom"] = df_copy["geometry"]
                df = df.drop("geometry", axis=1)
                dest = gpd.GeoDataFrame(
                    columns=["name", "region_type", "user_name", "geom"],
                    # crs="EPSG:4326",
                    geometry=[GeometryCollection(df["geom"].tolist())],
                )
                dest = dest.set_crs(3857)
                dest = dest.to_crs(4326)
                # breakpoint()

                # get the Reach mode
            else:
                # check for different files or single file
                file_data = request.FILES.getlist("files")[0]
                if len(request.FILES.getlist("files")) > 1:
                    file_data = request.FILES.getlist("files")

                # check for file extension
                file_extension = file_data.name.split(".")[-1]

                if file_extension == "gpkg":
                    # check for layers inf geopackage
                    layer_name = request.POST.get("layers_geopackage")
                    if layer_name:
                        df = gpd.read_file(file_data, layer=layer_name)
                    else:
                        df = gpd.read_file(file_data)

                if file_extension == "zip":
                    # https://stackoverflow.com/questions/50638374/expected-str-bytes-or-os-pathlike-object-not-inmemoryuploadedfile
                    with ZipMemoryFile(file_data) as memfile:
                        with memfile.open() as src:
                            crs = src.crs
                            df = gpd.GeoDataFrame.from_features(src, crs=crs)
                if file_extension == "geojson" or file_extension == "json":
                    df = gpd.read_file(file_data)

                # df = df.to_crs(epsg=3857)
                df = df.to_crs(epsg=4326)
                # breakpoint()
                df["geom"] = df["geometry"]
                df_copy = df.copy()
                # df_copy = df_copy.set_crs(3857)
                # df_copy = df_copy.to_crs(4326)

                df_copy["geom"] = df_copy["geometry"]
                df = df.drop("geometry", axis=1)
                dest = gpd.GeoDataFrame(
                    columns=["name", "region_type", "user_name", "geom"],
                    crs="EPSG:4326",
                    geometry=[GeometryCollection(df["geom"].tolist())],
                )

            dest["region_type"] = region_type
            dest["name"] = region_name
            dest["layer_color"] = region_layer_color
            dest["user_name"] = user_name
            dest["geom"] = dest["geometry"]
            dest["number_reaches"] = 0
            dest = dest.drop("geometry", axis=1)
            dest = dest.set_geometry("geom")
            # convert to dict before converting geometry to WKTElement
            response_obj["regions"] = dest.to_dict(orient="records")
            geometry_collection_clipping = dest["geom"][0]
            dest["geom"] = dest["geom"].apply(lambda x: WKTElement(x.wkt, srid=4326))

            dest.to_sql(
                name="regions",
                con=engine,
                if_exists="append",
                index=False,
                dtype={"geom": Geometry("GEOMETRYCOLLECTION", srid=4326)},
            )
            session.commit()
            new_user_region = (
                session.query(Region.id, Region.number_reaches)
                .filter(Region.user_name == user_name)
                .filter(Region.name == region_name)
            )
            new_user_region_id = new_user_region[0].id

            list_geoms = df_copy["geom"].tolist()
            mr = WaterData("nhdflowline_network")

            total_reaches = 0
            # breakpoint()
            list_df_nhdp = []

            for index, geom in enumerate(list_geoms):
                # nhdp_mr = mr.bygeom(geometry_collection_clipping.bounds)
                try:
                    nhdp_mr = mr.bygeom(geom)
                    # breakpoint()
                    list_df_nhdp.append(nhdp_mr)
                except Exception as e:
                    print(e)
                    continue
                nhdp_mr["region_id"] = new_user_region_id
                # breakpoint()
                nhdp_mr["geometry"] = nhdp_mr["geometry"].apply(
                    lambda geom: shapely.ops.transform(_to_2d, geom)
                )
                nhdp_mr = nhdp_mr.explode(index_parts=False)
                nhdp_mr["geometry"] = nhdp_mr["geometry"].apply(
                    lambda x: WKTElement(x.wkt, srid=4326)
                )

                nhdp_mr.to_sql(
                    name="reaches",
                    con=engine,
                    if_exists="append",
                    index=False,
                    dtype={"geometry": Geometry("LINESTRING", srid=4326)},
                )
                total_reaches = total_reaches + len(nhdp_mr.index)
                session.commit()
            # breakpoint()
            nhdp_mr_final = pd.concat(list_df_nhdp, ignore_index=True)

            # create Hydroshare_resource
            s_buf = io.StringIO()
            nhdp_mr_final.to_csv(s_buf, index=False)
            hs = get_oauth_hs(request)
            # breakpoint()
            response_dict = create_hydroshare_resource_for_region(
                hs, s_buf, "reaches_nhd_data.csv", region_name
            )
            # create json with comids
            comids_json = create_reaches_json(nhdp_mr_final)
            json_data = json.dumps(comids_json)
            file_object = io.BytesIO(json_data.encode("utf-8"))
            add_file_to_hydroshare_resource_for_region(
                hs,
                file_object,
                "nwm_comids.json",
                region_name,
                response_dict["resource_id"],
            )

            session.query(Region).filter(Region.user_name == user_name).filter(
                Region.name == region_name
            ).update({Region.number_reaches: total_reaches})
            session.commit()
            # Close the connection to prevent issues
            session.close()
            for region in response_obj["regions"]:
                region["geom"] = shapely.to_geojson(region["geom"])
                region["is_visible"] = False
                region["total_reaches"] = total_reaches
        else:
            response_obj["msge"] = "Please, create an account, and login"
    except Exception as e:
        print(e)
        response_obj["msge"] = "Error saving the Regions for current user"

    # breakpoint()
    return JsonResponse(response_obj)


@controller
def getGeopackageLayersFromFile(request):
    region = {}
    # breakpoint()
    file_data = request.FILES.getlist("files")[0]
    layers = fiona.listlayers(file_data)
    list_layers_dict = []
    for layer in layers:
        list_layers_dict.append(layer)
        # list_layers_dict.append({"name": layer, "value": layer})

    region["layers"] = list_layers_dict
    return JsonResponse(region)


@controller
@measure_sync
def previewUserRegionFromFile(request):
    region = {}
    # check for different files or single file
    file_data = request.FILES.getlist("files")[0]
    if len(request.FILES.getlist("files")) > 1:
        file_data = request.FILES.getlist("files")

    # check for file extension
    file_extension = file_data.name.split(".")[-1]

    if file_extension == "gpkg":
        # check for layers inf geopackage
        layer_name = request.POST.get("layers_geopackage")
        if layer_name:
            df = gpd.read_file(file_data, layer=layer_name)
        else:
            df = gpd.read_file(file_data)

    if file_extension == "zip":
        # https://stackoverflow.com/questions/50638374/expected-str-bytes-or-os-pathlike-object-not-inmemoryuploadedfile
        with ZipMemoryFile(file_data) as memfile:
            with memfile.open() as src:
                crs = src.crs
                df = gpd.GeoDataFrame.from_features(src, crs=crs)
    if file_extension == "geojson" or file_extension == "json":
        df = gpd.read_file(file_data)

    crs_df = "EPSG:3857"
    df = df.to_crs(epsg=3857)
    df["geom"] = df["geometry"]
    # df["geom"] = df["geometry"].apply(shapely.wkt.loads)
    df = df.drop("geometry", axis=1)
    dest = gpd.GeoDataFrame(
        columns=["name", "geom"],
        crs=crs_df,
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
@measure_sync
def previewUserColumnsFromFile(request):
    response = {}
    # check for different files or single file
    file_data = request.FILES.getlist("files")[0]
    if len(request.FILES.getlist("files")) > 1:
        file_data = request.FILES.getlist("files")

    df_reaches = pd.read_csv(file_data)
    column_list = df_reaches.columns.tolist()
    response["columns"] = column_list
    return JsonResponse(response)


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


@measure_async
async def getUserRegionsMethod(is_authenticated, user_name):
    regions_response = {}
    json_response = {}
    json_response["type"] = "region_notifications"
    json_response["command"] = "update_regions_users"
    # breakpoint()

    if is_authenticated:
        print("authenticated getUserRegionsMethod")
        SessionMaker = await sync_to_async(app.get_persistent_store_database)(
            "user_data", as_sessionmaker=True
        )
        session = SessionMaker()
        only_user_regions = session.query(
            Region.name,
            Region.region_type,
            Region.geom.ST_AsGeoJSON(),
            Region.layer_color,
            Region.number_reaches,
        ).filter(Region.user_name == user_name)
        regions_response["regions"] = []
        # breakpoint()

        for region in only_user_regions:
            region_obj = {
                "name": region[0],
                "reqion_type": region[1],
                "geom": region[2],
                "layer_color": region[3],
                "number_reaches": region[4],
                "is_visible": False,
            }
            regions_response["regions"].append(region_obj)

        json_response["mssg"] = "completed"

    else:
        regions_response["regions"] = []
        json_response["mssg"] = "not aunthenticated"

    json_response["data"] = regions_response["regions"]

    return json_response


@measure_async
async def getUserReachesPerRegionsMethod(
    is_authenticated,
    user_name,
    region_name,
    page_number=0,
    page_limit=50,
    search_term="",
):
    regions_response = {}
    json_response = {}
    json_response["type"] = "reach_notifications"
    json_response["command"] = "update_reaches_users"
    json_response["total_reaches"] = 0
    # breakpoint()
    # breakpoint()
    if is_authenticated:
        print("authenticated getUserReachesPerRegionsMethod")
        SessionMaker = await sync_to_async(app.get_persistent_store_database)(
            "user_data", as_sessionmaker=True
        )
        session = SessionMaker()
        page_number = page_number - 1
        page_offset = page_number * page_limit
        only_user_reaches_regions = (
            session.query(
                Reach.gnis_name,
                Reach.comid,
                Reach.streamorde,
                Reach.streamcalc,
                Reach.qa_ma,
            )
            .join(Region)
            .filter(Region.name == region_name)
            .filter(Region.user_name == user_name)
            .order_by(Reach.gnis_name.desc())
        )
        json_response["total_reaches"] = len(only_user_reaches_regions.all())

        if search_term:
            # breakpoint()
            only_user_reaches_regions = only_user_reaches_regions.filter(
                or_(
                    cast(Reach.comid, String).like(f"%{search_term}%"),
                    cast(Reach.gnis_name, String).like(f"%{search_term}%"),
                )
            )
        if page_number > 0:
            only_user_reaches_regions = only_user_reaches_regions.offset(page_offset)

        only_user_reaches_regions = only_user_reaches_regions.limit(page_limit)

        print(
            page_limit,
            page_number,
            page_offset,
            search_term,
            len(only_user_reaches_regions.all()),
        )
        regions_response["reaches"] = []

        for region in only_user_reaches_regions:
            region_obj = {
                "GNIS_NAME": region[0],
                "COMID": region[1],
                "StreamOrde": region[2],
                "StreamCalc": region[3],
                "QA_MA": region[4],
            }
            regions_response["reaches"].append(region_obj)

        json_response["mssg"] = "completed"

    else:
        regions_response["reaches"] = []
        json_response["mssg"] = "not aunthenticated"

    json_response["data"] = regions_response["reaches"]

    return json_response


@measure_async
async def getUserSpecificReachMethod(is_authenticated, user_name, reach_comid):
    json_response = {}
    json_response["type"] = "single_reach_notifications"
    json_response["command"] = "zoom_to_specific_reach"

    if is_authenticated:
        print("authenticated getUserSpecificReachMethod")
        SessionMaker = await sync_to_async(app.get_persistent_store_database)(
            "user_data", as_sessionmaker=True
        )
        session = SessionMaker()

        reach_data = (
            session.query(
                Reach.comid,
                Reach.geometry.ST_AsGeoJSON(),
            )
            .join(Region)
            .filter(cast(Reach.comid, String).like(f"%{reach_comid}%"))
            .filter(Region.user_name == user_name)
            .order_by(Reach.comid.desc())
            .first()
        )

        region_obj = {
            "COMID": reach_data[0],
            "geometry": reach_data[1],
        }

        json_response["mssg"] = "completed"

    else:
        json_response["mssg"] = "not aunthenticated"
        json_response["data"] = {}

    json_response["data"] = region_obj

    return json_response


# @measure_async
async def getUserSpecificHydroShareRegions(is_authenticated, self_scope):
    json_response = {}
    json_response["type"] = "hydroshare_regions_notifications"
    json_response["command"] = "show_hydroshare_regions_notifications"
    keywords = ["OWP_Tethys_App", "comid_json"]
    try:
        if is_authenticated:
            print("authenticated getUserSpecificReachMethod")
            hs = await sync_to_async(get_oauth_hs_channels)(self_scope)
            resources = hs.resources(subject=keywords)
            json_response["data"] = []
            for resource in resources:
                resource_data = {}
                resource_data["value"] = resource["resource_id"]
                resource_data["label"] = resource["resource_title"]
                # resource_data["public"] = resource["public"]
                json_response["data"].append(resource_data)
            json_response["mssg"] = "completed"
            # breakpoint()

            hs = await sync_to_async(get_oauth_hs_channels)(self_scope)
            private_resources = hs.resources(
                subject=keywords,
                # metadata={"public": False},
            )
            json_response["private_data"] = []
            for private_resource in private_resources:
                if not private_resource["public"]:
                    resource_data = {}
                    resource_data["value"] = private_resource["resource_id"]
                    resource_data["label"] = private_resource["resource_title"]
                    json_response["private_data"].append(private_resource)
            json_response["mssg"] = "completed"

        else:
            json_response["mssg"] = "not aunthenticated"
            json_response["data"] = []
            json_response["private_data"] = []

    except HSClientInitException as e:
        print(e)
        json_response["mssg"] = "Not logged in through HydroShare"
        json_response["data"] = []
        json_response["private_data"] = []

    # json_response["data"] = resources

    return json_response


def get_url_by_filename(file_info, file_name):
    for file_data in file_info:
        if file_data["file_name"] == file_name:
            return file_data["url"]
    return None  # Return None if file_name not found in the list


@controller
@measure_sync
def saveUserRegionsFromHydroShareResource(request):
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
            region_name = request.POST.get("regionName")
            resource_id = request.POST.get("hydrosharePublicRegions")

            # please create own function to auth and return hs object
            hs = get_oauth_hs(request)

            list_files = hs.resource(resource_id).files.all().json()["results"]
            url_file = get_url_by_filename(list_files, "reaches_nhd_data.csv")
            df = pd.read_csv(url_file, index_col=False)
            # breakpoint()
            df_reaches = gpd.GeoDataFrame(
                df, crs=4326, geometry=gpd.GeoSeries.from_wkt(df["geometry"])
            )
            list_of_reaches = df_reaches["geometry"].tolist()
            number_reaches = len(list_of_reaches)

            # Create an instance of the Region model
            region_instance = Region(
                name=region_name, region_type="file", user_name=user_name
            )
            session.add(region_instance)
            session.commit()

            new_user_region = (
                session.query(Region.id, Region.number_reaches)
                .filter(Region.user_name == user_name)
                .filter(Region.name == region_name)
            )

            new_user_region_id = new_user_region[0].id
            df_reaches["region_id"] = new_user_region_id
            breakpoint()
            df_reaches["geometry"] = df_reaches["geometry"].apply(
                lambda geom: shapely.ops.transform(_to_2d, geom)
            )
            df_reaches = df_reaches.explode(index_parts=False)
            # make the geometry from bounding box of all the geometries in the nhdp_mr
            bounding_box = df_reaches.total_bounds
            minx, miny, maxx, maxy = bounding_box
            bbox_polygon = box(minx, miny, maxx, maxy)
            geometry_collection = GeometryCollection([bbox_polygon])
            geometry_collection_wkt = WKTElement(geometry_collection.wkt, srid=4326)

            df_reaches["geometry"] = df_reaches["geometry"].apply(
                lambda x: WKTElement(x.wkt, srid=4326)
            )
            # breakpoint()

            df_reaches.to_sql(
                name="reaches",
                con=engine,
                if_exists="append",
                index=False,
                dtype={"geometry": Geometry("LINESTRING", srid=4326)},
            )
            session.commit()
            session.query(Region).filter(Region.user_name == user_name).filter(
                Region.name == region_name
            ).update({Region.number_reaches: number_reaches})

            session.query(Region).filter(Region.user_name == user_name).filter(
                Region.name == region_name
            ).update({Region.geom: geometry_collection_wkt})

            session.commit()

            session.close()
            response_obj["regions"] = []
            region = {}
            region["region_type"] = "file"
            region["name"] = region_name
            region["layer_color"] = None
            region["user_name"] = user_name
            region["geom"] = shapely.to_geojson(geometry_collection)
            region["is_visible"] = False
            region["total_reaches"] = number_reaches
            response_obj["regions"].append(region)
        else:
            response_obj["msge"] = "Please, create an account, and login"
    except Exception as e:
        print(e)
        response_obj["msge"] = "Error saving the Regions for current user"

    # breakpoint()
    return JsonResponse(response_obj)

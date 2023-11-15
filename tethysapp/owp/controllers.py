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
from shapely.geometry import GeometryCollection, box
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
from sqlalchemy import Integer, String
from sqlalchemy.sql import cast, func
from oauthlib.oauth2 import TokenExpiredError
from hs_restclient import (
    HydroShare,
    HydroShareAuthOAuth2,
    HydroShareNotFound,
    HydroShareAuthBasic,
)

import pickle

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


def create_hydroshare_resource_for_region(file_obj, file_name, region_name):
    hydroshare_user = app.get_custom_setting("hydroshare_username")
    hydroshare_passwd = app.get_custom_setting("hydroshare_password")

    client_id = app.get_custom_setting("hydroshare_client_id")
    client_secret = app.get_custom_setting("hydroshare_client_secret")

    # auth = HydroShareAuthOAuth2(
    #     client_id, client_secret, username=hydroshare_user, password=hydroshare_passwd
    # )
    auth = HydroShareAuthBasic(username=hydroshare_user, password=hydroshare_passwd)
    abstract = f"{region_name} Region created using the OWP Hydroviewer"
    title = f"{region_name}"
    keywords = ("OWP", "NHD", "CIROH", "NWM", "comid_json")
    # https://www.hydroshare.org/terms/
    rtype = "CompositeResource"
    fpath = file_obj
    hs = HydroShare(auth=auth)

    try:
        resource_id = hs.createResource(
            rtype, title, keywords=keywords, abstract=abstract
        )
        # check if folder for region was created or not
        # breakpoint()

        result = hs.addResourceFile(
            resource_id, resource_file=file_obj, resource_filename=file_name
        )
        hs.setAccessRules(resource_id, public=True)
    except TokenExpiredError as e:
        hs = HydroShare(auth=auth)
        resource_id = hs.createResource(
            rtype, title, resource_file=fpath, keywords=keywords, abstract=abstract
        )
        # check if folder for region was created or not
        result = hs.addResourceFile(
            resource_id, resource_file=file_obj, resource_filename=file_name
        )
        hs.setAccessRules(resource_id, public=True)

    return result


def add_file_to_hydroshare_resource_for_region(
    file_obj, file_name, region_name, resource_id
):
    hydroshare_user = app.get_custom_setting("hydroshare_username")
    hydroshare_passwd = app.get_custom_setting("hydroshare_password")
    auth = HydroShareAuthBasic(username=hydroshare_user, password=hydroshare_passwd)
    hs = HydroShare(auth=auth)

    try:
        result = hs.addResourceFile(
            resource_id, resource_file=file_obj, resource_filename=file_name
        )
    except TokenExpiredError as e:
        hs = HydroShare(auth=auth)
        result = hs.addResourceFile(
            resource_id, resource_file=file_obj, resource_filename=file_name
        )

    return result


def create_reaches_json(df):
    data = df["COMID"].tolist()
    result = [{"comid": comid} for comid in data]
    return result


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
                wkt=None, name=region_name, region_type="file", user_name=user_name
            )
            session.add(region_instance)
            session.commit()

            new_user_region = (
                session.query(Region.id, Region.number_reaches)
                .filter(Region.user_name == user_name)
                .filter(Region.name == region_name)
            )

            new_user_region_id = new_user_region[0].id

            mr = NHD("flowline_mr")
            # breakpoint()
            list_df_nhdp = []
            chunk_size = 3000
            chunks = [
                list_of_reaches[i : i + chunk_size]
                for i in range(0, len(list_of_reaches), chunk_size)
            ]
            try:
                for chunk in chunks:
                    # nhdp_mr = mr.byids("COMID", list_of_reaches)
                    nhdp_mr = mr.byids("COMID", chunk)
                    list_df_nhdp.append(nhdp_mr)
            except Exception as e:
                print(e)
            nhdp_mr_final = pd.concat(list_df_nhdp, ignore_index=True)
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
            nhdp_mr_final.to_csv(s_buf)
            response_dict = create_hydroshare_resource_for_region(
                s_buf, "reaches_nhd_data.csv", region_name
            )
            # create json with comids
            comids_json = create_reaches_json(nhdp_mr_final)
            json_data = json.dumps(comids_json)
            file_object = io.BytesIO(json_data.encode("utf-8"))

            add_file_to_hydroshare_resource_for_region(
                file_object,
                "nwm_comids.json",
                region_name,
                response_dict["resource_id"],
            )
            response_obj["regions"] = []
            region = {}
            region["region_type"] = "file"
            region["default"] = False
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
            region_default = request.POST.get("default")
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
                    columns=["name", "region_type", "default", "user_name", "geom"],
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
            mr = NHD("flowline_mr")

            total_reaches = 0
            # breakpoint()

            for index, geom in enumerate(list_geoms):
                # nhdp_mr = mr.bygeom(geometry_collection_clipping.bounds)
                try:
                    nhdp_mr = mr.bygeom(geom)
                except Exception as e:
                    print(e)
                    continue
                nhdp_mr["region_id"] = new_user_region_id
                # breakpoint()

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
            session.query(Region).filter(Region.user_name == user_name).filter(
                Region.name == region_name
            ).update({Region.number_reaches: total_reaches})
            session.commit()
            # Close the connection to prevent issues
            session.close()

            for region in response_obj["regions"]:
                region["geom"] = shapely.to_geojson(region["geom"])
                if region["default"]:
                    region["is_visible"] = True
                else:
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
@measure_sync
def getUserRegions(request):
    # breakpoint()
    regions_response = {}
    if request.user.is_authenticated:
        print("authenticated")
        user_name = request.user.username
        engine = app.get_persistent_store_database("user_data")

        sql_query = (
            f"SELECT * FROM regions WHERE user_name='{user_name}' AND name='Test 1'"
        )

        # df = pd.read_sql(sql_query, con=engine)
        # df["geom"] = pg.from_wkb(df.geom.values)
        # srid = pg.get_srid(df.geom.values[0])
        # user_regions_df = gpd.GeoDataFrame(df, geometry="geom", crs=f"EPSG:{srid}")
        # db_path = engine.url
        # df = pyogrio.read_dataframe(db_path, layer="regions")
        user_regions_df = gpd.read_postgis(sql_query, engine)
        # user_regions_df = gpd.GeoDataFrame.from_postgis(sql_query, engine)

        regions_response["regions"] = user_regions_df.to_dict(orient="records")

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
            Region.default,
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
                "default": region[2],
                "geom": region[3],
                "layer_color": region[4],
                "number_reaches": region[5],
                "is_visible": region[2],
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
                Reach.GNIS_NAME,
                Reach.COMID,
                Reach.StreamOrde,
                Reach.StreamCalc,
                Reach.QA_MA,
            )
            .join(Region)
            .filter(Region.name == region_name)
            .filter(Region.user_name == user_name)
            .order_by(Reach.COMID.desc())
        )
        json_response["total_reaches"] = len(only_user_reaches_regions.all())

        if search_term:
            # breakpoint()
            only_user_reaches_regions = only_user_reaches_regions.filter(
                cast(Reach.COMID, String).like(f"%{search_term}%")
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

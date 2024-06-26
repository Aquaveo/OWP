import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .controllers import get_hs_login_status_method


from .regions import (
    getUserRegionsMethod,
    getUserReachesPerRegionsMethod,
    getUserSpecificReachMethod,
    getUserSpecificHydroShareRegions,
)


from tethys_sdk.routing import consumer


@consumer(name="data_notification", url="owp/data-notification/notifications")
class DataConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add("notifications_owp", self.channel_name)
        print(f"Added {self.channel_name} channel to owp notifications")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("notifications_owp", self.channel_name)
        print(f"Removed {self.channel_name} channel from owp notifications")

    async def receive(self, text_data):
        # Called with either text_data or bytes_data for each frame
        # You can call:
        print("receving function to consumer")
        text_data_json = json.loads(text_data)

        json_obj = {}

        if "type" in text_data_json and text_data_json["type"] == "update_user_regions":
            # asyncio.run(retrieve_data_from_file(text_data_json['reach_id']))
            json_obj = await getUserRegionsMethod(
                self.scope["user"].is_authenticated, self.scope["user"].username
            )
            await self.channel_layer.group_send(
                "notifications_owp",
                json_obj,
            )
        if "type" in text_data_json and text_data_json["type"] == "update_user_reaches":

            json_obj = await getUserReachesPerRegionsMethod(
                self.scope["user"].is_authenticated,
                self.scope["user"].username,
                text_data_json["region_name"],
                text_data_json["page_number"],
                text_data_json["page_limit"],
                text_data_json["search_term"],
            )
            await self.channel_layer.group_send(
                "notifications_owp",
                json_obj,
            )
        if "type" in text_data_json and text_data_json["type"] == "get_specific_reach":
            json_obj = await getUserSpecificReachMethod(
                self.scope["user"].is_authenticated,
                self.scope["user"].username,
                text_data_json["reach_comid"],
            )
            await self.channel_layer.group_send(
                "notifications_owp",
                json_obj,
            )

        if (
            "type" in text_data_json
            and text_data_json["type"] == "retrieve_hydroshare_regions"
        ):
            json_obj = await getUserSpecificHydroShareRegions(
                self.scope["user"].is_authenticated, self.scope
            )
            await self.channel_layer.group_send(
                "notifications_owp",
                json_obj,
            )
        if (
            "type" in text_data_json
            and text_data_json["type"] == "get_hs_login_status_method"
        ):
            json_obj = await get_hs_login_status_method(self.scope)
            await self.channel_layer.group_send(
                "notifications_owp",
                json_obj,
            )

    async def data_notifications(self, event):
        # print(event)
        print("data_notifications from consumer")

        message = event["mssg"]
        station_id = event["station_id"]
        product = event["product"]
        command = event["command"]
        data = event["data"]

        resp_obj = {
            "message": message,
            "station_id": station_id,
            "product": product,
            "command": command,
            "data": data,
        }
        await self.send(text_data=json.dumps(resp_obj))
        # print(f"Got message {event} at {self.channel_name}")

    async def region_notifications(self, event):
        # print(event)
        print("region_notifications from consumer")

        message = event["mssg"]
        command = event["command"]
        data = event["data"]

        resp_obj = {
            "message": message,
            "command": command,
            "data": data,
        }
        await self.send(text_data=json.dumps(resp_obj))

    async def single_reach_notifications(self, event):
        # print(event)
        print("single_reach_notifications from consumer")

        message = event["mssg"]
        command = event["command"]
        data = event["data"]

        resp_obj = {
            "message": message,
            "command": command,
            "data": data,
        }
        await self.send(text_data=json.dumps(resp_obj))

    async def reach_notifications(self, event):
        # print(event)
        print("reach_notifications from consumer")

        message = event["mssg"]
        command = event["command"]
        data = event["data"]

        resp_obj = {
            "message": message,
            "command": command,
            "data": data,
            "total_reaches": event["total_reaches"],
        }
        await self.send(text_data=json.dumps(resp_obj))

    async def hydroshare_regions_notifications(self, event):
        # print(event)
        print("hydroshare_regions_notifications from consumer")

        message = event["mssg"]
        command = event["command"]
        data = event["data"]
        # private_data = event["private_data"]

        resp_obj = {
            "message": message,
            "command": command,
            "data": data,
            # "private_data": private_data,
        }
        await self.send(text_data=json.dumps(resp_obj))

    async def simple_notifications(self, event):
        print("simple notification from consumer")
        message = event["mssg"]
        station_id = event["station_id"]
        product = event["product"]
        command = event["command"]
        await self.send(
            text_data=json.dumps(
                {
                    "message": message,
                    "station_id": station_id,
                    "product": product,
                    "command": command,
                }
            )
        )
        print(f"Got message {event} at {self.channel_name}")

    async def data_nwm_notifications(self, event):
        # print(event)
        print("data_nwm_notifications from consumer")

        message = event["mssg"]
        feature_id = event["feature_id"]
        start_date = event["start_date"]
        end_date = event["end_date"]
        reference_time = event["reference_time"]
        ensemble = event["ensemble"]
        command = event["command"]
        data = event["data"]

        resp_obj = {
            "message": message,
            "feature_id": feature_id,
            "start_date": start_date,
            "end_date": end_date,
            "reference_time": reference_time,
            "ensemble": ensemble,
            "command": command,
            "data": data,
        }
        await self.send(text_data=json.dumps(resp_obj))

    async def simple_api_notifications(self, event):
        print("simple simple_api_notifications from consumer")
        message = event["mssg"]
        command = event["command"]
        await self.send(
            text_data=json.dumps(
                {
                    "message": message,
                    "command": command,
                }
            )
        )

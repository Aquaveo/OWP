import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .controllers import updateForecastData, getUserRegionsMethod

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
        # print(text_data_json)
        # updateForecastData(text_data_json['station_id'],text_data_json['product'])
        # json_obj = updateForecastData(text_data_json['station_id'],text_data_json['product'])
        json_obj = {}
        # await self.channel_layer.group_send (
        #     "notifications_owp",
        #     json_obj,
        # )
        # breakpoint()
        if "type" in text_data_json and text_data_json["type"] == "update_user_regions":
            # asyncio.run(retrieve_data_from_file(text_data_json['reach_id']))
            json_obj = await getUserRegionsMethod(
                self.scope["user"].is_authenticated, self.scope["user"].username
            )
            await self.channel_layer.group_send(
                "notifications_owp",
                json_obj,
            )
        # print(mssge_string)
        # await self.send(text_data)

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
        # print(f"Got message {event} at {self.channel_name}")

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

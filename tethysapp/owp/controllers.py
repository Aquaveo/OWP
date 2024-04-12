from tethys_sdk.routing import controller
from asgiref.sync import sync_to_async
from .dev_utils import measure_async
from django.shortcuts import render
from .hs_helpers import get_oauth_hs_channels, HSClientInitException


@controller
def home(request):
    """Controller for the app home page."""
    # The index.html template loads the React frontend
    context = {}
    return render(request, "owp/index.html", context)


@measure_async
async def get_hs_login_status_method(self_scope):
    json_response = {}
    json_response["type"] = "simple_api_notifications"
    json_response["command"] = "show_hs_login_status"
    json_response["mssg"] = True

    try:
        hs = await sync_to_async(get_oauth_hs_channels)(self_scope)
        if not hs.auth:
            json_response["mssg"] = False

    except HSClientInitException:
        json_response["mssg"] = False
    except Exception:
        json_response["mssg"] = False

    return json_response

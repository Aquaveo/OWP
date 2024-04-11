from tethys_sdk.base import TethysAppBase
from tethys_sdk.app_settings import PersistentStoreDatabaseSetting
from tethys_sdk.app_settings import SecretCustomSetting, CustomSetting


class Owp(TethysAppBase):
    """
    Tethys app class for Owp.
    """

    name = "Owp"
    description = ""
    package = "owp"  # WARNING: Do not change this value
    index = "home"
    icon = f"{package}/images/owp_logo.png"
    catch_all = "home"  # Catch all url mapped to home controller, required for react browser routing
    root_url = "owp"
    color = ""  # Don't set color here, set it in reactapp/custom-bootstrap.scss
    tags = ""
    enable_feedback = False
    feedback_emails = []
    controller_modules = ["controllers", "consumer", "nwm", "regions"]

    def custom_settings(self):
        """
        Custom Settings
        """

        custom_settings = (
            CustomSetting(
                name="nwmdata_api",
                type=CustomSetting.TYPE_STRING,
                description="TYPE_STRING",
                default="https://nwmdata.nohrsc.noaa.gov/latest/forecasts",
                required=False,
            ),
            CustomSetting(
                name="base_nwp_api_url",
                type=CustomSetting.TYPE_STRING,
                description="Google API to retrieve forcast data from big query",
                # default="https://nwm-ciroh-gateway-9f6idmxh.uc.gateway.dev",
                required=False,
            ),
            SecretCustomSetting(
                name="x_api_key",
                description="API key for big query function",
                required=False,
            ),
        )
        return custom_settings

    def persistent_store_settings(self):
        """
        Persistent Stores.
        """
        # Create a new persistent store (database)
        stores = (
            PersistentStoreDatabaseSetting(
                name="user_data",
                initializer="owp.init_db.init_user_data_db",
                spatial=True,
                required=True,
            ),
        )

        return stores

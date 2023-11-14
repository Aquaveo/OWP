from tethys_sdk.base import TethysAppBase
from tethys_sdk.app_settings import (
    PersistentStoreDatabaseSetting,
    CustomSetting,
    SecretCustomSetting,
)


class Owp(TethysAppBase):
    """
    Tethys app class for Owp.
    """

    name = "Owp"
    description = ""
    package = "owp"  # WARNING: Do not change this value
    index = "home"
    icon = f"{package}/images/icon.png"
    catch_all = "home"  # Catch all url mapped to home controller, required for react browser routing
    root_url = "owp"
    color = ""  # Don't set color here, set it in reactapp/custom-bootstrap.scss
    tags = ""
    enable_feedback = False
    feedback_emails = []
    controller_modules = ["controllers", "consumer"]

    def custom_settings(self):
        """
        Retrieve custom settings for HydroShare integration.

        This function returns a list of custom settings required for integrating
        with HydroShare. These settings include the HydroShare Client ID and
        Client Secret, which can be obtained by registering a new application on
        the HydroShare platform.

        Returns:
            list[CustomSetting]: A list of CustomSetting objects containing
            information about the required custom settings.
        """

        custom_settings = (
            CustomSetting(
                name="hydroshare_username",
                type=CustomSetting.TYPE_STRING,
                description="HydroShare Username",
                required=True,
            ),
            SecretCustomSetting(
                name="hydroshare_password",
                description="HydroShare Password",
                required=True,
            ),            
            CustomSetting(
                name="hydroshare_client_id",
                type=CustomSetting.TYPE_STRING,
                description="HydroShare Client ID by registering a new application",
                required=True,
            ),
            SecretCustomSetting(
                name="hydroshare_client_secret",
                description="HydroShare Client Secret by registering a new application",
                required=True,
            ),
        )

        return custom_settings

    def persistent_store_settings(self):
        """
        Add one or more persistent_stores.
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

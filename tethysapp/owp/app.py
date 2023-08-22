from tethys_sdk.base import TethysAppBase


class Owp(TethysAppBase):
    """
    Tethys app class for Owp.
    """
    name = 'Owp'
    description = ''
    package = 'owp'  # WARNING: Do not change this value
    index = 'home'
    icon = f'{package}/images/icon.png'
    catch_all = 'home'  # Catch all url mapped to home controller, required for react browser routing
    root_url = 'owp'
    color = ''  # Don't set color here, set it in reactapp/custom-bootstrap.scss
    tags = ''
    enable_feedback = False
    feedback_emails = []
    controller_modules = ['controllers', 'consumer' ]
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


def get_url_by_filename(file_info, file_name):
    for file_data in file_info:
        if file_data["file_name"] == file_name:
            return file_data["url"]
    return None  # Return None if file_name not found in the list

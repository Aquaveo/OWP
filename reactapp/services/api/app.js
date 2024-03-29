import apiClient from "services/api/client";


// const APP_ROOT_URL = process.env.TETHYS_APP_ROOT_URL;
const APP_ROOT_URL = process.env.TETHYS_APP_ROOT_URL_RELATIVE;

const appAPI = {
    getForecastData: (requestData) => {
        return apiClient.get(`${APP_ROOT_URL}getForecastData/`, {params: requestData});
    },
    getUserRegions:(requestData) => {
        return apiClient.get(`${APP_ROOT_URL}getUserRegions/`, {params: requestData});
    },
    getGeopackageLayersFromFile:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}getGeopackageLayersFromFile/`, requestData);
    },
    previewUserRegionFromFile:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}previewUserRegionFromFile/`, requestData);
    },
    previewUserColumnsFromFile:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}previewUserColumnsFromFile/`, requestData);
    },
    saveUserRegions:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}saveUserRegions/`, requestData);
    },
    saveUserRegionsFromReaches:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}saveUserRegionsFromReaches/`, requestData);
    },
    saveUserRegionsFromHydroShareResource:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}saveUserRegionsFromHydroShareResource/`, requestData);
    },
    getNwmData:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}getNwmData/`, requestData);
    },
};

export default appAPI;
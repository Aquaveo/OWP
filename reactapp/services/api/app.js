import apiClient from "services/api/client";

const APP_ROOT_URL = process.env.TETHYS_APP_ROOT_URL;

const appAPI = {
    getForecastData: (requestData) => {
        return apiClient.get(`${APP_ROOT_URL}getForecastData/`, {params: requestData});
    },
    getUserRegions:(requestData) => {
        return apiClient.get(`${APP_ROOT_URL}getUserRegions/`, {params: requestData});
    },
    previewUserRegionFromFile:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}previewUserRegionFromFile/`, requestData);
    },
    saveUserRegions:(requestData) => {
        return apiClient.post(`${APP_ROOT_URL}saveUserRegions/`, requestData);
    },
};

export default appAPI;
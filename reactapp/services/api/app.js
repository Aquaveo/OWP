import apiClient from "services/api/client";

const APP_ROOT_URL = process.env.TETHYS_APP_ROOT_URL;

const appAPI = {
    getPlotData: () => {
        return apiClient.get(`${APP_ROOT_URL}data/`);
    },
    getForecastData: (requestData) => {
        return apiClient.get(`${APP_ROOT_URL}getForecastData/`, {params: requestData});
    },
};

export default appAPI;
import axios from 'axios';

import { getTethysPortalHost } from 'services/utilities';

const TETHYS_PORTAL_HOST = getTethysPortalHost();

const apiClient = axios.create({
  baseURL: `${TETHYS_PORTAL_HOST}`,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
    // 'Content-Type': 'application/json'
  },

});
apiClient.defaults.xsrfHeaderName = "X-CSRFToken"
apiClient.defaults.xsrfCookieName = 'csrftoken'
apiClient.defaults.withCredentials = true;

function handleSuccess(response) {
  return response.data ? response.data : response;
}

function handleError(error) {
  let res = error.response;
  if (res.status === 401) {
    // Redirect to Tethys Portal login
    // window.location.assign(`${TETHYS_PORTAL_HOST}/accounts/login?next=${window.location.pathname}`);
    window.location.assign(`${TETHYS_PORTAL_HOST}accounts/login?next=${window.location.pathname}`);
  }
  return Promise.reject(error);
}

apiClient.interceptors.response.use(handleSuccess, handleError);

export default apiClient;
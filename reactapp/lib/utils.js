const getWsURL = () => {
    const webSocketHost = process.env.TETHYS_WEB_SOCKET_HOST
    const prefix_url = process.env.TETHYS_PREFIX_URL ? `/${process.env.TETHYS_PREFIX_URL.replace(/^\/|\/$/g, '')}/` : '';
    const app_root_relative_path = process.env.TETHYS_APP_ROOT_URL_RELATIVE ? `${process.env.TETHYS_APP_ROOT_URL_RELATIVE.replace(/^\/|\/$/g, '')}` : '';
    const ws = 'ws://' + webSocketHost + prefix_url + app_root_relative_path + '/data-notification/notifications/ws/';
    return ws
}


export { getWsURL }
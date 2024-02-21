import { useEffect,useState } from "react"

const useWebSocket = (client) => {
    const [isConnected, setIsConnected] = useState(client.isConnected());

    useEffect(() => {
        return client.onStateChange(setIsConnected);
    }, [setIsConnected]);
    
    useEffect(() => {

    }, [isConnected]);

    return client
}

export {useWebSocket};
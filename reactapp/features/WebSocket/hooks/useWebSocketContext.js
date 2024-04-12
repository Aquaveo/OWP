import { useContext} from 'react';
import WebSocketContext from '../contexts/WebSocketContext';

export const useWebSocketContext = () => {
    return useContext(WebSocketContext)
}
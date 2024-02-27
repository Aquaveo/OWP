
// import { useState, useEffect } from "react";


// const useWebSocket = (client,handleMessage) => {
    
//   const [isConnected, setIsConnected] = useState(client.isConnected());
//   const [messages, setMessages] = useState([]);
  
//   const sendMessage = (msg) => client.send(msg);
//   const addMessageHandler = (fn) => client.on(fn);
  
//   useEffect(() => {
//       return client.onStateChange(setIsConnected);
//   }, [setIsConnected]);


//   useEffect(() => {

//   }, [isConnected]);

//   useEffect(() => {
//     console.log("changing messages", messages)
//     // client.on(handleMessage);
//     // return () => client.off(handleMessage);
//   }, [messages]);

//   return {
//     messages, 
//     sendMessage,
//     addMessageHandler
//   };
// }

// export default useWebSocket;


import { useReducer } from "react"
import { webSocketActionsTypes } from "../store/actions/actionsTypes";
import { initialWebSocKetState, webSocketReducer } from "../store/reducers/wsReducer"

// Custom hook for managing the state of the NWP products
const useWebSocket = ({reducer = webSocketReducer} = {}) => {
    const [webSocketState, manageWebSocket] = useReducer(reducer, initialWebSocKetState);
    const addClient = (client) => manageWebSocket({type: webSocketActionsTypes.get_client, client: client});
    const addMessageHandler = (fn) => manageWebSocket({type: webSocketActionsTypes.add_message_listener, messageListener: fn});
    const addStateChangeHandler = (fn) => manageWebSocket({type: webSocketActionsTypes.add_state_change_listener, stateChangeListener: fn});
    const resetMessages = () => manageWebSocket({type: webSocketActionsTypes.reset_messages});
    

    return {
      webSocketState,
      addClient,
      addMessageHandler,
      addStateChangeHandler,
      resetMessages
    }
}

export {useWebSocket}
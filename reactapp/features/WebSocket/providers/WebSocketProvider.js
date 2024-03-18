import React, { useEffect } from 'react';
import WebSocketContext from 'features/WebSocket/contexts/WebSocketContext';
import reconnectingSocket from '../lib/clientws';
import { useWebSocket } from '../hooks/useWebSocket';

const WebSocketProvider = ({ children, url }) => {

  const { webSocketState, addClient, addMessageHandler, addStateChangeHandler, sendMessage, resetMessages } = useWebSocket();

  const actions = {
    addClient: addClient,
    addMessageHandler: addMessageHandler,
    addStateChangeHandler: addStateChangeHandler,
    sendMessage: sendMessage,
    resetMessages: resetMessages
  }

  // create client ws first time when the provider is mounted
  useEffect(() => {
    // create a new client
    const client  = reconnectingSocket(url);
    // add the client to the state
    addClient(client);
    return () => {
      client.close();
    }
  }, [])
  
  // add message listeners when there is a new message listener
  useEffect(() => {
    console.log("adding message listener")
    if (!webSocketState.state.client) return;
  
    const { client, messageListeners } = webSocketState.state;
    
    // Assuming messageListeners is an array of functions
    messageListeners.forEach(listener => client.on(listener));
    
    return () => {
      console.log("unmounting ws message listener")

      messageListeners.forEach(listener => client.off(listener));
    }
  }, [webSocketState.state.messageListeners])


  // add state change listeners when there is a new state change listener
  useEffect(() => {
    console.log("adding state change listener")
    if (!webSocketState.state.client) return;

    const { client, stateChangeListeners } = webSocketState.state;
    stateChangeListeners.forEach(listener => client.onStateChange(listener));
    return () => {
      console.log("unmounting ws state change listener")
    }
  }, [webSocketState.state.stateChangeListeners])


  useEffect(() => {
    console.log("adding message")

    if (!webSocketState.state.client || !webSocketState.state.message) return;
    const { client, message } = webSocketState.state;
    client.send(message);
    return () => {
      console.log("unmounting ws message")
    }
  }, [webSocketState.state.message])


  return (
    <WebSocketContext.Provider value={{ ...webSocketState, actions }}>
        {children}
    </WebSocketContext.Provider>

  );
};

export {WebSocketProvider}
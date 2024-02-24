
import { useState, useEffect } from "react";


const useWebSocket = (client,handleMessage) => {
    
  const [isConnected, setIsConnected] = useState(client.isConnected());
  const [messages, setMessages] = useState([]);
  
  const sendMessage = (msg) => client.send(msg);
  const addMessageHandler = (fn) => client.on(fn);
  
  useEffect(() => {
      return client.onStateChange(setIsConnected);
  }, [setIsConnected]);


  useEffect(() => {

  }, [isConnected]);

  useEffect(() => {
    console.log("changing messages", messages)
    // client.on(handleMessage);
    // return () => client.off(handleMessage);
  }, [messages]);

  return {
    messages, 
    sendMessage,
    addMessageHandler
  };
}

export default useWebSocket;




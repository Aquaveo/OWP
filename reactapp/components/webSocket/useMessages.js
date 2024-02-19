
import { useState, useEffect } from "react";


const useMessages = (client,handleMessage) => {
    
    const [messages, setMessages] = useState([]);
  
    useEffect(() => {
      client.on(handleMessage);
      return () => client.off(handleMessage);
    }, [messages]);
  
    return messages;
}

export default useMessages;






const reconnectingSocket = (url) => {
    let client;
    let isConnected = false;
    let reconnectOnClose = true;
    let messageListeners = [];
    let stateChangeListeners = [];
  
    const on = (fn) => {
      messageListeners.push(fn);
    };
  
    const off = (fn) => {
      messageListeners = messageListeners.filter((l) => l !== fn);
    };
  
    const onStateChange = (fn) => {
      stateChangeListeners.push(fn);
      return () => {
        stateChangeListeners = stateChangeListeners.filter((l) => l !== fn);
      };
    };
  
    const start = () => {
      client = new WebSocket(url);
      
      client.onopen = () => {
        console.log('ws connected');
        isConnected = true;
        stateChangeListeners.forEach((fn) => fn(client));
      };
  
      const close = client.close;
  
      // Close without reconnecting;
      client.close = () => {
        reconnectOnClose = false;
        close.call(client);
      };
  
      client.onmessage = (event) => {
        console.log(messageListeners)
        messageListeners.forEach((fn) => fn(event.data));
      };
  
      client.onerror = (e) => console.error(e);
  
      client.onclose = () => {
        isConnected = false;
        stateChangeListeners.forEach((fn) => fn(false));
  
        if (!reconnectOnClose) {
          console.log('ws closed by app');
          return;
        }
  
        console.log('ws closed by server');
  
        setTimeout(start, 3000);
      };
    };
    
    const send = (msg) => {
      client.send(msg);
    };
  
    start();
  
    return {
      on,
      off,
      onStateChange,
      close: () => client.close(),
      getClient: () => client,
      isConnected: () => isConnected,
      send: (msg) => send(msg)
    };
};

export default reconnectingSocket;
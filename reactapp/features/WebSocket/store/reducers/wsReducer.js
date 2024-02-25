import { webSocketActionsTypes } from "../actions/actionsTypes";


const initialWebSocKetState = {
    state:{
        client: null,
        message: null,
        messageListeners : [],
        stateChangeListeners : [],
    },
    actions:{}
}


const webSocketReducer = (state, action) => {
    switch (action.type) {
        case webSocketActionsTypes.get_client:
            return {
                ...state,
                state: {
                  ...state.state,
                  client: action.client
                }
            };
        case webSocketActionsTypes.reset:
            return {
                ...state,
                state: {
                  ...state.state,
                  message: null,
                  messageListeners: [],
                  stateChangeListeners: []
                }
        };     
        case webSocketActionsTypes.add_message_listener:
            return {
                ...state,
                state: {
                  ...state.state,
                  messageListeners: [...state.state.messageListeners, action.messageListener]
                }
            };
        case webSocketActionsTypes.add_state_change_listener:
            return {
                ...state,
                state: {
                  ...state.state,
                  stateChangeListeners: [...state.state.stateChangeListeners, action.stateChangeListener]
                }
            };
        case webSocketActionsTypes.send_message:
            // Assuming send_message means to send a message through the WebSocket
            // The actual sending mechanism would depend on your WebSocket client setup
            // This action just updates the state to include the new message
            return {
                ...state,
                state: {
                  ...state.state,
                  message: action.message
                }
            };
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export  {webSocketReducer, initialWebSocKetState};
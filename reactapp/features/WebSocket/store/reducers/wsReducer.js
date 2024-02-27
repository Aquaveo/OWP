import { webSocketActionsTypes } from "../actions/actionsTypes";


const initialWebSocKetState = {
    state:{
        client: null,
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

        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export  {webSocketReducer, initialWebSocKetState};
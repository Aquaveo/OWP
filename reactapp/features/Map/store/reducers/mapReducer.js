import { MapActionsTypes } from '../actions/actionsTypes';
//OL modules
import { fromLonLat } from 'ol/proj';
import Map from "ol/Map";
import View from 'ol/View';

const zoom = 5
const center = fromLonLat([-94.9065, 38.9884])

let options = {
    view: new View({ zoom, center }),
    layers:[],
    controls: [],
    overlays: []
};


const mapInitialStore = {
    state:{
        mapObject: new Map(options),
        isFullMap: true,  
        layers:[]
    },
    actions:{}
};


const mapReducer = (state, action) => {
  switch (action.type) {
      case MapActionsTypes.add_layer: // Ensure action types are in all caps to follow conventions

          return {
              ...state,
              state: { // Correctly target the nested `state` object for modification
                  ...state.state,
                  layers: [...state.state.layers, action.payload] // Use `payload` for action data
              }
          };
      case MapActionsTypes.delete_layer:
          return {
              ...state,
              state: {
                  ...state.state,
                  layers: state.state.layers.filter(layer => layer.get('name') !== action.payload.name) // Assume layers are identified by `name`
              }
          };
      case MapActionsTypes.toggle_full_map:
          return {
              ...state,
              state: {
                  ...state.state,
                  isFullMap: !state.state.isFullMap
              }
          };
      default:
          return state;
  }
};

export { mapInitialStore, mapReducer }


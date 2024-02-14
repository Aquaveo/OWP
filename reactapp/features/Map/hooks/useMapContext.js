import { useContext} from 'react';
import MapContext from 'components/map/MapContext';


export const useMapContext = () => {
    return useContext(MapContext)
}
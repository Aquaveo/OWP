import { useContext} from 'react';
import NwmContext from '../contexts/NwmProductsContext';


export const useNwmProductsContext = () => {
    return useContext(NwmContext)
}
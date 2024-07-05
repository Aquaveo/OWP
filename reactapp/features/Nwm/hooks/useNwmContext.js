import { useContext} from 'react';
import NwmContext from '../contexts/NwmContext';


export const useNwmContext = () => {
    return useContext(NwmContext)
}
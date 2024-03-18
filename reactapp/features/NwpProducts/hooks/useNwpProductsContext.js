import { useContext} from 'react';
import NwpContext from '../contexts/NwpProductsContext';


export const useNwpProductsContext = () => {
    return useContext(NwpContext)
}
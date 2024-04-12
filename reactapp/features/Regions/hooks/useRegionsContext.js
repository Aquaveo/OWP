import { useContext} from 'react';
import RegionsContext from '../contexts/RegionsContext';

export const useRegionsContext = () => {
    return useContext(RegionsContext)
}

import { useContext} from 'react';
import RegionsFormContext from '../contexts/RegionsFormContext';

export const useRegionsFormContext = () => {
    return useContext(RegionsFormContext)
}

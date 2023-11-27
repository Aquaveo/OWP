import { toast } from 'react-hot-toast';

export const showToast = (type, message) => {
  switch (type) {
    case 'error':
      toast.error(message);
      break;
    case 'success':
      toast.success(message);
      break;
    case 'custom':
      toast.custom(message);
      break;      
    case 'info':
    default:
      toast(message); // Default to info notification
      break;

      
  }
};
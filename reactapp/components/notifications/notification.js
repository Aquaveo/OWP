import React from 'react';
import { CustomNotification } from 'components/styled-components/BsNotification.styled';
import { Toaster } from 'react-hot-toast';
import 'css/notifications.css'
export const Notification = () => {

  return (
    <CustomNotification>
        <Toaster  
        position="bottom-center"
        />
    </CustomNotification>
  );
};


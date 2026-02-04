import React, { createContext, useContext, useState } from 'react';
import Notification from './notification';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'info', 
        buttonText: 'Oke',
        onCloseAction: null 
    });

    const showNotification = (title, message, type = 'info', buttonText = 'Oke', onCloseAction = null) => {
        setNotification({
            isOpen: true,
            title,
            message,
            type,
            buttonText,
            onCloseAction
        });
    };

    const closeNotification = () => {
        if (notification.onCloseAction) {
            notification.onCloseAction();
        }
        setNotification((prev) => ({ ...prev, isOpen: false }));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <Notification 
                isOpen={notification.isOpen}
                onClose={closeNotification}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                buttonText={notification.buttonText}
            />
        </NotificationContext.Provider>
    );
};

export const useNotification = () => useContext(NotificationContext);
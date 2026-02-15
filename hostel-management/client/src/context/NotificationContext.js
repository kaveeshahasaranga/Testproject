import React, { createContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const showNotification = useCallback((type, message) => {
        setNotification({ type, message });

        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    const hideNotification = useCallback(() => {
        setNotification(null);
    }, []);

    return (
        <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;

import React, { useContext } from 'react';
import NotificationContext from '../../context/NotificationContext';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const NotificationToast = () => {
    const { notification, hideNotification } = useContext(NotificationContext);

    if (!notification) return null;

    const { type, message } = notification;

    const getIcon = () => {
        switch (type) {
            case 'success': return <CheckCircle size={20} className="text-green-500" />;
            case 'error': return <XCircle size={20} className="text-red-500" />;
            default: return <Info size={20} className="text-blue-500" />;
        }
    };

    const getStyles = () => {
        switch (type) {
            case 'success': return 'bg-green-50 border-green-200 text-green-800';
            case 'error': return 'bg-red-50 border-red-200 text-red-800';
            default: return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 flex items-center p-4 rounded-lg shadow-lg border ${getStyles()} animate-in slide-in-from-top-2 duration-300`}>
            <div className="mr-3">
                {getIcon()}
            </div>
            <div className="mr-6 font-medium text-sm">
                {message}
            </div>
            <button
                onClick={hideNotification}
                className="ml-auto text-gray-400 hover:text-gray-600 focus:outline-none"
            >
                <X size={16} />
            </button>
        </div>
    );
};

export default NotificationToast;

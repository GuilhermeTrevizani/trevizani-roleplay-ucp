import { notification } from "antd";
import { createContext, type ReactElement } from "react";

type NotificationType = 'success' | 'error';

interface NotificationContextProps {
  alert: (type: NotificationType, description: string) => void
}

export const NotificationContext = createContext<NotificationContextProps>(null!);

export const NotificationContextProvider = ({ children }: { children: ReactElement }) => {
  const [api, contextHolder] = notification.useNotification();

  const alert = (type: NotificationType, message: string) => {
    api[type]({
      message,
      duration: 5,
      showProgress: true,
      closable: false,
    });
  };

  return (
    <NotificationContext.Provider value={{ alert }}>
      {contextHolder}
      {children}
    </NotificationContext.Provider>
  )
}
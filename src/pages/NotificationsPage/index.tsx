import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import { useEffect, useState } from 'react';
import { formatDateTime } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Button, Spin, Timeline, Tooltip } from 'antd';
import type NotificationResponse from '../../types/NotificationResponse';
import moment from 'moment';
import {
  EyeOutlined,
  LoadingOutlined
} from '@ant-design/icons';

const NotificationsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const notification = useNotification();

  useEffect(() => {
    moment.locale('pt-br');
    console.log(moment.locale());
    getMyNotifications();
  }, []);

  const getMyNotifications = () => {
    setLoading(true);
    api.getMyNotifications()
      .then(res => {
        setNotifications(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const markAsRead = (id: string) => {
    setLoading(true);
    api.markNotificationAsRead(id)
      .then(() => {
        getMyNotifications()
      })
      .catch(res => {
        setLoading(false);
        notification.alert('error', res);
      });
  }

  // colocar um loading para aparecer no lugar da timeline enquanto tiver com loadi

  return (
    <LayoutPage title={t('notifications')}>
      <>
        {loading && <Spin indicator={<LoadingOutlined spin />} size="large" />}

        {!loading && <Timeline
          mode='left'
          items={notifications.map(x => {
            return ({
              label: `${formatDateTime(x.date)} (${moment(x.date).fromNow()})`,
              children: <>{x.message} {!x.readDate && <Tooltip title={t('markAsRead')}>
                <Button size='small' type="default" shape="circle" icon={<EyeOutlined />} onClick={() => markAsRead(x.id)} />
              </Tooltip>}</>
            });
          })}
        />}
      </>
    </LayoutPage>
  );
};

export default NotificationsPage;
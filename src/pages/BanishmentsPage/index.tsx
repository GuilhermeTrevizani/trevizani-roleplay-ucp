import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatDateTime } from '../../services/format';
import { Button, Flex } from 'antd';
import { useApi } from '../../hooks/useApi';
import type BanishmentResponse from '../../types/BanishmentResponse';
import useAuth from '../../hooks/useAuth';
import { UserStaff } from '../../types/UserStaff';
import { useNotification } from '../../hooks/useNotification';

const BanishmentsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [banishments, setBanishments] = useState<BanishmentResponse[]>([]);
  const { user } = useAuth();
  const notification = useNotification();

  useEffect(() => {
    getBanishments();
  }, []);

  const getBanishments = () => {
    setLoading(true);
    api.getBanishments()
      .then(res => {
        setBanishments(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<BanishmentResponse> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('expiration'),
      dataIndex: 'expirationDate',
      key: 'expirationDate',
      render: (expirationDate?: Date) => !expirationDate ? t('permanent') : formatDateTime(expirationDate!),
    },
    {
      title: t('character'),
      dataIndex: 'character',
      key: 'character',
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: t('staff'),
      dataIndex: 'userStaff',
      key: 'userStaff',
    },
    {
      title: t('reason'),
      dataIndex: 'reason',
      key: 'reason',
    },
    {
      title: t('description'),
      dataIndex: 'onlyCharacterIsBanned',
      key: 'onlyCharacterIsBanned',
      render: (onlyCharacterIsBanned: boolean) => t(onlyCharacterIsBanned ? 'onlyCharacterIsBanned' : 'allCharactersAreBanned'),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      hidden: !!user && user.staff < UserStaff.GameAdmin,
      render: (id: string, record: BanishmentResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => unban(id, true)}>{t('unbanAll')}</Button>
        {!record.onlyCharacterIsBanned && <Button size='small' onClick={() => unban(id, false)}>{t('unbanUser')}</Button>}
      </Flex>,
    },
  ];

  const unban = (id: string, total: boolean) => {
    setLoading(true);
    api.unban(id, total)
      .then(() => {
        getBanishments();
        notification.alert('success', total ? t('messageUnbanTotal') : t('messageUnban'));
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LayoutPage title={t('banishments')}>
      <>
        <Table
          columns={columns}
          dataSource={banishments}
          pagination={false}
          loading={loading}
          locale={{ emptyText: t('noBanishments') }}
        />
      </>
    </LayoutPage>
  );
};

export default BanishmentsPage;
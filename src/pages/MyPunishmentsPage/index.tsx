import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatDateTime } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import AdministrativePunishmentResponse from '../../types/AdministrativePunishmentResponse';
import { useNotification } from '../../hooks/useNotification';

const MyPunishmentsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [punishments, setPunishments] = useState<AdministrativePunishmentResponse[]>([]);
  const notification = useNotification();

  useEffect(() => {
    getPunishments();
  }, []);

  const getPunishments = () => {
    setLoading(true);
    api.getAdministrativePunishments()
      .then(res => {
        setPunishments(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<AdministrativePunishmentResponse> = [
    {
      title: t('character'),
      dataIndex: 'character',
      key: 'character',
    },
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => formatDateTime(date),
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('duration'),
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: t('staffer'),
      dataIndex: 'staffer',
      key: 'staffer',
    },
    {
      title: t('reason'),
      dataIndex: 'reason',
      key: 'reason',
    },
  ];

  return (
    <LayoutPage title={t('myPunishments')}>
      <>
        <Table
          columns={columns}
          dataSource={punishments}
          pagination={false}
          loading={loading}
          locale={{ emptyText: t('noPunishments') }}
        />
      </>
    </LayoutPage>
  );
};

export default MyPunishmentsPage;
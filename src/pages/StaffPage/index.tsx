import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import type StafferResponse from '../../types/StafferResponse';
import Title from 'antd/es/typography/Title';
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { formatDateTime, formatValue } from '../../services/format';
import { Tag, Tooltip } from 'antd';
import moment from 'moment';

moment.locale('pt-br');

const StaffPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [staffers, setStaffers] = useState<StafferResponse[]>([]);
  const notification = useNotification();

  useEffect(() => {
    getStaffers();
  }, []);

  const getStaffers = () => {
    setLoading(true);
    api.getStaffers()
      .then(res => {
        setStaffers(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<StafferResponse> = [
    {
      title: t('staff'),
      dataIndex: 'staff',
      key: 'staff',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('helpRequestsAnswersQuantity'),
      dataIndex: 'helpRequestsAnswersQuantity',
      key: 'helpRequestsAnswersQuantity',
    },
    {
      title: t('characterApplicationsQuantity'),
      dataIndex: 'characterApplicationsQuantity',
      key: 'characterApplicationsQuantity',
    },
    {
      title: t('connectedTime'),
      dataIndex: 'connectedTime',
      key: 'connectedTime',
      render: (_, record: StafferResponse) => {
        const staffDutyTime = record.staffDutyTime / 60;
        const connectedTime = record.connectedTime / 60;
        const percentage = connectedTime > 0 ? staffDutyTime / connectedTime * 100 : 0;
        return <Tooltip title={t('connectedTimeTip')}>{formatValue(staffDutyTime, 1)}h / {formatValue(connectedTime, 1)}h ({formatValue(percentage, 1)}%)</Tooltip>
      },
    },
    {
      title: t('lastAccess'),
      dataIndex: 'lastAccessDate',
      key: 'lastAccessDate',
      render: (date: Date) => `${formatDateTime(date)} (${moment(date).fromNow()})`,
    },
    {
      title: t('flags'),
      dataIndex: 'flags',
      key: 'flags',
      render: (flags: string[]) => flags.map(x => <Tag style={{ marginBottom: '2px' }}>{x}</Tag>),
    },
  ];

  return (
    <LayoutPage title={t('staff')}>
      <>
        <Title level={3}>{t('staff')}</Title>
        <Table
          columns={columns}
          dataSource={staffers}
          pagination={false}
          loading={loading}
        />
      </>
    </LayoutPage>
  );
};

export default StaffPage;
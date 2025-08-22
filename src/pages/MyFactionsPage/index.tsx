import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Button, Flex } from 'antd';
import { useNavigate } from 'react-router-dom';
import type MyFactionResponse from '../../types/MyFactionResponse';

const MyFactionsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<MyFactionResponse[]>([]);
  const notification = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    getMyCharacters();
  }, []);

  const getMyCharacters = () => {
    setLoading(true);
    api.getMyFactions()
      .then(res => {
        setResponse(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const view = (id: string) => {
    navigate(`/faction/${id}`);
  }

  const columns: ColumnsType<MyFactionResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => view(id)}>{t('view')}</Button>
      </Flex>,
    },
  ];

  return (
    <LayoutPage title={t('myFactions')}>
      <Table
        columns={columns}
        dataSource={response}
        pagination={false}
        loading={loading}
        locale={{ emptyText: t('noMyFactions') }}
      />
    </LayoutPage>
  );
};

export default MyFactionsPage;
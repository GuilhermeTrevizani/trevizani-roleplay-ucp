import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Col, Input, Row, Tag } from 'antd';
import type PotentialFakeResponse from '../../types/PotentialFakeResponse';

const PotentialFakesPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [originalItems, setOriginalItems] = useState<PotentialFakeResponse[]>([]);
  const [items, setItems] = useState<PotentialFakeResponse[]>([]);
  const notification = useNotification();
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPotentialFakes();
  }, []);

  const getPotentialFakes = () => {
    setLoading(true);
    api.getPotentialFakes()
      .then(res => {
        setOriginalItems(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<PotentialFakeResponse> = [
    {
      title: t('identifier'),
      dataIndex: 'identifier',
      key: 'identifier',
    },
    {
      title: t('users'),
      dataIndex: 'users',
      key: 'users',
      render: (users: string) => users.split(',').map(x => <Tag style={{ marginBottom: '2px' }}>{x.trim()}</Tag>),
    },
  ];

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.users).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  return (
    <LayoutPage title={t('potentialFakes')}>
      <>
        <Row gutter={16} style={{ marginTop: '10px' }}>
          <Col span={24}>
            <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          style={{ marginTop: '10px' }}
        />
      </>
    </LayoutPage>
  );
};

export default PotentialFakesPage;
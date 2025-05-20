import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatValue, removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Col, Input, Row } from 'antd';
import type CharacterPatrimonyResponse from '../../types/CharacterPatrimonyResponse';

const PatrimonyPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const [originalItems, setOriginalItems] = useState<CharacterPatrimonyResponse[]>([]);
  const [items, setItems] = useState<CharacterPatrimonyResponse[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getPatrimony();
  }, []);

  const getPatrimony = () => {
    setLoading(true);
    api.getPatrimony()
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

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.name).includes(newSearch) || removeAccents(x.user).includes(newSearch)
      || removeAccents(x.job).includes(newSearch) || removeAccents(x.vehicles).includes(newSearch)
      || removeAccents(x.properties).includes(newSearch) || removeAccents(x.companies).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<CharacterPatrimonyResponse> = [
    {
      title: t('position'),
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: t('user'),
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${formatValue(value)}`,
    },
    {
      title: t('connectedTime'),
      dataIndex: 'connectedTime',
      key: 'connectedTime',
      render: (connectedTime: number) => `${formatValue(connectedTime / 60, 1)}h`,
    },
    {
      title: t('job'),
      dataIndex: 'job',
      key: 'job',
    },
    {
      title: t('vehicles'),
      dataIndex: 'vehicles',
      key: 'vehicles',
    },
    {
      title: t('properties'),
      dataIndex: 'properties',
      key: 'properties',
    },
    {
      title: t('companies'),
      dataIndex: 'companies',
      key: 'companies',
    },
  ];

  return (
    <LayoutPage title={t('patrimony')}>
      <>
        <Row gutter={16}>
          <Col span={24}>
            <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          rowKey={'position'}
          expandable={{
            expandedRowRender: (record) => <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: record.description }}></p>,
            rowExpandable: (record) => true,
          }}
          style={{ marginTop: '10px' }}
        />
      </>
    </LayoutPage>
  );
};

export default PatrimonyPage;
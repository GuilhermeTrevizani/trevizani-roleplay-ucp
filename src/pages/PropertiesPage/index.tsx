import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatValue, removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Col, Input, Row } from 'antd';
import type PropertyResponse from '../../types/PropertyResponse';

const PropertiesPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const [originalItems, setOriginalItems] = useState<PropertyResponse[]>([]);
  const [items, setItems] = useState<PropertyResponse[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getProperties();
  }, []);

  const getProperties = () => {
    setLoading(true);
    api.getProperties()
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
      removeAccents(x.address).includes(newSearch) || removeAccents(x.name).includes(newSearch)
      || x.number.toString() == newSearch || removeAccents(x.factionName).includes(newSearch)
      || removeAccents(x.owner).includes(newSearch) || removeAccents(x.companyName).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<PropertyResponse> = [
    {
      title: t('number'),
      dataIndex: 'number',
      key: 'number',
    },
    {
      title: t('address'),
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: t('interior'),
      dataIndex: 'interiorDisplay',
      key: 'interiorDisplay',
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${formatValue(value)}`,
    },
    {
      title: t('owner'),
      dataIndex: 'owner',
      key: 'owner',
    },
    {
      title: t('faction'),
      dataIndex: 'factionName',
      key: 'factionName',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('parentPropertyNumber'),
      dataIndex: 'parentPropertyNumber',
      key: 'parentPropertyNumber',
    },
    {
      title: t('company'),
      dataIndex: 'companyName',
      key: 'companyName',
    },
  ];

  return (
    <LayoutPage title={t('properties')}>
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
          style={{ marginTop: '10px' }}
        />
      </>
    </LayoutPage>
  );
};

export default PropertiesPage;
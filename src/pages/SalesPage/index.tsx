import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatDateTime, formatMoney, removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import PremiumPointPurchaseResponse from '../../types/PremiumPointPurchaseResponse';
import { useNotification } from '../../hooks/useNotification';
import { Alert, Col, Input, Row } from 'antd';

const SalesPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const [originalItems, setOriginalItems] = useState<PremiumPointPurchaseResponse[]>([]);
  const [items, setItems] = useState<PremiumPointPurchaseResponse[]>([]);
  const notification = useNotification();
  const [search, setSearch] = useState('');

  useEffect(() => {
    getSales();
  }, []);

  const getSales = () => {
    setLoading(true);
    api.getSales()
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

  const columns: ColumnsType<PremiumPointPurchaseResponse> = [
    {
      title: t('date'),
      dataIndex: 'registerDate',
      key: 'registerDate',
      render: (registerDate: Date) => formatDateTime(registerDate),
    },
    {
      title: t('origin'),
      dataIndex: 'userOrigin',
      key: 'userOrigin',
    },
    {
      title: t('quantity'),
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => formatMoney(value),
    },
    {
      title: t('target'),
      dataIndex: 'userTarget',
      key: 'userTarget',
    },
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: t('paymentDate'),
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (paymentDate?: Date) => paymentDate ? formatDateTime(paymentDate) : '',
    },
  ];

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.userOrigin).includes(newSearch)
      || removeAccents(x.userTarget).includes(newSearch)
      || removeAccents(x.status).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const getTotal = () => {
    return originalItems.filter(x => x.paymentDate).map(x => x.value).reduce((partialSum, x) => partialSum + x, 0);
  };

  const wrongItems = originalItems.filter(x => x.paymentDate && x.status != 'approved');

  return (
    <LayoutPage title={`${t('sales')} (${formatMoney(getTotal())})`}>
      <>
        {wrongItems.length > 0 && <>
          <Alert
            message='Vendas com problema'
            description={wrongItems.map(x => {
              return (
                <><span>{x.userOrigin}</span><br /></>
              )
            })}
            type="error"
          />
        </>}
        <Row gutter={16} style={{ marginTop: '10px' }}>
          <Col span={24}>
            <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          locale={{ emptyText: t('noSales') }}
          style={{ marginTop: '10px' }}
        />
      </>
    </LayoutPage>
  );
};

export default SalesPage;
import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatValue, removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Button, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row } from 'antd';
import CrimeResponse from '../../types/CrimeResponse';

const CrimesPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const [originalItems, setOriginalItems] = useState<CrimeResponse[]>([]);
  const [items, setItems] = useState<CrimeResponse[]>([]);
  const [search, setSearch] = useState('');
  const [record, setRecord] = useState<CrimeResponse>();

  useEffect(() => {
    getCrimes();
  }, []);

  const getCrimes = () => {
    setLoading(true);
    api.getCrimes()
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

  const add = () => {
    setRecord({
      name: '',
      driverLicensePoints: 0,
      fineValue: 0,
      prisonMinutes: 0,
    })
  };

  const edit = (record: CrimeResponse) => {
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    api.removeCrime(id)
      .then(res => {
        getCrimes();
        notification.alert('success', t('recordRemoved'));
      })
      .catch(res => {
        notification.alert('error', res);
        setLoading(false);
      });
  }

  const handleModalCancel = () => {
    setRecord(undefined);
  }

  const handleModalOk = () => {
    setLoading(true);
    api.saveCrime(record!)
      .then(res => {
        getCrimes();
        notification.alert('success', t('recordSaved'));
      })
      .catch(res => {
        notification.alert('error', res);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (search == '') {
      setItems(originalItems);
      return;
    }

    const newSearch = removeAccents(search);
    const filteredItems = originalItems.filter(x => removeAccents(x.name).includes(newSearch));
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<CrimeResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('prisonMinutes'),
      dataIndex: 'prisonMinutes',
      key: 'prisonMinutes',
      render: (prisonMinutes: number) => formatValue(prisonMinutes),
    },
    {
      title: t('fineValue'),
      dataIndex: 'fineValue',
      key: 'fineValue',
      render: (fineValue: number) => `$${formatValue(fineValue)}`,
    },
    {
      title: t('driverLicensePoints'),
      dataIndex: 'driverLicensePoints',
      key: 'driverLicensePoints',
      render: (driverLicensePoints: number) => formatValue(driverLicensePoints),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: CrimeResponse) => <Flex justify='space-evenly'>
        <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>
        <Popconfirm
          title={t('deleteRecord')}
          description={t('deleteRecordConfirm')}
          onConfirm={() => remove(id)}
          okText={t('yes')}
          cancelText={t('no')}
        >
          <Button danger size='small'>{t('delete')}</Button>
        </Popconfirm>
      </Flex>,
    },
  ];

  return (
    <LayoutPage title={t('crimes')}>
      <>
        <Row gutter={16}>
          <Col span={20}>
            <Input placeholder={t('searchHere')} value={search} onChange={(e) => setSearch(e.target.value)} />
          </Col>
          <Col span={4}>
            <Button style={{ width: '100%' }} onClick={add}>{t('add')}</Button>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={items}
          loading={loading}
          style={{ marginTop: '10px' }}
        />
        {record && <Modal open={true} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('crime')}
          onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
          cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('name')}>
                  <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('prisonMinutes')}>
                  <InputNumber value={record.prisonMinutes}
                    onChange={(value) => setRecord({ ...record, prisonMinutes: Number(value) })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('fineValue')}>
                  <InputNumber value={record.fineValue}
                    onChange={(value) => setRecord({ ...record, fineValue: Number(value) })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('driverLicensePoints')}>
                  <InputNumber value={record.driverLicensePoints}
                    onChange={(value) => setRecord({ ...record, driverLicensePoints: Number(value) })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>}
      </>
    </LayoutPage>
  );
};

export default CrimesPage;
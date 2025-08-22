import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatValue, removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Button, Col, Form, Input, InputNumber, Modal, Row } from 'antd';
import type DrugResponse from '../../types/DrugResponse';

const DrugsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const [originalItems, setOriginalItems] = useState<DrugResponse[]>([]);
  const [items, setItems] = useState<DrugResponse[]>([]);
  const [search, setSearch] = useState('');
  const [record, setRecord] = useState<DrugResponse>();

  useEffect(() => {
    getDrugs();
  }, []);

  const getDrugs = () => {
    setLoading(true);
    api.getDrugs()
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

  const edit = (record: DrugResponse) => {
    setRecord(record);
  }

  const handleModalCancel = () => {
    setRecord(undefined);
  }

  const handleModalOk = () => {
    setLoading(true);
    api.saveDrug(record!)
      .then(() => {
        getDrugs();
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

  const columns: ColumnsType<DrugResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('thresoldDeath'),
      dataIndex: 'thresoldDeath',
      key: 'thresoldDeath',
      render: (value: number) => formatValue(value),
    },
    {
      title: t('health'),
      dataIndex: 'health',
      key: 'health',
      render: (value: number) => formatValue(value),
    },
    {
      title: t('minutesDuration'),
      dataIndex: 'minutesDuration',
      key: 'minutesDuration',
      render: (value: number) => formatValue(value),
    },
    {
      title: t('garbageCollectorMultiplier'),
      dataIndex: 'garbageCollectorMultiplier',
      key: 'garbageCollectorMultiplier',
      render: (value: number) => formatValue(value, 1),
    },
    {
      title: t('truckerMultiplier'),
      dataIndex: 'truckerMultiplier',
      key: 'truckerMultiplier',
      render: (value: number) => formatValue(value, 1),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: DrugResponse) => <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>,
    },
  ];

  return (
    <LayoutPage title={t('drugs')}>
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

        {record && <Modal open={true} title={record.name} width={'40%'}
          onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
          cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical' style={{ maxHeight: '60vh', overflowY: 'auto', overflowX: 'hidden' }}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label={t('thresoldDeath')}>
                  <InputNumber value={record.thresoldDeath}
                    onChange={(value) => setRecord({ ...record, thresoldDeath: value! })}
                    style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={t('health')}>
                  <InputNumber value={record.health}
                    onChange={(value) => setRecord({ ...record, health: value! })}
                    style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={t('minutesDuration')}>
                  <InputNumber value={record.minutesDuration}
                    onChange={(value) => setRecord({ ...record, minutesDuration: value! })}
                    style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t('garbageCollectorMultiplier')}>
                  <InputNumber value={record.garbageCollectorMultiplier}
                    onChange={(value) => setRecord({ ...record, garbageCollectorMultiplier: value! })}
                    style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('truckerMultiplier')}>
                  <InputNumber value={record.truckerMultiplier}
                    onChange={(value) => setRecord({ ...record, truckerMultiplier: value! })}
                    style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t('shakeGameplayCamName')}>
                  <Input value={record.shakeGameplayCamName}
                    onChange={(e) => setRecord({ ...record, shakeGameplayCamName: e.target.value })}
                    style={{ width: '100%' }} maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('shakeGameplayCamIntensity')}>
                  <InputNumber value={record.shakeGameplayCamIntensity}
                    onChange={(value) => setRecord({ ...record, shakeGameplayCamIntensity: value! })}
                    style={{ width: '100%' }} min={0} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t('timecycModifier')}>
                  <Input value={record.timecycModifier}
                    onChange={(e) => setRecord({ ...record, timecycModifier: e.target.value })}
                    style={{ width: '100%' }} maxLength={100} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('animpostFXName')}>
                  <Input value={record.animpostFXName}
                    onChange={(e) => setRecord({ ...record, animpostFXName: e.target.value })}
                    style={{ width: '100%' }} maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('warning')}>
                  <Input value={record.warn}
                    onChange={(e) => setRecord({ ...record, warn: e.target.value })}
                    style={{ width: '100%' }} maxLength={300} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>}
      </>
    </LayoutPage>
  );
};

export default DrugsPage;
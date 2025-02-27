import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatValue, removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import FurnitureResponse from '../../types/FurnitureResponse';
import { Button, Checkbox, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row } from 'antd';

const FurnituresPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const [originalItems, setOriginalItems] = useState<FurnitureResponse[]>([]);
  const [items, setItems] = useState<FurnitureResponse[]>([]);
  const [search, setSearch] = useState('');
  const [record, setRecord] = useState<FurnitureResponse>();

  useEffect(() => {
    getFurnitures();
  }, []);

  const getFurnitures = () => {
    setLoading(true);
    api.getFurnitures()
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
      category: '',
      model: '',
      value: 0,
      door: false,
      audioOutput: false,
      tvTexture: '',
      subcategory: '',
      useSlot: true,
    })
  };

  const edit = (record: FurnitureResponse) => {
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    api.removeFurniture(id)
      .then(res => {
        getFurnitures();
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
    api.saveFurniture(record!)
      .then(res => {
        getFurnitures();
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
    const filteredItems = originalItems.filter(x =>
      removeAccents(x.category).includes(newSearch) || removeAccents(x.name).includes(newSearch)
      || removeAccents(x.model).includes(newSearch) || removeAccents(x.subcategory).includes(newSearch)
      || removeAccents(x.tvTexture).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<FurnitureResponse> = [
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: t('subcategory'),
      dataIndex: 'subcategory',
      key: 'subcategory',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('model'),
      dataIndex: 'model',
      key: 'model',
    },
    {
      title: t('value'),
      dataIndex: 'value',
      key: 'value',
      render: (value: number) => `$${formatValue(value)}`,
    },
    {
      title: t('door'),
      dataIndex: 'door',
      key: 'door',
      render: (door: boolean) => t(door ? 'yes' : 'no'),
    },
    {
      title: t('audioOutput'),
      dataIndex: 'audioOutput',
      key: 'audioOutput',
      render: (audioOutput: boolean) => t(audioOutput ? 'yes' : 'no'),
    },
    {
      title: t('useSlot'),
      dataIndex: 'useSlot',
      key: 'useSlot',
      render: (useSlot: boolean) => t(useSlot ? 'yes' : 'no'),
    },
    {
      title: t('tvTexture'),
      dataIndex: 'tvTexture',
      key: 'tvTexture',
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: FurnitureResponse) => <Flex justify='space-evenly'>
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
    <LayoutPage title={t('furnitures')}>
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
        {record && <Modal open={true} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('furniture')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
          cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('category')}>
                  <Input value={record.category} onChange={(e) => setRecord({ ...record, category: e.target.value })} style={{ width: '100%' }} maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('subcategory')}>
                  <Input value={record.subcategory} onChange={(e) => setRecord({ ...record, subcategory: e.target.value })} style={{ width: '100%' }} maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('name')}>
                  <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} style={{ width: '100%' }} maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('model')}>
                  <Input value={record.model} onChange={(e) => setRecord({ ...record, model: e.target.value })} style={{ width: '100%' }} maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('value')}>
                  <InputNumber value={record.value} onChange={(value) => setRecord({ ...record, value: Number(value) })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('tvTexture')}>
                  <Input value={record.tvTexture} onChange={(e) => setRecord({ ...record, tvTexture: e.target.value })} style={{ width: '100%' }} maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Checkbox checked={record.useSlot} onChange={(e) => setRecord({ ...record, useSlot: e.target.checked })}>{t('useSlot')}</Checkbox>
                <Checkbox checked={record.door} onChange={(e) => setRecord({ ...record, door: e.target.checked })}>{t('door')}</Checkbox>
                <Checkbox checked={record.audioOutput} onChange={(e) => setRecord({ ...record, audioOutput: e.target.checked })}>{t('audioOutput')}</Checkbox>
              </Col>
            </Row>
          </Form>
        </Modal>}
      </>
    </LayoutPage>
  );
};

export default FurnituresPage;
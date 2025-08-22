import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { formatValue, removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Button, Col, Form, Input, InputNumber, Modal, Row, Select } from 'antd';
import type ItemTemplateResponse from '../../types/ItemTemplateResponse';
import type ItemCategoryResponse from '../../types/ItemCategoryResponse';

const ItemsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const [originalItems, setOriginalItems] = useState<ItemTemplateResponse[]>([]);
  const [items, setItems] = useState<ItemTemplateResponse[]>([]);
  const [search, setSearch] = useState('');
  const [record, setRecord] = useState<ItemTemplateResponse>();
  const [categories, setCategories] = useState<ItemCategoryResponse[]>([]);

  useEffect(() => {
    getItemsTemplates();
    getItemsCategories();
  }, []);

  const getItemsTemplates = () => {
    setLoading(true);
    api.getItemsTemplates()
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

  const getItemsCategories = () => {
    setLoading(true);
    api.getItemsCategories()
      .then(res => {
        setCategories(res);
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
      categoryDisplay: '',
      image: '',
      name: '',
      objectModel: '',
      type: '',
      weight: 0,
    })
  };

  const edit = (record: ItemTemplateResponse) => {
    setRecord(record);
  }

  const handleModalCancel = () => {
    setRecord(undefined);
  }

  const handleModalOk = () => {
    setLoading(true);
    api.saveItemTemplate(record!)
      .then(() => {
        getItemsTemplates();
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
      removeAccents(x.name).includes(newSearch) || removeAccents(x.categoryDisplay).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<ItemTemplateResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('category'),
      dataIndex: 'categoryDisplay',
      key: 'categoryDisplay',
    },
    {
      title: t('type'),
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: t('weight'),
      dataIndex: 'weight',
      key: 'weight',
      render: (weight: number) => formatValue(weight),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (_, record: ItemTemplateResponse) => <Button size='small' onClick={() => edit(record)}>{t('edit')}</Button>,
    },
  ];

  const getCategory = () => {
    return categories.find(x => x.value === record!.category);
  };

  useEffect(() => {
    if (!record)
      return;

    if (!(getCategory()?.hasType))
      setRecord({ ...record, type: '' });

  }, [record?.category]);

  return (
    <LayoutPage title={t('items')}>
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

        {record && <Modal open={true} title={(record.id ? t('edit') : t('add')) + ' ' + t('item')}
          onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
          cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('name')}>
                  <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} style={{ width: '100%' }} maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('category')}>
                  <Select disabled={!!record.id} value={record.category} options={categories}
                    onChange={(value) => setRecord({ ...record, category: value })} style={{ width: '100%' }} showSearch optionFilterProp='label' />
                </Form.Item>
              </Col>
            </Row>
            {getCategory()?.hasType && <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('type')}>
                  <Input value={record.type} onChange={(e) => setRecord({ ...record, type: e.target.value })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('weight')}>
                  <InputNumber value={record.weight} onChange={(value) => setRecord({ ...record, weight: value! })} style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('image')}>
                  <Input value={record.image} onChange={(e) => setRecord({ ...record, image: e.target.value })} style={{ width: '100%' }} maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('object')}>
                  <Input value={record.objectModel} onChange={(e) => setRecord({ ...record, objectModel: e.target.value })} style={{ width: '100%' }} maxLength={50} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>}
      </>
    </LayoutPage>
  );
};

export default ItemsPage;
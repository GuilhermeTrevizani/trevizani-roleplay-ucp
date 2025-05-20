import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import Table, { type ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';
import { removeAccents } from '../../services/format';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Button, Checkbox, Col, Flex, Form, Input, InputNumber, Modal, Popconfirm, Row } from 'antd';
import type AnimationResponse from '../../types/AnimationResponse';

const AnimationsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const [originalItems, setOriginalItems] = useState<AnimationResponse[]>([]);
  const [items, setItems] = useState<AnimationResponse[]>([]);
  const [search, setSearch] = useState('');
  const [record, setRecord] = useState<AnimationResponse>();

  useEffect(() => {
    getAnimations();
  }, []);

  const getAnimations = () => {
    setLoading(true);
    api.getAnimations()
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
      dictionary: '',
      display: '',
      flag: 0,
      onlyInVehicle: false,
      scenario: '',
    })
  };

  const edit = (record: AnimationResponse) => {
    setRecord(record);
  }

  const remove = (id: string) => {
    setLoading(true);
    api.removeAnimation(id)
      .then(res => {
        getAnimations();
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
    api.saveAnimation(record!)
      .then(res => {
        getAnimations();
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
      removeAccents(x.display).includes(newSearch) || removeAccents(x.dictionary).includes(newSearch)
      || removeAccents(x.name).includes(newSearch) || removeAccents(x.category).includes(newSearch)
      || removeAccents(x.scenario).includes(newSearch)
    );
    setItems(filteredItems);
  }, [search, originalItems]);

  const columns: ColumnsType<AnimationResponse> = [
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: t('option'),
      dataIndex: 'display',
      key: 'display',
    },
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('scenario'),
      dataIndex: 'scenario',
      key: 'scenario',
    },
    {
      title: t('flag'),
      dataIndex: 'flag',
      key: 'flag',
    },
    {
      title: t('onlyInVehicle'),
      dataIndex: 'onlyInVehicle',
      key: 'onlyInVehicle',
      align: 'center',
      render: (onlyInVehicle: boolean) => onlyInVehicle ? t('yes') : t('no'),
    },
    {
      title: t('options'),
      dataIndex: 'id',
      key: 'options',
      align: 'center',
      render: (id: string, record: AnimationResponse) => <Flex justify='space-evenly'>
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
    <LayoutPage title={t('animations')}>
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
        {record && <Modal open={true} title={(record.id != '' ? t('edit') : t('add')) + ' ' + t('animation')} onOk={handleModalOk} onCancel={handleModalCancel} confirmLoading={loading}
          cancelText={t('close')} okText={t('save')} >
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('category')}>
                  <Input value={record.category} onChange={(e) => setRecord({ ...record, category: e.target.value })} maxLength={25} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('option')}>
                  <Input value={record.display} onChange={(e) => setRecord({ ...record, display: e.target.value })} maxLength={25} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('dictionary')}>
                  <Input value={record.dictionary} onChange={(e) => setRecord({ ...record, dictionary: e.target.value })} maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('name')}>
                  <Input value={record.name} onChange={(e) => setRecord({ ...record, name: e.target.value })} maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('scenario')}>
                  <Input value={record.scenario} onChange={(e) => setRecord({ ...record, scenario: e.target.value })} maxLength={100} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('flag')}>
                  <InputNumber value={record.flag} onChange={(value) => setRecord({ ...record, flag: Number(value) })} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Checkbox checked={record.onlyInVehicle} onChange={(e) => setRecord({ ...record, onlyInVehicle: e.target.checked })}>{t('onlyInVehicle')}</Checkbox>
              </Col>
            </Row>
          </Form>
        </Modal>}
      </>
    </LayoutPage>
  );
};

export default AnimationsPage;
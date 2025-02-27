import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import { Button, Col, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import SelectOptionResponse from '../../types/SelectOptionResponse';
import LogResponse from '../../types/LogResponse';
import Table, { ColumnsType } from 'antd/es/table';
import { formatDateTime } from '../../services/format';
import LogRequest from '../../types/LogRequest';
import Text from 'antd/es/typography/Text';
import { useNotification } from '../../hooks/useNotification';

const LogsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [logTypes, setLogTypes] = useState<SelectOptionResponse[]>([]);
  const [logs, setLogs] = useState<LogResponse[]>([]);
  const [request, setRequest] = useState<LogRequest>({});
  const notification = useNotification();

  useEffect(() => {
    getLogTypes();
  }, []);

  const getLogTypes = () => {
    setLoading(true);
    api.getLogTypes()
      .then(res => {
        setLogTypes(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const searchLogs = () => {
    setLoading(true);
    api.searchLogs(request)
      .then(res => {
        setLogs(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns: ColumnsType<LogResponse> = [
    {
      title: '',
      children: [
        {
          title: t('type'),
          dataIndex: 'type',
          key: 'type',
        },
        {
          title: t('date'),
          dataIndex: 'date',
          key: 'date',
          render: (date: Date) => formatDateTime(date),
        },
        {
          title: t('description'),
          dataIndex: 'description',
          key: 'description',
          render: (description: string) => description.substring(0, 50) + (description.length > 50 ? '...' : ''),
        },
      ]
    },
    {
      title: t('origin'),
      children: [{
        title: t('name'),
        dataIndex: 'originCharacterName',
        key: 'originCharacterName',
      },
      {
        title: t('ip'),
        dataIndex: 'originIp',
        key: 'originIp',
      },
      {
        title: t('socialClub'),
        dataIndex: 'originSocialClubName',
        key: 'originSocialClubName',
      }],
    },
    {
      title: t('target'),
      children: [{
        title: t('name'),
        dataIndex: 'targetCharacterName',
        key: 'targetCharacterName',
      },
      {
        title: t('ip'),
        dataIndex: 'targetIp',
        key: 'targetIp',
      },
      {
        title: t('socialClub'),
        dataIndex: 'targetSocialClubName',
        key: 'targetSocialClubName',
      }],
    },
  ];

  return (
    <LayoutPage title={t('logs')}>
      <>
        <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col xs={24} md={10} lg={3} style={{ marginBottom: 5 }}>
                <Form.Item label={t('startDate')}>
                  <DatePicker value={request.startDate} format={{ format: 'DD/MM/YYYY', type: 'mask' }}
                    onChange={(value) => setRequest({ ...request, startDate: value })} style={{ width: '100%' }} placeholder={t('selectDate')} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={3} style={{ marginBottom: 5 }}>
                <Form.Item label={t('endDate')}>
                  <DatePicker value={request.endDate} format={{ format: 'DD/MM/YYYY', type: 'mask' }}
                    onChange={(value) => setRequest({ ...request, endDate: value })} style={{ width: '100%' }} placeholder={t('selectDate')} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={6}>
                <Form.Item label={t('type')}>
                  <Select allowClear options={logTypes} value={request.type} onChange={(value) => setRequest({ ...request, type: value })}
                    showSearch optionFilterProp='label' />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={12}>
                <Form.Item label={t('description')}>
                  <Input value={request.description} onChange={(e) => setRequest({ ...request, description: e.target.value })} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={10} lg={3}>
                <Form.Item label={t('originCharacter')}>
                  <Input value={request.originCharacter} onChange={(e) => setRequest({ ...request, originCharacter: e.target.value })} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={3}>
                <Form.Item label={t('originUser')}>
                  <Input value={request.originUser} onChange={(e) => setRequest({ ...request, originUser: e.target.value })} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={3}>
                <Form.Item label={t('originIp')}>
                  <Input value={request.originIp} onChange={(e) => setRequest({ ...request, originIp: e.target.value })} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={3}>
                <Form.Item label={t('originSocialClubName')}>
                  <Input value={request.originSocialClubName} onChange={(e) => setRequest({ ...request, originSocialClubName: e.target.value })} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={3}>
                <Form.Item label={t('targetCharacter')}>
                  <Input value={request.targetCharacter} onChange={(e) => setRequest({ ...request, targetCharacter: e.target.value })} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={3}>
                <Form.Item label={t('targetUser')}>
                  <Input value={request.targetUser} onChange={(e) => setRequest({ ...request, targetUser: e.target.value })} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={3}>
                <Form.Item label={t('targetIp')}>
                  <Input value={request.targetIp} onChange={(e) => setRequest({ ...request, targetIp: e.target.value })} />
                </Form.Item>
              </Col>
              <Col xs={24} md={10} lg={3}>
                <Form.Item label={t('targetSocialClubName')}>
                  <Input value={request.targetSocialClubName} onChange={(e) => setRequest({ ...request, targetSocialClubName: e.target.value })} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={24}>
                <Form.Item label={' '}>
                  <Button type='primary' style={{ width: '100%' }} onClick={searchLogs} loading={loading}>{t('search')}</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Text italic>{t('logsTip')}</Text>
          <Table
            rowKey={'id'}
            columns={columns}
            dataSource={logs}
            pagination={false}
            loading={loading}
            locale={{ emptyText: t('noLogs') }}
            expandable={{
              expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.description}</p>,
              rowExpandable: (record) => record.description?.length > 50,
            }}
          />
        </Space>
      </>
    </LayoutPage>
  );
};

export default LogsPage;
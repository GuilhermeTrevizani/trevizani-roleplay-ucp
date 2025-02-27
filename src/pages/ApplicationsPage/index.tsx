import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import { Button, Col, Flex, Form, Input, Modal, Row, Space, Table } from 'antd';
import { useEffect, useState } from 'react';
import ApplicationListResponse from '../../types/ApplicationListResponse';
import { ColumnsType } from 'antd/es/table';
import { useApi } from '../../hooks/useApi';
import { formatDateTime } from '../../services/format';
import ApplicationResponse from '../../types/ApplicationResponse';
import TextArea from 'antd/es/input/TextArea';
import { useNotification } from '../../hooks/useNotification';

const ApplicationsPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<ApplicationListResponse[]>([]);
  const [application, setApplication] = useState<ApplicationResponse>();
  const [denyModal, setDenyModal] = useState(false);
  const [denyReason, setDenyReason] = useState('');
  const notification = useNotification();

  const columns: ColumnsType<ApplicationListResponse> = [
    {
      title: t('name'),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('user'),
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: t('staffer'),
      dataIndex: 'stafferName',
      key: 'stafferName',
    },
    {
      title: t('date'),
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => formatDateTime(date),
    },
  ];

  useEffect(() => {
    getApplications();
  }, []);

  useEffect(() => {
    setDenyReason('');
  }, [denyModal]);

  const getApplications = () => {
    setLoading(true);
    api.getApplications()
      .then(res => {
        setApplications(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const evaluateApplication = () => {
    setLoading(true);
    api.getCurrentApplication()
      .then(res => {
        setApplication(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const acceptApplication = () => {
    setLoading(true);
    api.acceptApplication()
      .then(() => {
        setApplication(undefined);
        getApplications();
        notification.alert('success', t('applicationAccepted'));
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const denyApplication = () => {
    setLoading(true);
    api.denyApplication(denyReason)
      .then(() => {
        setApplication(undefined);
        setDenyModal(false);
        getApplications();
        notification.alert('success', t('applicationDenied'));
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LayoutPage title={t('applications')}>
      <>
        <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
          <Row itemType='flex' justify='end' align='middle'>
            <Button type='primary' onClick={evaluateApplication} loading={loading}>{t('evaluateApplication')}</Button>
          </Row>
          <Table
            columns={columns}
            dataSource={applications}
            loading={loading}
            pagination={false}
            locale={{ emptyText: t('noApplications') }}
          />
        </Space>
        {application && <Modal open={true} title={application.name} onCancel={() => setApplication(undefined)} footer={null}>
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t('name')}>
                  <Input readOnly value={application.name} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('user')}>
                  <Input readOnly value={application.userName} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label={t('sex')}>
                  <Input readOnly value={application.sex} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label={t('age')}>
                  <Input readOnly value={application.age} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('history')}>
                  <TextArea readOnly value={application.history} rows={10} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item>
              <Flex justify='space-evenly'>
                <Button danger onClick={() => setDenyModal(true)} loading={loading}>{t('deny')}</Button>
                <Button type='primary' onClick={acceptApplication} loading={loading}>{t('accept')}</Button>
              </Flex>
            </Form.Item>
          </Form>
        </Modal>}
        {denyModal && <Modal open={true} title={t('denyApplication')} onCancel={() => setDenyModal(false)}
          onOk={denyApplication}
          cancelText={t('close')} okText={t('deny')} confirmLoading={loading}>
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('reason')}>
                  <TextArea maxLength={1000} value={denyReason} onChange={(e) => setDenyReason(e.target.value)} rows={10} />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Modal>}
      </>
    </LayoutPage>
  );
};

export default ApplicationsPage;
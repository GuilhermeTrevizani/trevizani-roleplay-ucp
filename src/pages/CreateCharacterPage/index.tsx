import { t } from 'i18next';
import LayoutPage from '../LayoutPage';
import { useEffect, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { useNotification } from '../../hooks/useNotification';
import { Alert, Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import CreateCharacterRequest from '../../types/CreateCharacterRequest';
import { CharacterSex } from '../../types/CharacterSex';
import TextArea from 'antd/es/input/TextArea';
import CreateCharacterInfoResponse from '../../types/CreateCharacterInfoResponse';
import { stringFormat } from '../../i18n';

const CreateCharacterPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();
  const { id } = useParams();
  const [request, setRequest] = useState<CreateCharacterRequest>({
    age: 0,
    history: '',
    name: '',
    sex: CharacterSex.Man,
  })
  const navigate = useNavigate();
  const [response, setResponse] = useState<CreateCharacterInfoResponse>({
    age: 0,
    history: '',
    name: '',
    sex: CharacterSex.Man,
  });

  useEffect(() => {
    getInfo();
  }, []);

  const getInfo = () => {
    if (!id)
      return;

    setLoading(true);
    api.getCreateCharacterInfo(id)
      .then(res => {
        setResponse(res);
        if (res.rejectionReason)
          setRequest({
            ...request,
            id: id,
            name: res.name,
            age: res.age,
            history: res.history,
            sex: res.sex,
          });
        else
          setRequest({
            ...request,
            id: id,
          });
      })
      .catch(res => {
        notification.alert('error', res);
        navigate('/my-characters');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const sendApplication = () => {
    setLoading(true);
    api.createCharacter(request)
      .then(() => {
        navigate('/my-characters');
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <LayoutPage title={t('createCharacter')}>
      <>
        <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
          {response.rejectionReason && <Alert type='error' message={stringFormat(t('rejectionMessage'), response.staffer, response.rejectionReason)} />}
          {!response.rejectionReason && response.name && <Alert type='error' message={stringFormat('Você está aplicando uma mudança de nome em {0}. Tudo será resetado exceto saldo da conta bancária, itens, veículos, propriedades e empresas.', response.name)} />}
          <Alert type='warning' message={<span dangerouslySetInnerHTML={{ __html: t('featuresTip') }} />} />
          <Form layout='vertical'>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item label={t('fullName')}>
                  <Input value={request.name} maxLength={25} onChange={(e) => setRequest({ ...request, name: e.target.value })} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={t('sex')}>
                  <Select value={request.sex}
                    options={[
                      { value: CharacterSex.Man, label: t('man') },
                      { value: CharacterSex.Woman, label: t('woman') },
                    ]}
                    onChange={(e) => setRequest({ ...request, sex: e })}
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label={t('age')}>
                  <InputNumber value={request.age} min={16} max={90} style={{ width: '100%' }}
                    onChange={(e) => setRequest({ ...request, age: Number(e) })} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24} style={{ marginBottom: '5px' }}>
                <Alert type='warning' message={<span dangerouslySetInnerHTML={{ __html: t('descriptionTip') }} />} />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label={t('history')}>
                  <TextArea value={request.history} rows={10} showCount maxLength={4096} minLength={500}
                    onChange={(e) => setRequest({ ...request, history: e.target.value })} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Button type='primary' style={{ width: '100%' }} onClick={sendApplication} loading={loading}>{t('sendApplication')}</Button>
              </Col>
            </Row>
          </Form>
        </Space>
      </>
    </LayoutPage>
  );
};

export default CreateCharacterPage;
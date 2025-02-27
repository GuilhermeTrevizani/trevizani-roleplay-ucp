import { useEffect, useState } from 'react';
import LayoutPage from '../LayoutPage';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { useApi } from '../../hooks/useApi';
import { Alert, Badge, Button, Card, Col, Form, Input, Modal, Row, Space, Table, Tabs, TabsProps } from 'antd';
import { t } from 'i18next';
import { formatMoney, formatValue } from '../../services/format';
import Title from 'antd/es/typography/Title';
import { useLocation } from 'react-router-dom';
import PremiumResponse, { PremiumPackage } from '../../types/PremiumResponse';
import CreatePremiumRequest from '../../types/CreatePremiumRequest';
import Text from 'antd/es/typography/Text';
import { useNotification } from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';

initMercadoPago(process.env.REACT_APP_MERCADO_PAGO_ACCESS_TOKEN!);

const PremiumPage = () => {
  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [premium, setPremium] = useState<PremiumResponse>(null!);
  const location = useLocation();
  const [responseStatusCode, setResponseStatusCode] = useState(0);
  const [premiumRequest, setPremiumRequest] = useState<CreatePremiumRequest>({
    quantity: 0,
    userName: '',
  });
  const [premiumPackageName, setPremiumPackageName] = useState('');
  const notification = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('responseStatusCode');
    if (code)
      setResponseStatusCode(Number(code));

    api.getPremium()
      .then(res => {
        setPremium(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const buyPackage = (premiumPackage: PremiumPackage) => {
    setLoading(true);
    setPremiumPackageName(premiumPackage.name);
    setPremiumRequest({
      quantity: premiumPackage.quantity,
      userName: user?.discordUsername ?? '',
    });
    setLoading(false);
  };

  const buyConfirm = () => {
    setLoading(true);
    api.requestPremiumPackage(premiumRequest)
      .then(res => {
        setPremium({
          ...premium,
          currentPurchaseName: premiumPackageName,
          currentPurchasePreferenceId: res
        });
        setPremiumPackageName('');
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const cancelPurchase = () => {
    setLoading(true);
    api.cancelPremium()
      .then(() => {
        setPremium({
          ...premium,
          currentPurchasePreferenceId: undefined,
          currentPurchaseName: undefined,
        });
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const dataSource = [
    {
      feature: 'Troca de Nome',
      normal: '0',
      bronze: '0',
      silver: '1',
      gold: '1',
    },
    {
      feature: 'Troca de Número',
      normal: '0',
      bronze: '1',
      silver: '2',
      gold: '2',
    },
    {
      feature: 'Troca de Placa',
      normal: '0',
      bronze: '1',
      silver: '2',
      gold: '2',
    },
    {
      feature: 'Outfits',
      normal: '10',
      bronze: '15',
      silver: '20',
      gold: '30',
    },
    {
      feature: 'Mobílias Interior',
      normal: '100',
      bronze: '300',
      silver: '600',
      gold: '1000',
    },
    {
      feature: 'Mobílias Exterior',
      normal: '2',
      bronze: '4',
      silver: '6',
      gold: '10',
    },
    {
      feature: 'Prioridade Avaliação Personagem',
      normal: 'Não',
      bronze: 'Sim',
      silver: 'Sim',
      gold: 'Sim',
    },
    {
      feature: 'Cooldown de Anúncio',
      normal: '30 minutos',
      bronze: '20 minutos',
      silver: '10 minutos',
      gold: '5 minutos',
    },
    {
      feature: 'Duração Infomarker',
      normal: 'Até 3 dias',
      bronze: 'Até 7 dias',
      silver: 'Até 15 dias',
      gold: 'Até 30 dias',
    },
    {
      feature: 'Quantidade Infomarker',
      normal: '1',
      bronze: '3',
      silver: '5',
      gold: '10',
    },
    {
      feature: 'Inatividade de Propriedades',
      normal: '3 horas em 10 dias',
      bronze: '3 horas em 10 dias',
      silver: '3 horas em 20 dias',
      gold: '3 horas em 30 dias',
    },
    {
      feature: 'Bloqueio de PM',
      normal: 'Não',
      bronze: 'Sim',
      silver: 'Sim',
      gold: 'Sim',
    },
    {
      feature: 'Imposto de Propriedades',
      normal: '0,15%',
      bronze: '0,13%',
      silver: '0,10%',
      gold: '0,08%',
    },
    {
      feature: 'Imposto de Veículos',
      normal: '0,10%',
      bronze: '0,07%',
      silver: '0,05%',
      gold: '0,03%',
    },
    {
      feature: 'Veículos Exclusivos',
      normal: 'Não',
      bronze: 'Seashark, Seashark3, TriBike, Havok, Double, Hakuchou2, Vindicator, Baller2, Locust, Komoda, Turismo2, Krieger, Nero2, Tyrant, Cinquemila, Buffalo4, Baller7, Mule5, Sanchez2, Blazer3',
      silver: 'Tropic2, Issi2, Windsor2, Tribike2, Akuma, Carbonrs, Yosemite2, Brawler, Everon, Nimbus, Comet5, Ninef2, Entity2, Prototipo, Emerus, Reever, Iwagen, Astron, Jubilee, Ignus, Patriot3',
      gold: 'Speeder, TriBik3, Supervolito2, Bf400, Dominator3, Dubsta3, Luxor2, Contender, Patriot2, Deveste, Elegy, Neon, Issi7, Pfister811, Banshee2, Shinobi, Reever, Comet7, Deity, Granger2, Zeno, Blazer2',
    },
    // {
    //   feature: 'Roupas Exclusivas',
    //   normal: 'Não',
    //   bronze: 'Não',
    //   silver: 'Não',
    //   gold: 'Sim',
    // },
    {
      feature: 'TV',
      normal: 'Não',
      bronze: 'Não',
      silver: 'Não',
      gold: 'Sim',
    },
    {
      feature: 'Rádio Personalizada',
      normal: 'Não',
      bronze: 'Sim',
      silver: 'Sim',
      gold: 'Sim',
    },
    {
      feature: 'Rankbar Permanente Fórum/Discord',
      normal: 'Não',
      bronze: 'Sim',
      silver: 'Sim',
      gold: 'Sim',
    },
    {
      feature: 'Clima no Interior de Propriedades',
      normal: 'Não',
      bronze: 'Sim',
      silver: 'Sim',
      gold: 'Sim',
    },
    {
      feature: 'Hora no Interior de Propriedades',
      normal: 'Não',
      bronze: 'Sim',
      silver: 'Sim',
      gold: 'Sim',
    },
    // {
    //   feature: 'Flyer de Anúncio',
    //   normal: 'Não',
    //   bronze: 'Não',
    //   silver: 'Sim',
    //   gold: 'Sim',
    // },
    {
      feature: 'Duração de Graffiti',
      normal: '5 dias',
      bronze: '7 dias',
      silver: '14 dias',
      gold: '21 dias',
    },
    {
      feature: 'Quantidade de Graffiti',
      normal: '2',
      bronze: '3',
      silver: '4',
      gold: '5',
    },
    {
      feature: 'Estilo de Caminhada',
      normal: 'Não',
      bronze: 'Sim',
      silver: 'Sim',
      gold: 'Sim',
    },
  ];

  const columns = [
    {
      title: 'Funcionalidade',
      dataIndex: 'feature',
      key: 'feature',
    },
    {
      title: 'Jogador Normal',
      dataIndex: 'normal',
      key: 'normal',
    },
    {
      title: 'Premium Bronze',
      dataIndex: 'bronze',
      key: 'bronze',
    },
    {
      title: 'Premium Prata',
      dataIndex: 'silver',
      key: 'silver',
    },
    {
      title: 'Premium Ouro',
      dataIndex: 'gold',
      key: 'gold',
    },
  ];

  if (responseStatusCode !== 0) {
    if (responseStatusCode === 1)
      return <LayoutPage><Alert message={<>Você comprou com sucesso seu pacote de LS Points. Clique <a href='/premium'>aqui</a> para ser redirecionado.</>} type="success" /></LayoutPage>;

    if (responseStatusCode === 2)
      return <LayoutPage><Alert message={<>O pagamento do seu pacote de LS Points está pendente. Por favor, aguarde a confirmação. Clique <a href='/premium'>aqui</a> para ser redirecionado.</>} type="warning" /></LayoutPage>;

    if (responseStatusCode === 3)
      return <LayoutPage><Alert message={<>O pagamento do seu pacote de LS Points falhou. Se você acredita que isso seja um bug, por favor reporte. Clique <a href='/premium'>aqui</a> para ser redirecionado.</>} type="error" /></LayoutPage>;
  }

  if (!premium)
    return <LayoutPage><>Carregando...</></LayoutPage>

  const items: TabsProps['items'] = [
    {
      key: 'Pacotes',
      label: 'Pacotes',
      children: <>
        <Row gutter={16}>
          {premium.packages.map((premiumPackage) => {
            return (
              <Col xs={24} md={10} lg={6} style={{ marginBottom: 5 }}>
                <Badge.Ribbon text={<>
                  {premiumPackage.value === premiumPackage.originalValue && formatMoney(premiumPackage.value)}
                  {premiumPackage.value !== premiumPackage.originalValue && <><Text delete>{formatMoney(premiumPackage.originalValue)}</Text> {formatMoney(premiumPackage.value)}</>}
                </>} color="purple">
                  <Card title={premiumPackage.name}>
                    <Button onClick={() => buyPackage(premiumPackage)}>{t('buy')}</Button>
                  </Card>
                </Badge.Ribbon>
              </Col>
            )
          })}
        </Row>
      </>,
    },
    {
      key: 'Níveis',
      label: 'Níveis',
      children: <>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </>,
    },
    {
      key: 'Itens',
      label: 'Itens',
      children: <>
        <Row gutter={16}>
          {premium.items.map((item) => {
            return (
              <Col xs={24} md={10} lg={6} style={{ marginBottom: 5 }}>
                <Badge.Ribbon text={`${formatValue(item.value)} LS Points`} color="purple">
                  <Card title={item.name} style={{ marginBottom: '5px' }}>
                    Use /premium no servidor para adquirir.
                  </Card>
                </Badge.Ribbon>
              </Col>
            )
          })}
        </Row>
      </>,
    },
  ];

  return <LayoutPage title={t('premium')}>
    <>
      <Space direction='vertical' size='middle' style={{ display: 'flex' }}>
        {!premium.currentPurchaseName && <Tabs defaultActiveKey="1" items={items} />}

        {premium.currentPurchaseName && <>
          <Title level={4}>{premium.currentPurchaseName}</Title>
          {premium.currentPurchasePreferenceId && !loading && <div style={{ width: '300px' }}>
            <Wallet initialization={{ preferenceId: premium.currentPurchasePreferenceId }}
              customization={{ valueProp: 'smart_option' }} />
          </div>}
          <Button onClick={cancelPurchase} loading={loading} danger>Cancelar Compra</Button>
        </>}
      </Space>

      {premiumPackageName && <Modal open={true} title={premiumPackageName}
        onCancel={() => setPremiumPackageName('')}
        onOk={buyConfirm}
        cancelText={t('close')} okText={t('buy')} confirmLoading={loading}>
        <Form layout='vertical'>
          <Row gutter={16} style={{ marginBottom: '10px' }}>
            <Col span={24}>
              <Alert message='Para comprar o pacote como presente para outro usuário, basta informar o nome do usuário do Discord abaixo. Caso o pacote for para você mesmo, informe seu nome de usuário.' type="warning" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label={t('user')}>
                <Input value={premiumRequest.userName}
                  onChange={(e) => setPremiumRequest({ ...premiumRequest, userName: e.target.value })} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>}
    </>
  </LayoutPage>
};

export default PremiumPage;
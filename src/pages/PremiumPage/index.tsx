import { useEffect, useState } from 'react';
import LayoutPage from '../LayoutPage';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import { useApi } from '../../hooks/useApi';
import { Alert, Badge, Button, Card, Col, Form, Input, Modal, Row, Space, Table, Tabs, type TabsProps } from 'antd';
import { t } from 'i18next';
import { formatMoney, formatValue } from '../../services/format';
import Title from 'antd/es/typography/Title';
import { useLocation } from 'react-router-dom';
import type { PremiumResponse, PremiumPackage } from '../../types/PremiumResponse';
import type CreatePremiumRequest from '../../types/CreatePremiumRequest';
import Text from 'antd/es/typography/Text';
import { useNotification } from '../../hooks/useNotification';
import useAuth from '../../hooks/useAuth';

initMercadoPago(import.meta.env.VITE_APP_MERCADO_PAGO_ACCESS_TOKEN!);

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
      feature: t('outfits'),
      normal: '10',
      bronze: '15',
      silver: '20',
      gold: '30',
    },
    {
      feature: t('interiorFurnitures'),
      normal: '100',
      bronze: '300',
      silver: '600',
      gold: '1000',
    },
    {
      feature: t('exteriorFurnitures'),
      normal: '2',
      bronze: '4',
      silver: '6',
      gold: '10',
    },
    {
      feature: t('characterAvaliationPriority'),
      normal: t('no'),
      bronze: t('yes'),
      silver: t('yes'),
      gold: t('yes'),
    },
    {
      feature: t('announcementCooldown'),
      normal: `30 ${t('minutes').toLowerCase()}`,
      bronze: `20 ${t('minutes').toLowerCase()}`,
      silver: `10 ${t('minutes').toLowerCase()}`,
      gold: `5 ${t('minutes').toLowerCase()}`,
    },
    {
      feature: t('infomarkerDuration'),
      normal: `${t('until')} 3 ${t('days').toLowerCase()}`,
      bronze: `${t('until')} 7 ${t('days').toLowerCase()}`,
      silver: `${t('until')} 15 ${t('days').toLowerCase()}`,
      gold: `${t('until')} 30 ${t('days').toLowerCase()}`,
    },
    {
      feature: t('infomarkerQuantity'),
      normal: '1',
      bronze: '3',
      silver: '5',
      gold: '10',
    },
    {
      feature: t('pmBlock'),
      normal: t('no'),
      bronze: t('yes'),
      silver: t('yes'),
      gold: t('yes'),
    },
    {
      feature: t('propertiesTax'),
      normal: '0,15%',
      bronze: '0,13%',
      silver: '0,10%',
      gold: '0,08%',
    },
    {
      feature: t('vehiclesTax'),
      normal: '0,10%',
      bronze: '0,07%',
      silver: '0,05%',
      gold: '0,03%',
    },
    {
      feature: t('exclusiveVehicles'),
      normal: t('no'),
      bronze: 'Seashark, Seashark3, TriBike, Havok, Double, Hakuchou2, Vindicator, Baller2, Locust, Komoda, Turismo2, Krieger, Nero2, Tyrant, Cinquemila, Buffalo4, Baller7, Mule5, Sanchez2, Blazer3',
      silver: 'Tropic2, Issi2, Windsor2, Tribike2, Akuma, Carbonrs, Yosemite2, Brawler, Everon, Nimbus, Comet5, Ninef2, Entity2, Prototipo, Emerus, Reever, Iwagen, Astron, Jubilee, Ignus, Patriot3',
      gold: 'Speeder, TriBik3, Supervolito2, Bf400, Dominator3, Dubsta3, Luxor2, Contender, Patriot2, Deveste, Elegy, Neon, Issi7, Pfister811, Banshee2, Shinobi, Reever, Comet7, Deity, Granger2, Zeno, Blazer2',
    },
    {
      feature: t('tv'),
      normal: t('no'),
      bronze: t('no'),
      silver: t('no'),
      gold: t('yes'),
    },
    {
      feature: t('personalizedRadio'),
      normal: t('no'),
      bronze: t('yes'),
      silver: t('yes'),
      gold: t('yes'),
    },
    {
      feature: t('discordAndForumPermanentRankbar'),
      normal: t('no'),
      bronze: t('yes'),
      silver: t('yes'),
      gold: t('yes'),
    },
    {
      feature: t('weatherOnPropertyInterior'),
      normal: t('no'),
      bronze: t('yes'),
      silver: t('yes'),
      gold: t('yes'),
    },
    {
      feature: t('hourOnPropertyInterior'),
      normal: t('no'),
      bronze: t('yes'),
      silver: t('yes'),
      gold: t('yes'),
    },
    {
      feature: t('graffitiDuration'),
      normal: `5 ${t('days').toLowerCase()}`,
      bronze: `7 ${t('days').toLowerCase()}`,
      silver: `14 ${t('days').toLowerCase()}`,
      gold: `21 ${t('days').toLowerCase()}`,
    },
    {
      feature: t('graffitiQuantity'),
      normal: '2',
      bronze: '3',
      silver: '4',
      gold: '5',
    },
    {
      feature: t('walkStyle'),
      normal: t('no'),
      bronze: t('yes'),
      silver: t('yes'),
      gold: t('yes'),
    },
  ];

  const columns = [
    {
      title: t('feature'),
      dataIndex: 'feature',
      key: 'feature',
    },
    {
      title: t('normalPlayer'),
      dataIndex: 'normal',
      key: 'normal',
    },
    {
      title: t('premiumBronze'),
      dataIndex: 'bronze',
      key: 'bronze',
    },
    {
      title: t('premiumSilver'),
      dataIndex: 'silver',
      key: 'silver',
    },
    {
      title: t('premiumGold'),
      dataIndex: 'gold',
      key: 'gold',
    },
  ];

  if (responseStatusCode !== 0) {
    if (responseStatusCode === 1)
      return <LayoutPage><Alert message={t('premiumPaymentSuccessMessage')} type="success" /></LayoutPage>;

    if (responseStatusCode === 2)
      return <LayoutPage><Alert message={t('premiumPaymentPendingMessage')} type="warning" /></LayoutPage>;

    if (responseStatusCode === 3)
      return <LayoutPage><Alert message={t('premiumPaymentErrorMessage')} type="error" /></LayoutPage>;
  }

  if (!premium)
    return <LayoutPage><>{t('loading')}</></LayoutPage>

  const items: TabsProps['items'] = [
    {
      key: t('packages'),
      label: t('packages'),
      children: <>
        <Row gutter={16}>
          {premium.packages.map((premiumPackage) => {
            return (
              <Col xs={24} md={10} lg={6} style={{ marginBottom: 5 }}>
                <Badge.Ribbon text={<>
                  {premiumPackage.value === premiumPackage.originalValue && formatMoney(premiumPackage.value)}
                  {premiumPackage.value !== premiumPackage.originalValue && <><Text delete>{formatMoney(premiumPackage.originalValue)}</Text> {formatMoney(premiumPackage.value)}</>}
                </>} color="blue">
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
      key: t('levels'),
      label: t('levels'),
      children: <>
        <Table dataSource={dataSource} columns={columns} pagination={false} />
      </>,
    },
    {
      key: t('items'),
      label: t('items'),
      children: <>
        <Row gutter={16}>
          {premium.items.map((item) => {
            return (
              <Col xs={24} md={10} lg={6} style={{ marginBottom: 5 }}>
                <Badge.Ribbon text={`${formatValue(item.value)} Premium Points`} color="blue">
                  <Card title={item.name} style={{ marginBottom: '5px' }}>
                    {t('usePremiumTip')}
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
          <Button onClick={cancelPurchase} loading={loading} danger>{t('cancelPurchase')}</Button>
        </>}
      </Space>

      {premiumPackageName && <Modal open={true} title={premiumPackageName}
        onCancel={() => setPremiumPackageName('')}
        onOk={buyConfirm}
        cancelText={t('close')} okText={t('buy')} confirmLoading={loading}>
        <Form layout='vertical'>
          <Row gutter={16} style={{ marginBottom: '10px' }}>
            <Col span={24}>
              <Alert message={t('buyPremiumTip')} type="warning" />
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
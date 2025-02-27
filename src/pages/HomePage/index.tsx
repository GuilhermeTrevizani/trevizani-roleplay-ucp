import LayoutPage from '../LayoutPage';
import { t } from 'i18next';
import { Col, Flex, Row, Statistic, StatisticProps } from 'antd';
import CountUp from 'react-countup';
import { useEffect, useState } from 'react';
import DashboardResponse from '../../types/DashboardResponse';
import { useApi } from '../../hooks/useApi';
import {
  CarOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
  UserOutlined
} from '@ant-design/icons';
import './styles.css'
import { useNotification } from '../../hooks/useNotification';

const HomePage = () => {
  const notification = useNotification();

  const formatter: StatisticProps['formatter'] = (value) => {
    return (
      <CountUp end={value as number} separator="." />
    );
  };

  const api = useApi();
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardResponse>({
    users: 0,
    characters: 0,
    properties: 0,
    vehicles: 0,
  });

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = () => {
    setLoading(true);
    api.getDashboard()
      .then(res => {
        setDashboard(res);
      })
      .catch(res => {
        notification.alert('error', res);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LayoutPage title={t('home')}>
      <>
        <Flex gap={'small'} wrap justify='space-around' >
          <Col sm={16} xl={5} md={12} xs={20} className='homePageCard'>
            <div className='homePageCardIcon'>
              <UserOutlined />
            </div>
            <Statistic title="Usuários" value={dashboard.users} formatter={formatter} />
          </Col>
          <Col sm={16} xl={5} md={12} xs={20} className='homePageCard'>
            <div className='homePageCardIcon'>
              <UsergroupAddOutlined />
            </div>
            <Statistic title="Personagens" value={dashboard.characters} formatter={formatter} />
          </Col>
          <Col sm={16} xl={5} md={12} xs={20} className='homePageCard'>
            <div className='homePageCardIcon'>
              <CarOutlined />
            </div>
            <Statistic title="Veículos" value={dashboard.vehicles} formatter={formatter} />
          </Col>
          <Col sm={16} xl={5} md={12} xs={20} className='homePageCard'>
            <div className='homePageCardIcon'>
              <HomeOutlined />
            </div>
            <Statistic title="Propriedades" value={dashboard.properties} formatter={formatter} />
          </Col>
          <Col md={11} xs={20}>
            <iframe style={{ width: '100%', height: '500px' }} src="https://discord.com/widget?id=1288265407098261554&theme=dark" allowTransparency={true}
              frameBorder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>
          </Col>
          <Col md={11} xs={20}>
            <iframe style={{ width: '100%', height: '500px' }}
              src="https://www.youtube.com/embed/videoseries?list=PL9ckjZYa1Xp4LDey_gCo2MaIQrZPVLsjQ"
              frameBorder="0" allowFullScreen></iframe>
          </Col>
        </Flex>
      </>
    </LayoutPage>
  );
};

export default HomePage;
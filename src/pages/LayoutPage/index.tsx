import React, { ReactElement, useEffect, useState } from 'react';
import { Avatar, Button, Drawer, Dropdown, Layout, Menu } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import type { MenuProps } from 'antd';
import bg from '../../assets/background.png'
import logo from '../../assets/logo.png'
import {
  DislikeOutlined,
  DollarOutlined,
  FileSearchOutlined,
  HomeOutlined,
  LogoutOutlined,
  MehOutlined,
  ProfileOutlined,
  SolutionOutlined,
  StarOutlined,
  TrophyOutlined,
  DownOutlined,
  UserOutlined,
  MenuOutlined,
  FormatPainterOutlined,
  AimOutlined,
  PlayCircleOutlined,
  MoneyCollectOutlined,
  WechatOutlined,
  WifiOutlined
} from '@ant-design/icons';
import { UserStaff } from '../../types/UserStaff';
import './styles.css'
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { useNotification } from '../../hooks/useNotification';
import { useApi } from '../../hooks/useApi';
import { formatValue } from '../../services/format';
import { StaffFlag } from '../../types/StaffFlag';

const { Content, Sider, Header } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const getItem = (
  key: string,
  label: string,
  icon: React.ReactNode,
) => {
  return {
    key,
    icon,
    label,
  } as MenuItem;
}

function LayoutPage({ children, title }: { children: ReactElement, title?: string }) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false)
  const [drawerClosed, setDrawerClosed] = useState(true)
  const [menuUserIsOpen, setMenuUserIsOpen] = useState(false)
  const dimensions = useWindowDimensions();
  const api = useApi();
  const [premiumPoints, setPremiumPoints] = useState(0);
  const notification = useNotification();

  useEffect(() => {
    api.getMyInfo()
      .then(res => {
        setPremiumPoints(res.premiumPoints);
        localStorage.setItem('STAFF', res.staff.toString());
        localStorage.setItem('STAFF_FLAGS', JSON.stringify(res.staffFlags));
      })
      .catch(res => {
        notification.alert('error', res);
      });
  }, []);

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(`/${e.key}`);
  };

  const userMenuItems: MenuItem[] = [
    {
      label: t('logout'),
      key: 'logout',
      icon: <LogoutOutlined />,
      onClick: () => {
        logout();
        navigate('/login');
      },
    }
  ];

  const getPlayerRank = () => {
    if (user?.staff === UserStaff.HeadServerDeveloper)
      return 'Head Server Developer';

    if (user?.staff === UserStaff.ServerManager)
      return 'Server Manager';

    if (user?.staff === UserStaff.LeadServerAdmin)
      return 'Lead Server Admin';

    if (user?.staff === UserStaff.SeniorServerAdmin)
      return 'Senior Server Admin';

    if (user?.staff === UserStaff.ServerAdminII)
      return 'Server Admin II';

    if (user?.staff === UserStaff.ServerAdminI)
      return 'Server Admin I';

    if (user?.staff === UserStaff.JuniorServerAdmin)
      return 'Junior Server Admin';

    if (user?.staff === UserStaff.ServerSupport)
      return 'Server Support';

    return 'Player';
  };

  const items: MenuItem[] = [
    getItem('', t('home'), <HomeOutlined />),
    getItem('premium', t('premium'), <TrophyOutlined />),
    getItem('my-characters', t('myCharacters'), <UserOutlined />),
    getItem('my-punishments', t('myPunishments'), <MehOutlined />),
    getItem('chatlog', t('chatlog'), <WechatOutlined />),
  ];

  if ((user?.staff ?? UserStaff.None) >= UserStaff.ServerSupport) {
    items.push(getItem('applications', t('applications'), <SolutionOutlined />));
    items.push(getItem('banishments', t('banishments'), <DislikeOutlined />));
    items.push(getItem('staff', t('staff'), <StarOutlined />));
  }

  if ((user?.staff ?? UserStaff.None) >= UserStaff.JuniorServerAdmin)
    items.push(getItem('potential-fakes', t('potentialFakes'), <WifiOutlined />));

  if (user?.staffFlags.includes(StaffFlag.Furnitures))
    items.push(getItem('furnitures', t('furnitures'), <FormatPainterOutlined />));

  if (user?.staffFlags.includes(StaffFlag.Properties))
    items.push(getItem('properties', t('properties'), <HomeOutlined />));

  if (user?.staffFlags.includes(StaffFlag.Animations))
    items.push(getItem('animations', t('animations'), <PlayCircleOutlined />));

  if (user?.staffFlags.includes(StaffFlag.Factions))
    items.push(getItem('crimes', t('crimes'), <AimOutlined />));

  if ((user?.staff ?? UserStaff.None) >= UserStaff.LeadServerAdmin)
    items.push(getItem('logs', t('logs'), <FileSearchOutlined />));

  if ((user?.staff ?? UserStaff.None) >= UserStaff.ServerManager) {
    items.push(getItem('patrimony', t('patrimony'), <MoneyCollectOutlined />));
    items.push(getItem('parameters', t('parameters'), <ProfileOutlined />));
    items.push(getItem('sales', t('sales'), <DollarOutlined />));
  }

  const currentRoute = location.pathname.replace('/', '').split('/')[0];
  const selectedItem = items.find(x => x?.key?.toString().startsWith(currentRoute) || x?.key == currentRoute)?.key?.toString() ?? '';

  return (
    <div className='layoutOver'>
      <div className='layoutTopImage' style={{ backgroundImage: 'url(' + bg + ')' }}>
        <img src={logo} alt="logo" className='layoutTopImageLogo' />
        <div className='layoutTopEnd'>
          {/* <div className='layoutTopEndOptions'>
            <div className='layoutTopEndOption'>
              <QuestionOutlined />
            </div>
            <div className='layoutTopEndOption'>
              <SettingOutlined />
            </div>
            <div className='layoutTopEndOption'>
              <NotificationOutlined />
            </div>
          </div> */}
          <div>
            <Dropdown menu={{ items: userMenuItems }} open={menuUserIsOpen}>
              <div onClick={(e) => setMenuUserIsOpen(old => !old)} className='layoutTopEndUserMenu'>
                <Avatar size={48} src={user?.avatar} icon={<UserOutlined />} />
                <div className='layoutTopEndUserMenuUserData'>
                  <span>
                    {user?.name}
                  </span>
                  <span style={{ color: '#a6a4a4' }}>
                    {getPlayerRank()}
                  </span>
                </div>
                <DownOutlined />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
      <Layout hasSider>
        {dimensions.isMobile ?
          <Drawer
            title="Menu"
            placement={'left'}
            closable={true}
            onClose={() => setDrawerClosed(old => !old)}
            open={!drawerClosed}
            style={{ backgroundColor: '#141414' }}
            styles={{
              body: {
                padding: 0
              }
            }}
          >
            <Menu
              mode="inline"
              theme='light'
              selectedKeys={[selectedItem]}
              items={items}
              onClick={onClick}
            />
          </Drawer>
          :
          <Sider trigger={null} collapsible theme='light' collapsed={collapsed}>
            <Menu
              mode="inline"
              theme='light'
              selectedKeys={[selectedItem]}
              items={items}
              onClick={onClick}
            />
          </Sider>
        }
        <Layout>
          <Header style={{ padding: 0, backgroundColor: '#141414' }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => { dimensions.isMobile ? setDrawerClosed(false) : setCollapsed(!collapsed) }}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
                color: 'white'
              }}
            />
            <div className='layoutHeaderBar'>
              <span className='layoutTitle'>{title}</span>
              <span className='layoutLsPointsText'><strong>{formatValue(premiumPoints)}</strong> LS Points</span>
            </div>
          </Header>
          <Content style={{ padding: '0 50px' }}>
            <div className="site-layout-content" style={{ padding: 10, margin: '10px 0' }}>
              {children}
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

export default LayoutPage;
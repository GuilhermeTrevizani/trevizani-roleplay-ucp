import React, { type ReactElement, useEffect, useState } from 'react';
import { Avatar, Badge, Button, Drawer, Dropdown, Layout, Menu } from 'antd';
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
  WifiOutlined,
  DeploymentUnitOutlined,
  BarsOutlined,
  DropboxOutlined,
  SmileOutlined,
  BellOutlined
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
  const [notificationsUnread, setNotificationsUnread] = useState(0);

  useEffect(() => {
    api.getMyInfo()
      .then(res => {
        setPremiumPoints(res.premiumPoints);
        localStorage.setItem('STAFF', res.staff.toString());
        localStorage.setItem('STAFF_FLAGS', JSON.stringify(res.staffFlags));
        setNotificationsUnread(res.notificationsUnread);
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
    if (user?.staff === UserStaff.Founder)
      return 'Founder';

    if (user?.staff === UserStaff.Management)
      return t('management');

    if (user?.staff === UserStaff.HeadAdmin)
      return 'Head Admin';

    if (user?.staff === UserStaff.LeadAdmin)
      return t('leadAdmin');

    if (user?.staff === UserStaff.GameAdmin)
      return t('gameAdmin');

    if (user?.staff === UserStaff.Tester)
      return t('tester');

    return 'Player';
  };

  const items: MenuItem[] = [
    getItem('', t('home'), <HomeOutlined />),
    getItem('premium', t('premium'), <TrophyOutlined />),
    getItem('my-characters', t('myCharacters'), <UserOutlined />),
    getItem('my-punishments', t('myPunishments'), <MehOutlined />),
    getItem('my-factions', t('myFactions'), <DeploymentUnitOutlined />),
    getItem('chatlog', t('chatlog'), <WechatOutlined />),
  ];

  const flagsItems: MenuItem[] = [];

  if (user?.staffFlags.includes(StaffFlag.Furnitures))
    flagsItems.push(getItem('furnitures', t('furnitures'), <FormatPainterOutlined />));

  if (user?.staffFlags.includes(StaffFlag.Properties))
    flagsItems.push(getItem('properties', t('properties'), <HomeOutlined />));

  if (user?.staffFlags.includes(StaffFlag.Animations))
    flagsItems.push(getItem('animations', t('animations'), <PlayCircleOutlined />));

  if (user?.staffFlags.includes(StaffFlag.Factions)) {
    flagsItems.push(getItem('crimes', t('crimes'), <AimOutlined />));
    flagsItems.push(getItem('factions', t('factions'), <BarsOutlined />));
  }

  if (user?.staffFlags.includes(StaffFlag.Items))
    flagsItems.push(getItem('items', t('items'), <DropboxOutlined />));

  if (user?.staffFlags.includes(StaffFlag.Drugs))
    flagsItems.push(getItem('drugs', t('drugs'), <SmileOutlined />));

  if (flagsItems.length > 0)
    items.push({
      type: 'divider',
    }, {
      key: t('flags'),
      label: t('flags'),
      type: 'group',
      children: flagsItems,
    })

  if ((user?.staff ?? UserStaff.None) >= UserStaff.Tester)
    items.push({
      type: 'divider',
    }, {
      key: t('tester'),
      label: t('tester'),
      type: 'group',
      children: [
        getItem('applications', t('applications'), <SolutionOutlined />),
        getItem('banishments', t('banishments'), <DislikeOutlined />),
        getItem('staff', t('staff'), <StarOutlined />),
      ],
    })

  if ((user?.staff ?? UserStaff.None) >= UserStaff.GameAdmin)
    items.push({
      type: 'divider',
    }, {
      key: t('gameAdmin'),
      label: t('gameAdmin'),
      type: 'group',
      children: [
        getItem('potential-fakes', t('potentialFakes'), <WifiOutlined />),
      ],
    })

  if ((user?.staff ?? UserStaff.None) >= UserStaff.LeadAdmin)
    items.push({
      type: 'divider',
    }, {
      key: t('leadAdmin'),
      label: t('leadAdmin'),
      type: 'group',
      children: [
        getItem('logs', t('logs'), <FileSearchOutlined />),
      ],
    })

  if ((user?.staff ?? UserStaff.None) >= UserStaff.Management)
    items.push({
      type: 'divider',
    }, {
      key: t('management'),
      label: t('management'),
      type: 'group',
      children: [
        getItem('patrimony', t('patrimony'), <MoneyCollectOutlined />),
        getItem('parameters', t('parameters'), <ProfileOutlined />),
        getItem('sales', t('sales'), <DollarOutlined />),
      ],
    })

  const currentRoute = location.pathname.replace('/', '').split('/')[0];

  const extasRoutes: Record<string, string> = {
    'create-character': 'my-characters',
    'character': 'my-characters',
    'faction': 'my-factions',
  };

  const selectedItem = extasRoutes[currentRoute] ?? currentRoute;

  return (
    <div className='layoutOver'>
      <div className='layoutTopImage' style={{ backgroundImage: 'url(' + bg + ')' }}>
        <img src={logo} alt="logo" className='layoutTopImageLogo' />
        <div className='layoutTopEnd'>
          <div className='layoutTopEndOptions'>
            <div className='layoutTopEndOption' onClick={() => navigate('/notifications')} >
              <BellOutlined /> <Badge color='red' count={notificationsUnread} size='small' />
            </div>
          </div>
          <div style={{ backgroundColor: 'rgba(0,0,0,0.4)', padding: '10px', borderRadius: '10px' }}>
            <Dropdown menu={{ items: userMenuItems }} open={menuUserIsOpen}>
              <div onClick={() => setMenuUserIsOpen(old => !old)} className='layoutTopEndUserMenu'>
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
            <div className='divMenu' style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Menu
                mode="inline"
                theme='light'
                selectedKeys={[selectedItem]}
                items={items}
                onClick={onClick}
                style={{ overflow: 'auto' }}
              />
            </div>
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
              <span className='layoutLsPointsText'><strong>{formatValue(premiumPoints)}</strong> Premium Points</span>
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
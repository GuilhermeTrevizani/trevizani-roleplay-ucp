import { useTranslation } from 'react-i18next';
import useAuth from '../../hooks/useAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Form } from 'antd';
import logo from '../../assets/logo.png';
import { useEffect, useState } from 'react';
import './index.css';
import { useNotification } from '../../hooks/useNotification';

const LoginPage = () => {
  const { authenticate } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const notification = useNotification();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const code = searchParams.get('code');
    if (code)
      handleLogin(code);
  }, []);

  const handleLogin = async (discordToken: string) => {
    try {
      setLoading(true);
      const success = await authenticate(discordToken);
      if (success)
        navigate('/');
    } catch (ex) {
      notification.alert('error', ex as string);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    document.location.href = process.env.REACT_APP_DISCORD_URL!;
  };

  return <div className='bgLogin'>
    <Form layout='vertical'>
      <div className='loginLogoContainer'>
        <img src={logo} style={{ width: '20vw' }} className='loginLogo' />
      </div>
      <Form.Item style={{ textAlign: 'center' }}>
        <Button loading={loading} type='primary' onClick={handleSubmit}>{t('loginWithDiscord')}</Button>
      </Form.Item>
    </Form>
  </div>

};

export default LoginPage;
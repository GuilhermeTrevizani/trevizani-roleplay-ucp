import { AuthProvider } from './contexts/AuthContext';
import { BrowserRouter } from 'react-router-dom';
import RoutesApp from './routes';
import { ConfigProvider, theme } from 'antd';
import { NotificationContextProvider } from './contexts/NotificationContext';

function App() {
  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorPrimary: '#8C3086' },
        }}
      >
        <NotificationContextProvider>
          <AuthProvider>
            <BrowserRouter>
              <RoutesApp />
            </BrowserRouter>
          </AuthProvider>
        </NotificationContextProvider>
      </ConfigProvider>
    </div >
  );
}

export default App;

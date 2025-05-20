import { createContext, type ReactElement } from 'react';
import type LoginResponse from '../types/LoginResponse';
import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { UserStaff } from '../types/UserStaff';
import { useNotification } from '../hooks/useNotification';
import { StaffFlag } from '../types/StaffFlag';

export type AuthContextType = {
  user: LoginResponse | null;
  authenticate: (discordToken: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactElement }) => {
  const [user, setUser] = useState<LoginResponse | null>(null);
  const [loading, setIsLoading] = useState<boolean>(true);
  const api = useApi();
  const notification = useNotification();

  useEffect(() => {
    const token = localStorage.getItem('TOKEN');
    if (token)
      setUser({
        token: token ?? '',
        name: localStorage.getItem('NAME') ?? '',
        avatar: localStorage.getItem('AVATAR') ?? '',
        staff: (Number(localStorage.getItem('STAFF') ?? '1')) as UserStaff,
        discordUsername: localStorage.getItem('DISCORD_USERNAME') ?? '',
        staffFlags: JSON.parse(localStorage.getItem('STAFF_FLAGS') ?? '[]') as StaffFlag[],
      });
    setIsLoading(false);
  }, []);

  const authenticate = async (discordToken: string) => {
    try {
      const data = await api.login(discordToken);
      setUser(data);
      localStorage.clear();
      localStorage.setItem('TOKEN', data.token);
      localStorage.setItem('NAME', data.name);
      localStorage.setItem('AVATAR', data.avatar);
      localStorage.setItem('STAFF', data.staff.toString());
      localStorage.setItem('DISCORD_USERNAME', data.discordUsername);
      localStorage.setItem('STAFF_FLAGS', JSON.stringify(data.staffFlags));
    } catch (ex) {
      notification.alert('error', ex as string);
      return false;
    }
    return true;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authenticate, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
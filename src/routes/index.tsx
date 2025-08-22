import { Route, Routes, Navigate } from 'react-router-dom';
import LoginPage from './../pages/LoginPage';
import HomePage from './../pages/HomePage';
import useAuth from '../hooks/useAuth';
import { UserStaff } from '../types/UserStaff';
import PremiumPage from '../pages/PremiumPage';
import LogsPage from '../pages/LogsPage';
import ApplicationsPage from '../pages/ApplicationsPage';
import StaffPage from '../pages/StaffPage';
import BanishmentsPage from '../pages/BanishmentsPage';
import MyPunishmentsPage from '../pages/MyPunishmentsPage';
import ParametersPage from '../pages/ParametersPage';
import SalesPage from '../pages/SalesPage';
import { StaffFlag } from '../types/StaffFlag';
import FurnituresPage from '../pages/FurnituresPage';
import PropertiesPage from '../pages/PropertiesPage';
import AnimationsPage from '../pages/AnimationsPage';
import CrimesPage from '../pages/CrimesPage';
import PatrimonyPage from '../pages/PatrimonyPage';
import ChatlogPage from '../pages/ChatlogPage';
import PotentialFakesPage from '../pages/PotentialFakesPage';
import MyCharactersPage from '../pages/MyCharactersPage';
import CreateCharacterPage from '../pages/CreateCharacterPage';
import type { ReactElement } from 'react';
import CharacterPage from '../pages/CharacterPage';
import MyFactionsPage from '../pages/MyFactionsPage';
import FactionPage from '../pages/FactionPage';
import FactionsPage from '../pages/FactionsPage';
import ItemsPage from '../pages/ItemsPage';
import DrugsPage from '../pages/DrugsPage';
import NotificationsPage from '../pages/NotificationsPage';

const RequireAuth = ({ children, staff, staffFlag }: { children: ReactElement, staff?: UserStaff, staffFlag?: StaffFlag }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <div>...</div>;

  if (!user)
    return <Navigate to="/login" />

  if (staff !== undefined && user.staff < staff)
    return <Navigate to="/" />

  if (staffFlag !== undefined && !user.staffFlags.includes(staffFlag))
    return <Navigate to="/" />

  return children;
};

const RequireNonAuth = ({ children }: { children: ReactElement }) => {
  const { user, loading } = useAuth();

  if (loading)
    return <div>...</div>;

  if (user)
    return <Navigate to="/" />

  return children;
};

const RoutesApp = () => {
  return (
    <Routes>
      <Route path="*" element={<Navigate to="/" />} />
      <Route path='/login' element={<RequireNonAuth><LoginPage /></RequireNonAuth>}></Route>
      <Route path='/' element={<RequireAuth><HomePage /></RequireAuth>}></Route>
      <Route path='/premium' element={<RequireAuth><PremiumPage /></RequireAuth>}></Route>
      <Route path='/logs' element={<RequireAuth staff={UserStaff.LeadAdmin}><LogsPage /></RequireAuth>}></Route>
      <Route path='/applications' element={<RequireAuth staff={UserStaff.Tester}><ApplicationsPage /></RequireAuth>}></Route>
      <Route path='/staff' element={<RequireAuth staff={UserStaff.Tester}><StaffPage /></RequireAuth>}></Route>
      <Route path='/banishments' element={<RequireAuth staff={UserStaff.Tester}><BanishmentsPage /></RequireAuth>}></Route>
      <Route path='/my-punishments' element={<RequireAuth><MyPunishmentsPage /></RequireAuth>}></Route>
      <Route path='/parameters' element={<RequireAuth staff={UserStaff.Management}><ParametersPage /></RequireAuth>}></Route>
      <Route path='/sales' element={<RequireAuth staff={UserStaff.Management}><SalesPage /></RequireAuth>}></Route>
      <Route path='/furnitures' element={<RequireAuth staffFlag={StaffFlag.Furnitures}><FurnituresPage /></RequireAuth>}></Route>
      <Route path='/properties' element={<RequireAuth staffFlag={StaffFlag.Properties}><PropertiesPage /></RequireAuth>}></Route>
      <Route path='/animations' element={<RequireAuth staffFlag={StaffFlag.Animations}><AnimationsPage /></RequireAuth>}></Route>
      <Route path='/crimes' element={<RequireAuth staffFlag={StaffFlag.Factions}><CrimesPage /></RequireAuth>}></Route>
      <Route path='/patrimony' element={<RequireAuth staff={UserStaff.Management}><PatrimonyPage /></RequireAuth>}></Route>
      <Route path='/chatlog' element={<RequireAuth><ChatlogPage /></RequireAuth>}></Route>
      <Route path='/potential-fakes' element={<RequireAuth staff={UserStaff.GameAdmin}><PotentialFakesPage /></RequireAuth>}></Route>
      <Route path='/my-characters' element={<RequireAuth><MyCharactersPage /></RequireAuth>}></Route>
      <Route path='/create-character' element={<RequireAuth><CreateCharacterPage /></RequireAuth>}></Route>
      <Route path='/create-character/:id' element={<RequireAuth><CreateCharacterPage /></RequireAuth>}></Route>
      <Route path='/character/:id' element={<RequireAuth><CharacterPage /></RequireAuth>}></Route>
      <Route path='/my-factions' element={<RequireAuth><MyFactionsPage /></RequireAuth>}></Route>
      <Route path='/faction/:id' element={<RequireAuth><FactionPage /></RequireAuth>}></Route>
      <Route path='/factions' element={<RequireAuth staffFlag={StaffFlag.Factions}><FactionsPage /></RequireAuth>}></Route>
      <Route path='/items' element={<RequireAuth staffFlag={StaffFlag.Items}><ItemsPage /></RequireAuth>}></Route>
      <Route path='/drugs' element={<RequireAuth staffFlag={StaffFlag.Drugs}><DrugsPage /></RequireAuth>}></Route>
      <Route path='/notifications' element={<RequireAuth><NotificationsPage /></RequireAuth>}></Route>
    </Routes>
  );
};

export default RoutesApp;
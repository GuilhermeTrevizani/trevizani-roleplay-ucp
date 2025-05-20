import axios from 'axios';
import type LoginResponse from '../types/LoginResponse';
import type ApplicationListResponse from '../types/ApplicationListResponse';
import type ApplicationResponse from '../types/ApplicationResponse';
import type BanishmentResponse from '../types/BanishmentResponse';
import type StafferResponse from '../types/StafferResponse';
import type SelectOptionResponse from '../types/SelectOptionResponse';
import type LogRequest from '../types/LogRequest';
import type AdministrativePunishmentResponse from '../types/AdministrativePunishmentResponse';
import type { PremiumResponse } from '../types/PremiumResponse';
import type CreatePremiumRequest from '../types/CreatePremiumRequest';
import type ParametersRequest from '../types/ParametersRequest';
import type DashboardResponse from '../types/DashboardResponse';
import type PremiumPointPurchaseResponse from '../types/PremiumPointPurchaseResponse';
import type UserMyInfoResponse from '../types/UserMyInfoResponse';
import type FurnitureResponse from '../types/FurnitureResponse';
import type PropertyResponse from '../types/PropertyResponse';
import type AnimationResponse from '../types/AnimationResponse';
import type CrimeResponse from '../types/CrimeResponse';
import type CharacterPatrimonyResponse from '../types/CharacterPatrimonyResponse';
import type PotentialFakeResponse from '../types/PotentialFakeResponse';
import type { MyCharactersResponse } from '../types/MyCharactersResponse';
import type CreateCharacterRequest from '../types/CreateCharacterRequest';
import type CreateCharacterInfoResponse from '../types/CreateCharacterInfoResponse';
import { t } from 'i18next';

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('TOKEN');
    if (token)
      config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (!error?.response)
      return Promise.reject(t('noConnectionToTheServer'));

    if (error.response.status === 400)
      return Promise.reject(error.response.data.errors.join('<br/>'));

    if (error.response.status === 403) {
      localStorage.clear();
      document.location.reload();
      return Promise.reject(t('youDontHaveAuthorization'));
    }

    if (error.response.status === 401) {
      localStorage.clear();
      document.location.reload();
      return Promise.reject(t('youAreNotConnected'));
    }

    return Promise.reject(`${error.response.status} - ${error.response.statusText}`);
  },
);

export const useApi = () => ({
  login: async (discordToken: string) => {
    const response = await api.post<LoginResponse>(`/users/login/${discordToken}`);
    return response.data;
  },
  getPremium: async () => {
    const response = await api.get<PremiumResponse>('/premium');
    return response.data;
  },
  requestPremiumPackage: async (request: CreatePremiumRequest) => {
    const response = await api.post<string>(`/premium/request`, request);
    return response.data;
  },
  getApplications: async () => {
    const response = await api.get<ApplicationListResponse[]>('/applications');
    return response.data;
  },
  getCurrentApplication: async () => {
    const response = await api.get<ApplicationResponse>('/applications/current');
    return response.data;
  },
  acceptApplication: async () => {
    const response = await api.post(`/applications/accept`);
    return response.data;
  },
  denyApplication: async (reason: string) => {
    const response = await api.post(`/applications/deny`, {
      reason
    });
    return response.data;
  },
  getBanishments: async () => {
    const response = await api.get<BanishmentResponse[]>('/banishments');
    return response.data;
  },
  unban: async (id: string, total: boolean) => {
    const response = await api.post<string>(`/banishments/unban`, {
      id,
      total
    });
    return response.data;
  },
  getStaffers: async () => {
    const response = await api.get<StafferResponse[]>('/users/staffers');
    return response.data;
  },
  getLogTypes: async () => {
    const response = await api.get<SelectOptionResponse[]>('/logs/types');
    return response.data;
  },
  searchLogs: async (request: LogRequest) => {
    const response = await api.post(`/logs/search`, request);
    return response.data;
  },
  getAdministrativePunishments: async () => {
    const response = await api.get<AdministrativePunishmentResponse[]>('/administrative-punishments');
    return response.data;
  },
  cancelPremium: async () => {
    const response = await api.post<string>(`/premium/cancel`);
    return response.data;
  },
  getWhoCanLogin: async () => {
    const response = await api.get<SelectOptionResponse[]>('/parameters/who-can-login');
    return response.data;
  },
  getParameters: async () => {
    const response = await api.get<ParametersRequest>('/parameters');
    return response.data;
  },
  saveParameters: async (request: ParametersRequest) => {
    const response = await api.put(`/parameters`, request);
    return response.data;
  },
  getDashboard: async () => {
    const response = await api.get<DashboardResponse>('/users/dashboard');
    return response.data;
  },
  getSales: async () => {
    const response = await api.get<PremiumPointPurchaseResponse[]>('/premium/purchases');
    return response.data;
  },
  getMyInfo: async () => {
    const response = await api.get<UserMyInfoResponse>('/users/me');
    return response.data;
  },
  getFurnitures: async () => {
    const response = await api.get<FurnitureResponse[]>('/furnitures');
    return response.data;
  },
  saveFurniture: async (request: FurnitureResponse) => {
    const response = await api.post('/furnitures', request);
    return response.data;
  },
  removeFurniture: async (id: string) => {
    const response = await api.delete(`/furnitures/${id}`);
    return response.data;
  },
  getProperties: async () => {
    const response = await api.get<PropertyResponse[]>('/properties');
    return response.data;
  },
  getAnimations: async () => {
    const response = await api.get<AnimationResponse[]>('/animations');
    return response.data;
  },
  saveAnimation: async (request: AnimationResponse) => {
    const response = await api.post('/animations', request);
    return response.data;
  },
  removeAnimation: async (id: string) => {
    const response = await api.delete(`/animations/${id}`);
    return response.data;
  },
  getCrimes: async () => {
    const response = await api.get<CrimeResponse[]>('/crimes');
    return response.data;
  },
  saveCrime: async (request: CrimeResponse) => {
    const response = await api.post('/crimes', request);
    return response.data;
  },
  removeCrime: async (id: string) => {
    const response = await api.delete(`/crimes/${id}`);
    return response.data;
  },
  getPatrimony: async () => {
    const response = await api.get<CharacterPatrimonyResponse[]>('/characters/patrimony');
    return response.data;
  },
  getPotentialFakes: async () => {
    const response = await api.get<PotentialFakeResponse[]>('/users/potential-fakes');
    return response.data;
  },
  getMyCharacters: async () => {
    const response = await api.get<MyCharactersResponse>('/characters/mine');
    return response.data;
  },
  createCharacter: async (request: CreateCharacterRequest) => {
    const response = await api.post('/characters', request);
    return response.data;
  },
  deleteCharacter: async (id: string) => {
    const response = await api.delete(`/characters/${id}`);
    return response.data;
  },
  getCreateCharacterInfo: async (id: string) => {
    const response = await api.get<CreateCharacterInfoResponse>(`/characters/create-character-info/${id}`);
    return response.data;
  },
});
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
import type CharacterResponse from '../types/CharacterResponse';
import { t } from 'i18next';
import type CompanySafeMovementResponse from '../types/CompanySafeMovementResponse';
import type { CharacterPropertyResponse, CharacterVehicleResponse } from '../types/CharacterResponse';
import type MyFactionResponse from '../types/MyFactionResponse';
import type MyFactionDetailResponse from '../types/MyFactionDetailResponse';
import type SaveFactionRequest from '../types/SaveFactionRequest';
import type SaveFactionVehicleRequest from '../types/SaveFactionVehicleRequest';
import type SaveFactionRankRequest from '../types/SaveFactionRankRequest';
import type SaveFactionMemberRequest from '../types/SaveFactionMemberRequest';
import type OrderFactionRanksRequest from '../types/OrderFactionRanksRequest';
import type FactionResponse from '../types/FactionResponse';
import type FactionMemberResponse from '../types/FactionMemberResponse';
import type FactionRank from '../types/FactionRank';
import type FactionEquipmentResponse from '../types/FactionEquipmentResponse';
import type FactionFrequencyResponse from '../types/FactionFrequencyResponse';
import type FactionVehicle from '../types/FactionVehicle';
import type FactionVehicleRequest from '../types/FactionVehicleRequest';
import type FactionFrequencyRequest from '../types/FactionFrequencyRequest';
import type FactionEquipmentRequest from '../types/FactionEquipmentRequest';
import type FactionEquipmentItemResponse from '../types/FactionEquipmentItemResponse';
import type FactionEquipmentItemRequest from '../types/FactionEquipmentItemRequest';
import type DrugResponse from '../types/DrugResponse';
import type ItemTemplateResponse from '../types/ItemTemplateResponse';
import type ItemCategoryResponse from '../types/ItemCategoryResponse';
import type NotificationResponse from '../types/NotificationResponse';

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
  getMyCharacter: async (id: string) => {
    const response = await api.get<CharacterResponse>(`/characters/mine/${id}`);
    return response.data;
  },
  getCompanySafeMovements: async (id: string) => {
    const response = await api.get<CompanySafeMovementResponse[]>(`/companies/safe-movements/${id}`);
    return response.data;
  },
  changeVehicleAccess: async (request: CharacterVehicleResponse) => {
    const response = await api.post('/vehicles/change-access', request);
    return response.data;
  },
  changePropertyAccess: async (request: CharacterPropertyResponse) => {
    const response = await api.post('/properties/change-access', request);
    return response.data;
  },
  getMyFactions: async () => {
    const response = await api.get<MyFactionResponse[]>('/factions/mine');
    return response.data;
  },
  getMyFaction: async (id: string) => {
    const response = await api.get<MyFactionDetailResponse>(`/factions/mine/${id}`);
    return response.data;
  },
  saveFaction: async (request: SaveFactionRequest) => {
    const response = await api.post('/factions', request);
    return response.data;
  },
  saveFactionVehicle: async (request: SaveFactionVehicleRequest) => {
    const response = await api.post('/factions/save-vehicle', request);
    return response.data;
  },
  saveFactionRank: async (request: SaveFactionRankRequest) => {
    const response = await api.post('/factions/save-rank', request);
    return response.data;
  },
  removeFactionRank: async (id: string) => {
    const response = await api.delete(`/factions/remove-rank/${id}`);
    return response.data;
  },
  saveFactionMember: async (request: SaveFactionMemberRequest) => {
    const response = await api.post('/factions/save-member', request);
    return response.data;
  },
  removeFactionMember: async (id: string) => {
    const response = await api.delete(`/factions/remove-member/${id}`);
    return response.data;
  },
  orderFactionRanks: async (request: OrderFactionRanksRequest) => {
    const response = await api.post('/factions/order-ranks', request);
    return response.data;
  },
  getFactions: async () => {
    const response = await api.get<FactionResponse[]>('/factions');
    return response.data;
  },
  getFactionTypes: async () => {
    const response = await api.get<SelectOptionResponse[]>('/factions/types');
    return response.data;
  },
  staffSaveFaction: async (request: FactionResponse) => {
    const response = await api.post('/factions/staff-save', request);
    return response.data;
  },
  getFactionMembers: async (id: string) => {
    const response = await api.get<FactionMemberResponse[]>(`/factions/members/${id}`);
    return response.data;
  },
  getFactionRanks: async (id: string) => {
    const response = await api.get<FactionRank[]>(`/factions/ranks/${id}`);
    return response.data;
  },
  getFactionVehicles: async (id: string) => {
    const response = await api.get<FactionVehicle[]>(`/factions/vehicles/${id}`);
    return response.data;
  },
  getFactionFrequencies: async (id: string) => {
    const response = await api.get<FactionFrequencyResponse[]>(`/factions/frequencies/${id}`);
    return response.data;
  },
  getFactionEquipments: async (id: string) => {
    const response = await api.get<FactionEquipmentResponse[]>(`/factions/equipments/${id}`);
    return response.data;
  },
  staffSaveFactionRank: async (request: FactionRank) => {
    const response = await api.post('/factions/staff-save-rank', request);
    return response.data;
  },
  staffRemoveFactionVehicle: async (id: string) => {
    const response = await api.delete(`/factions/staff-remove-vehicle/${id}`);
    return response.data;
  },
  staffRemoveFactionEquipment: async (id: string) => {
    const response = await api.delete(`/factions/staff-remove-equipment/${id}`);
    return response.data;
  },
  staffRemoveFactionEquipmentItem: async (id: string) => {
    const response = await api.delete(`/factions/staff-remove-equipment-item/${id}`);
    return response.data;
  },
  staffRemoveFactionFrequency: async (id: string) => {
    const response = await api.delete(`/factions/staff-remove-frequency/${id}`);
    return response.data;
  },
  getVehicleModels: async () => {
    const response = await api.get<string[]>('/vehicles/models');
    return response.data;
  },
  staffSaveFactionVehicle: async (request: FactionVehicleRequest) => {
    const response = await api.post('/factions/staff-save-vehicle', request);
    return response.data;
  },
  staffSaveFactionFrequency: async (request: FactionFrequencyRequest) => {
    const response = await api.post('/factions/staff-save-frequency', request);
    return response.data;
  },
  staffSaveFactionEquipment: async (request: FactionEquipmentRequest) => {
    const response = await api.post('/factions/staff-save-equipment', request);
    return response.data;
  },
  staffSaveFactionEquipmentItem: async (request: FactionEquipmentItemRequest) => {
    const response = await api.post('/factions/staff-save-equipment-item', request);
    return response.data;
  },
  getFactionEquipmentItems: async (id: string) => {
    const response = await api.get<FactionEquipmentItemResponse[]>(`/factions/equipment-items/${id}`);
    return response.data;
  },
  getItemsTemplatesOptions: async () => {
    const response = await api.get<SelectOptionResponse[]>('/items-templates/options');
    return response.data;
  },
  getDrugs: async () => {
    const response = await api.get<DrugResponse[]>('/drugs');
    return response.data;
  },
  saveDrug: async (request: DrugResponse) => {
    const response = await api.post('/drugs', request);
    return response.data;
  },
  getItemsTemplates: async () => {
    const response = await api.get<ItemTemplateResponse[]>('/items-templates');
    return response.data;
  },
  saveItemTemplate: async (request: ItemTemplateResponse) => {
    const response = await api.post('/items-templates', request);
    return response.data;
  },
  getItemsCategories: async () => {
    const response = await api.get<ItemCategoryResponse[]>('/items-templates/categories');
    return response.data;
  },
  getMyNotifications: async () => {
    const response = await api.get<NotificationResponse[]>('/notifications/mine');
    return response.data;
  },
  markNotificationAsRead: async (id: string) => {
    const response = await api.post(`/notifications/mark-as-read/${id}`);
    return response.data;
  },
});
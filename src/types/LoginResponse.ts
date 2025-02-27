import { StaffFlag } from './StaffFlag';
import { UserStaff } from './UserStaff';

export default interface LoginResponse {
  name: string;
  token: string;
  avatar: string;
  staff: UserStaff;
  discordUsername: string;
  staffFlags: StaffFlag[];
}
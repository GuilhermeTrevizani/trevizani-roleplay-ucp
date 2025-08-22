import { StaffFlag } from './StaffFlag';
import { UserStaff } from './UserStaff';

export default interface UserMyInfoResponse {
  premiumPoints: number;
  staff: UserStaff;
  staffFlags: StaffFlag[];
  notificationsUnread: number;
};
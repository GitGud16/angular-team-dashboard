import { TeamMember } from './team-member.interface';
import { FilterState } from './filter-state.interface';

export interface DashboardState {
  teamMembers: TeamMember[];
  filteredMembers: TeamMember[];
  filters: FilterState;
  loading: boolean;
  error: string | null;
}

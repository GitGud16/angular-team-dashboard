export interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  performance_indicator: number;
  start_date: string;
  end_date: string;
  team_lead: string;
  vacation_taken: number;
}

export interface TeamMemberUI {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  performanceScore: number;
  startDate: Date;
  endDate: Date;
  teamLead: string;
  vacationTaken: number;
}

export type TeamMembersResponse = TeamMember[];

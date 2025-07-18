import { DataTransformUtil } from './data-transform.util';
import { TeamMember } from '../models/team-member.interface';

describe('DataTransformUtil', () => {
  const mockTeamMember: TeamMember = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Developer',
    status: 'active',
    performance_indicator: 4.5,
    start_date: '2023-01-15',
    end_date: '2024-12-31',
    team_lead: 'Jane Smith',
    vacation_taken: 10
  };

  it('should transform TeamMember to TeamMemberUI', () => {
    const result = DataTransformUtil.transformToUI(mockTeamMember);
    
    expect(result.id).toBe(1);
    expect(result.name).toBe('John Doe');
    expect(result.performanceScore).toBe(4.5);
    expect(result.startDate).toEqual(new Date('2023-01-15'));
    expect(result.endDate).toEqual(new Date('2024-12-31'));
    expect(result.teamLead).toBe('Jane Smith');
    expect(result.vacationTaken).toBe(10);
  });

  it('should transform array of TeamMembers to TeamMemberUI array', () => {
    const mockArray = [mockTeamMember, { ...mockTeamMember, id: 2, name: 'Jane Smith' }];
    const result = DataTransformUtil.transformArrayToUI(mockArray);
    
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('John Doe');
    expect(result[1].name).toBe('Jane Smith');
    expect(result[0].startDate).toBeInstanceOf(Date);
  });
});

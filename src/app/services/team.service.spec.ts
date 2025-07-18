/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TeamService } from './team.service';
import { ApiService } from './api.service';
import { TeamMember } from '../models/team-member.interface';

describe('TeamService', () => {
  let service: TeamService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockTeamMembers: TeamMember[] = [
    {
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
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'inactive',
      performance_indicator: 4.8,
      start_date: '2022-03-01',
      end_date: '2024-12-31',
      team_lead: 'Mike Johnson',
      vacation_taken: 15
    }
  ];

  beforeEach(() => {
    const spy = jasmine.createSpyObj('ApiService', ['getTeamMembers']);
    spy.getTeamMembers.and.returnValue(of([]));

    TestBed.configureTestingModule({
      providers: [
        TeamService,
        { provide: ApiService, useValue: spy }
      ]
    });

    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    service = TestBed.inject(TeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load team members on initialization', () => {
    apiServiceSpy.getTeamMembers.and.returnValue(of(mockTeamMembers));
    
    service.loadTeamMembers();
    
    service.teamMembers$.subscribe(members => {
      expect(members).toEqual(mockTeamMembers);
    });
    
    expect(apiServiceSpy.getTeamMembers).toHaveBeenCalled();
  });

  it('should filter members by role', () => {
    apiServiceSpy.getTeamMembers.and.returnValue(of(mockTeamMembers));
    service.loadTeamMembers();

    service.filterByRole('Developer');

    service.filteredMembers$.subscribe(filtered => {
      expect(filtered.length).toBe(1);
      expect(filtered[0].role).toBe('Developer');
    });
  });

  it('should filter members by status', () => {
    apiServiceSpy.getTeamMembers.and.returnValue(of(mockTeamMembers));
    service.loadTeamMembers();

    service.filterByStatus('active');

    service.filteredMembers$.subscribe(filtered => {
      expect(filtered.length).toBe(1);
      expect(filtered[0].status).toBe('active');
    });
  });

  it('should clear all filters', () => {
    apiServiceSpy.getTeamMembers.and.returnValue(of(mockTeamMembers));
    service.loadTeamMembers();

    service.filterByRole('Developer');
    service.clearFilters();

    service.filters$.subscribe(filters => {
      expect(filters.role).toBeNull();
      expect(filters.status).toBeNull();
    });
  });

  it('should handle API errors gracefully', () => {
    const mockError = { status: 500, message: 'Server Error', url: '/api/members' };
    apiServiceSpy.getTeamMembers.and.returnValue(throwError(() => mockError));

    service.loadTeamMembers();

    service.error$.subscribe(error => {
      expect(error).toContain('Unable to load team data');
      expect(error).toContain('Server is temporarily unavailable');
    });
  });

  it('should get available roles', () => {
    apiServiceSpy.getTeamMembers.and.returnValue(of(mockTeamMembers));
    service.loadTeamMembers();

    service.getAvailableRoles().subscribe(roles => {
      expect(roles).toContain('Developer');
      expect(roles).toContain('Manager');
      expect(roles.length).toBe(2);
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { TeamService } from '../services/team.service';
import { DashboardState } from '../models/dashboard-state.interface';
import { TeamMember } from '../models/team-member.interface';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-team-filter',
  template: '<div>Mock Filter</div>'
})
class MockTeamFilterComponent {}

@Component({
  selector: 'app-team-member-card',
  template: '<div>Mock Card</div>'
})
class MockTeamMemberCardComponent {
  @Input() member: any;
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let teamServiceSpy: jasmine.SpyObj<TeamService>;

  const mockTeamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Developer',
      status: 'active',
      performance_indicator: 85,
      start_date: '2023-01-15',
      end_date: '2024-12-31',
      team_lead: 'Jane Smith',
      vacation_taken: 65
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Manager',
      status: 'inactive',
      performance_indicator: 92,
      start_date: '2022-03-01',
      end_date: '2024-12-31',
      team_lead: 'Mike Johnson',
      vacation_taken: 42
    }
  ];

  const mockDashboardState: DashboardState = {
    teamMembers: mockTeamMembers,
    filteredMembers: mockTeamMembers,
    filters: { role: null, status: null },
    loading: false,
    error: null
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TeamService', [
      'retryLoad',
      'getAvailableRoles', 
      'getAvailableStatuses',
      'filterByRole',
      'filterByStatus',
      'clearFilters'
    ], {
      dashboardState$: of(mockDashboardState),
      filters$: of({ role: null, status: null }),
      filteredMembers$: of(mockTeamMembers)
    });

    spy.getAvailableRoles.and.returnValue(of(['Developer', 'Manager']));
    spy.getAvailableStatuses.and.returnValue(of(['active', 'inactive']));

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      declarations: [MockTeamFilterComponent, MockTeamMemberCardComponent],
      providers: [
        { provide: TeamService, useValue: spy }
      ]
    })
    .overrideComponent(DashboardComponent, {
      remove: { imports: [] },
      add: { imports: [] }
    })
    .compileComponents();

    teamServiceSpy = TestBed.inject(TeamService) as jasmine.SpyObj<TeamService>;
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate active members correctly', () => {
    const activeCount = component.getActiveMembers(mockTeamMembers);
    expect(activeCount).toBe(1);
  });

  it('should handle retry load', () => {
    component.retryLoad();
    expect(teamServiceSpy.retryLoad).toHaveBeenCalled();
  });

  it('should return correct status classes', () => {
    expect(component.getStatusClass('active')).toContain('bg-green-100');
    expect(component.getStatusClass('inactive')).toContain('bg-red-100');
  });

  it('should track members by ID', () => {
    const member = mockTeamMembers[0];
    const trackResult = component.trackByMemberId(0, member);
    expect(trackResult).toBe(member.id);
  });
});
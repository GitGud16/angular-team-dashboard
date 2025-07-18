/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { TeamFilterComponent } from './team-filter.component';
import { TeamService } from '../../services/team.service';
import { FilterState } from '../../models/filter-state.interface';

describe('TeamFilterComponent', () => {
  let component: TeamFilterComponent;
  let fixture: ComponentFixture<TeamFilterComponent>;
  let teamServiceSpy: jasmine.SpyObj<TeamService>;

  const mockFilterState: FilterState = { role: null, status: null };
  const mockRoles = ['Developer', 'Designer', 'Manager'];
  const mockStatuses = ['active', 'inactive', 'on-leave'];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TeamService', [
      'filterByRole',
      'filterByStatus', 
      'clearFilters',
      'getAvailableRoles',
      'getAvailableStatuses'
    ], {
      filters$: of(mockFilterState),
      filteredMembers$: of([])
    });

    spy.getAvailableRoles.and.returnValue(of(mockRoles));
    spy.getAvailableStatuses.and.returnValue(of(mockStatuses));

    await TestBed.configureTestingModule({
      imports: [TeamFilterComponent],
      providers: [
        { provide: TeamService, useValue: spy }
      ]
    }).compileComponents();

    teamServiceSpy = TestBed.inject(TeamService) as jasmine.SpyObj<TeamService>;
    fixture = TestBed.createComponent(TeamFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load available roles and statuses on init', () => {
    expect(component.availableRoles).toEqual(mockRoles);
    expect(component.availableStatuses).toEqual(mockStatuses);
  });

  it('should emit role filter change', () => {
    const mockEvent = {
      target: { value: 'Developer' }
    } as any;

    component.onRoleChange(mockEvent);

    expect(teamServiceSpy.filterByRole).toHaveBeenCalledWith('Developer');
  });

  it('should emit status filter change', () => {
    const mockEvent = {
      target: { value: 'active' }
    } as any;

    component.onStatusChange(mockEvent);

    expect(teamServiceSpy.filterByStatus).toHaveBeenCalledWith('active');
  });

  it('should clear all filters', () => {
    component.clearFilters();

    expect(teamServiceSpy.clearFilters).toHaveBeenCalled();
    expect(component.filterResultMessage).toBe('All filters cleared. Showing all team members.');
  });

  it('should clear individual role filter', () => {
    component.clearRoleFilter();

    expect(teamServiceSpy.filterByRole).toHaveBeenCalledWith(null);
  });

  it('should clear individual status filter', () => {
    component.clearStatusFilter();

    expect(teamServiceSpy.filterByStatus).toHaveBeenCalledWith(null);
  });

  it('should detect active filters', () => {
    component.currentFilters = { role: 'Developer', status: null };
    expect(component.hasActiveFilters).toBe(true);

    component.currentFilters = { role: null, status: 'active' };
    expect(component.hasActiveFilters).toBe(true);

    component.currentFilters = { role: null, status: null };
    expect(component.hasActiveFilters).toBe(false);
  });

  it('should announce filter changes for accessibility', () => {
    component['filteredCount'] = 5;
    
    const mockEvent = {
      target: { value: 'Developer' }
    } as any;

    component.onRoleChange(mockEvent);

    expect(component.filterResultMessage).toContain('Filtered by role: Developer');
    expect(component.filterResultMessage).toContain('Showing 5 results');
  });
});
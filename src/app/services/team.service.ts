import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { ApiService } from './api.service';
import { TeamMember } from '../models/team-member.interface';
import { DashboardState } from '../models/dashboard-state.interface';
import { FilterState } from '../models/filter-state.interface';

@Injectable({
  providedIn: 'root',
})
export class TeamService {
  private apiService = inject(ApiService);

  private teamMembersSubject = new BehaviorSubject<TeamMember[]>([]);
  private filtersSubject = new BehaviorSubject<FilterState>({
    role: null,
    status: null,
  });
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private errorSubject = new BehaviorSubject<string | null>(null);

  public teamMembers$ = this.teamMembersSubject.asObservable();
  public filters$ = this.filtersSubject.asObservable();
  public loading$ = this.loadingSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  public filteredMembers$ = combineLatest([
    this.teamMembers$,
    this.filters$,
  ]).pipe(map(([members, filters]) => this.applyFilters(members, filters)));

  public dashboardState$: Observable<DashboardState> = combineLatest([
    this.teamMembers$,
    this.filteredMembers$,
    this.filters$,
    this.loading$,
    this.error$,
  ]).pipe(
    map(([teamMembers, filteredMembers, filters, loading, error]) => ({
      teamMembers,
      filteredMembers,
      filters,
      loading,
      error,
    }))
  );

  constructor() {
    this.loadTeamMembers();
  }

  loadTeamMembers(): void {
    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.apiService
      .getTeamMembers()
      .pipe(
        catchError((error) => {
          const userFriendlyMessage = this.handleApiError(error);
          this.errorSubject.next(userFriendlyMessage);
          return [];
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((members) => {
        this.teamMembersSubject.next(members);
      });
  }

  filterByRole(role: string | null): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({ ...currentFilters, role });
  }

  filterByStatus(status: string | null): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next({ ...currentFilters, status });
  }

  clearFilters(): void {
    this.filtersSubject.next({ role: null, status: null });
  }

  getAvailableRoles(): Observable<string[]> {
    return this.teamMembers$.pipe(
      map((members) => [...new Set(members.map((member) => member.role))])
    );
  }

  getAvailableStatuses(): Observable<string[]> {
    return this.teamMembers$.pipe(
      map((members) => [...new Set(members.map((member) => member.status))])
    );
  }

  private applyFilters(
    members: TeamMember[],
    filters: FilterState
  ): TeamMember[] {
    return members.filter((member) => {
      const roleMatch = !filters.role || member.role === filters.role;
      const statusMatch = !filters.status || member.status === filters.status;
      return roleMatch && statusMatch;
    });
  }

  retryLoad(): void {
    this.loadTeamMembers();
  }

  private handleApiError(error: any): string {
    let userMessage = 'Unable to load team data. ';
    
    if (error.status === 0) {
      userMessage += 'Please check your internet connection.';
    } else if (error.status === 404) {
      userMessage += 'Team data not found.';
    } else if (error.status >= 500) {
      userMessage += 'Server is temporarily unavailable.';
    } else if (error.status === 403) {
      userMessage += 'Access denied to team data.';
    } else {
      userMessage += 'Please try again later.';
    }
    
    console.error('TeamService API Error:', {
      status: error.status,
      message: error.message,
      url: error.url,
      timestamp: new Date().toISOString()
    });
    
    return userMessage;
  }
}

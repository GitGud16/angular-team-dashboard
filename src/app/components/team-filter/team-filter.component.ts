import { Component, OnInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TeamService } from '../../services/team.service';
import { FilterState } from '../../models/filter-state.interface';

@Component({
  selector: 'app-team-filter',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team-filter.component.html',
  styleUrls: ['./team-filter.component.css']
})
export class TeamFilterComponent implements OnInit {
  private teamService = inject(TeamService);

  availableRoles$: Observable<string[]> = this.teamService.getAvailableRoles();
  availableStatuses$: Observable<string[]> = this.teamService.getAvailableStatuses();
  currentFilters$: Observable<FilterState> = this.teamService.filters$;

  availableRoles: string[] = [];
  availableStatuses: string[] = [];
  currentFilters: FilterState = { role: null, status: null };
  filterResultMessage = '';
  private filteredCount = 0;

  ngOnInit(): void {
    this.availableRoles$.subscribe(roles => this.availableRoles = roles);
    this.availableStatuses$.subscribe(statuses => this.availableStatuses = statuses);
    this.currentFilters$.subscribe(filters => this.currentFilters = filters);
    
    this.teamService.filteredMembers$.subscribe(members => {
      this.filteredCount = members.length;
      this.updateFilterResultMessage();
    });
  }

  onRoleChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const role = target.value || null;
    this.teamService.filterByRole(role);
    this.announceFilterChange('role', role);
  }

  onStatusChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const status = target.value || null;
    this.teamService.filterByStatus(status);
    this.announceFilterChange('status', status);
  }

  clearFilters(): void {
    this.teamService.clearFilters();
    this.filterResultMessage = 'All filters cleared. Showing all team members.';
  }

  clearRoleFilter(): void {
    this.teamService.filterByRole(null);
  }

  clearStatusFilter(): void {
    this.teamService.filterByStatus(null);
  }

  get hasActiveFilters(): boolean {
    return !!(this.currentFilters.role || this.currentFilters.status);
  }

  private announceFilterChange(filterType: string, value: string | null): void {
    if (value) {
      this.filterResultMessage = `Filtered by ${filterType}: ${value}. Showing ${this.filteredCount} results.`;
    } else {
      this.filterResultMessage = `${filterType} filter cleared. Showing ${this.filteredCount} results.`;
    }
  }

  private updateFilterResultMessage(): void {
    if (this.hasActiveFilters) {
      this.filterResultMessage = `Showing ${this.filteredCount} filtered results.`;
    }
  }
}

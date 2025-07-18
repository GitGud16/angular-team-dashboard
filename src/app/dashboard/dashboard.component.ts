import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TeamService } from '../services/team.service';
import { DashboardState } from '../models/dashboard-state.interface';
import { TeamMember } from '../models/team-member.interface';
import { TeamListComponent } from '../components/team-list/team-list.component';
import { TeamMemberAction } from '../components/team-member-card/team-member-card.component';
import { TeamFilterComponent } from '../components/team-filter/team-filter.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TeamListComponent, TeamFilterComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  private teamService = inject(TeamService);

  dashboardState$: Observable<DashboardState> =
    this.teamService.dashboardState$;

  ngOnInit(): void {}

  retryLoad(): void {
    this.teamService.retryLoad();
  }

  getActiveMembers(members: TeamMember[]): number {
    return members.filter((member) => member.status === 'active').length;
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  trackByMemberId(index: number, member: TeamMember): number {
    return member.id;
  }

  onMemberAction(action: TeamMemberAction): void {
    console.log('Member action triggered:', action);
    
    switch (action.action) {
      case 'view':
        this.handleViewDetails(action.member);
        break;
      case 'edit':
        this.handleEdit(action.member);
        break;
      case 'contact':
        this.handleContact(action.member);
        break;
      case 'assignTask':
        this.handleAssignTask(action.member);
        break;
      case 'viewPerformance':
        this.handleViewPerformance(action.member);
        break;
      case 'manageVacation':
        this.handleManageVacation(action.member);
        break;
      case 'archive':
        this.handleArchive(action.member);
        break;
      default:
        console.warn('Unknown action:', action.action);
    }
  }

  private handleViewDetails(member: TeamMember): void {
    // TODO: Implement view details functionality
    alert(`Viewing details for ${member.name}`);
  }

  private handleEdit(member: TeamMember): void {
    // TODO: Implement edit functionality
    alert(`Editing ${member.name}`);
  }

  private handleContact(member: TeamMember): void {
    // Open email client
    window.location.href = `mailto:${member.email}?subject=Hello ${member.name}`;
  }

  private handleAssignTask(member: TeamMember): void {
    // TODO: Implement task assignment functionality
    alert(`Assigning task to ${member.name}`);
  }

  private handleViewPerformance(member: TeamMember): void {
    // TODO: Implement performance view functionality
    alert(`Viewing performance for ${member.name} (${member.performance_indicator}%)`);
  }

  private handleManageVacation(member: TeamMember): void {
    // TODO: Implement vacation management functionality
    alert(`Managing vacation for ${member.name} (${member.vacation_taken}% used)`);
  }

  private handleArchive(member: TeamMember): void {
    // TODO: Implement archive functionality with confirmation
    if (confirm(`Are you sure you want to archive ${member.name}?`)) {
      alert(`Archiving ${member.name}`);
    }
  }
}

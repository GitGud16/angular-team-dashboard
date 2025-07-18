import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TeamService } from '../services/team.service';
import { DashboardState } from '../models/dashboard-state.interface';
import { TeamMember } from '../models/team-member.interface';
import { TeamMemberCardComponent } from '../components/team-member-card/team-member-card.component';
import { TeamFilterComponent } from '../components/team-filter/team-filter.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TeamMemberCardComponent, TeamFilterComponent],
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
}

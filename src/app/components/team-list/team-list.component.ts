import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../models/team-member.interface';
import { TeamMemberCardComponent, TeamMemberAction } from '../team-member-card/team-member-card.component';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, TeamMemberCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="team-list" role="main" aria-label="Team members list">
      <!-- Loading State -->
      <div *ngIf="loading" class="flex justify-center items-center py-12" role="status" aria-live="polite">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
        <span class="ml-3 text-gray-600">Loading team members...</span>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && teamMembers.length === 0" 
           class="text-center py-12" 
           role="status" 
           aria-live="polite">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No team members found</h3>
        <p class="text-gray-500">Try adjusting your filters or check back later.</p>
      </div>

      <!-- Team Members Grid -->
      <div *ngIf="!loading && teamMembers.length > 0" 
           class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
           role="grid"
           [attr.aria-label]="'Team members grid with ' + teamMembers.length + ' members'">
        
        <div *ngFor="let member of teamMembers; trackBy: trackByMemberId" 
             class="team-member-item"
             role="gridcell"
             [attr.aria-label]="'Team member card for ' + member.name">
          <app-team-member-card [member]="member" (memberAction)="onMemberAction($event)"></app-team-member-card>
        </div>
      </div>

      <!-- Results Summary -->
      <div *ngIf="!loading && teamMembers.length > 0" 
           class="mt-8 text-center text-sm text-gray-500"
           role="status"
           aria-live="polite">
        Showing {{ teamMembers.length }} team member{{ teamMembers.length === 1 ? '' : 's' }}
      </div>
    </section>
  `,
  styles: [`
    .team-list {
      min-height: 400px;
    }
    
    .team-member-item {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    /* Ensure consistent card heights */
    .team-member-item app-team-member-card {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    /* Responsive grid adjustments */
    @media (max-width: 1023px) {
      .grid {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      }
    }
    
    @media (max-width: 767px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TeamListComponent {
  @Input({ required: true }) teamMembers: TeamMember[] = [];
  @Input() loading = false;
  @Output() memberAction = new EventEmitter<TeamMemberAction>();

  trackByMemberId(index: number, member: TeamMember): number {
    return member.id;
  }

  onMemberAction(action: TeamMemberAction): void {
    this.memberAction.emit(action);
  }
}

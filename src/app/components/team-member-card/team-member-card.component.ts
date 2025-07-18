import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamMember } from '../../models/team-member.interface';

export interface TeamMemberAction {
  action: 'view' | 'edit' | 'contact' | 'assignTask' | 'viewPerformance' | 'manageVacation' | 'archive';
  member: TeamMember;
}

@Component({
  selector: 'app-team-member-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './team-member-card.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100%;
      }

      article {
        height: 100%;
      }
    `,
  ],
})
export class TeamMemberCardComponent {
  @Input({ required: true }) member!: TeamMember;
  @Output() memberAction = new EventEmitter<TeamMemberAction>();

  showDropdown = false;

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'on-leave':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  // Action button handlers
  onViewDetails(): void {
    this.memberAction.emit({ action: 'view', member: this.member });
  }

  onEdit(): void {
    this.memberAction.emit({ action: 'edit', member: this.member });
  }

  onContact(): void {
    this.memberAction.emit({ action: 'contact', member: this.member });
  }

  onAssignTask(): void {
    this.memberAction.emit({ action: 'assignTask', member: this.member });
    this.showDropdown = false;
  }

  onViewPerformance(): void {
    this.memberAction.emit({ action: 'viewPerformance', member: this.member });
    this.showDropdown = false;
  }

  onManageVacation(): void {
    this.memberAction.emit({ action: 'manageVacation', member: this.member });
    this.showDropdown = false;
  }

  onArchive(): void {
    this.memberAction.emit({ action: 'archive', member: this.member });
    this.showDropdown = false;
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.showDropdown = false;
    }
  }
}

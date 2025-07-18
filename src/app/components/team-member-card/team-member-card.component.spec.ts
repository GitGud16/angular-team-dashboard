/// <reference types="jasmine" />
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamMemberCardComponent } from './team-member-card.component';
import { TeamMember } from '../../models/team-member.interface';

describe('TeamMemberCardComponent', () => {
  let component: TeamMemberCardComponent;
  let fixture: ComponentFixture<TeamMemberCardComponent>;

  const mockTeamMember: TeamMember = {
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
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMemberCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamMemberCardComponent);
    component = fixture.componentInstance;
    component.member = mockTeamMember;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display team member information', () => {
    const compiled = fixture.nativeElement;
    
    expect(compiled.textContent).toContain('John Doe');
    expect(compiled.textContent).toContain('john@example.com');
    expect(compiled.textContent).toContain('Developer');
    expect(compiled.textContent).toContain('Jane Smith');
  });

  it('should generate correct initials', () => {
    expect(component.getInitials('John Doe')).toBe('JD');
    expect(component.getInitials('Mary Jane Watson')).toBe('MJ');
    expect(component.getInitials('SingleName')).toBe('S');
  });

  it('should return correct status classes', () => {
    expect(component.getStatusClass('active')).toContain('bg-green-100');
    expect(component.getStatusClass('inactive')).toContain('bg-red-100');
    expect(component.getStatusClass('on-leave')).toContain('bg-yellow-100');
    expect(component.getStatusClass('unknown')).toContain('bg-gray-100');
  });

  it('should format dates correctly', () => {
    expect(component.formatDate('2023-01-15')).toBe('Jan 15, 2023');
    expect(component.formatDate('')).toBe('N/A');
    expect(component.formatDate('invalid-date')).toBe('Invalid Date');
  });

  it('should display performance indicator correctly', () => {
    const compiled = fixture.nativeElement;
    const performanceText = compiled.querySelector('[aria-label*="Performance score"]');
    
    expect(performanceText).toBeTruthy();
    expect(compiled.textContent).toContain('85%');
  });

  it('should display vacation usage correctly', () => {
    const compiled = fixture.nativeElement;
    const vacationText = compiled.querySelector('[aria-label*="Vacation usage"]');
    
    expect(vacationText).toBeTruthy();
    expect(compiled.textContent).toContain('65%');
  });

  it('should have proper accessibility attributes', () => {
    const compiled = fixture.nativeElement;
    const article = compiled.querySelector('article');
    
    expect(article.getAttribute('aria-label')).toContain('Team member: John Doe');
  });

  it('should display employee ID with proper formatting', () => {
    const compiled = fixture.nativeElement;
    
    expect(compiled.textContent).toContain('#0001');
  });

  it('should have clickable email link', () => {
    const compiled = fixture.nativeElement;
    const emailLink = compiled.querySelector('a[href^="mailto:"]');
    
    expect(emailLink).toBeTruthy();
    expect(emailLink.getAttribute('href')).toBe('mailto:john@example.com');
  });
});
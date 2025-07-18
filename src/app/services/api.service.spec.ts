/// <reference types="jasmine" />
import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { TeamMember } from '../models/team-member.interface';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

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
      vacation_taken: 10,
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Team Lead',
      status: 'active',
      performance_indicator: 4.8,
      start_date: '2022-03-01',
      end_date: '2024-12-31',
      team_lead: 'Mike Johnson',
      vacation_taken: 15,
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch team members successfully', () => {
    service.getTeamMembers().subscribe((members) => {
      expect(members).toEqual(mockTeamMembers);
      expect(members.length).toBe(2);
      expect(members[0].name).toBe('John Doe');
    });

    const req = httpMock.expectOne(
      'https://accurate-spoonbill-539.convex.site/members'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockTeamMembers);
  });

  it('should handle HTTP error gracefully', () => {
    const errorMessage = 'Server error';

    service.getTeamMembers().subscribe({
      next: () => fail('Expected an error, not team members'),
      error: (error) => {
        expect(error.message).toContain('Error Code: 500');
      },
    });

    const req1 = httpMock.expectOne(
      'https://accurate-spoonbill-539.convex.site/members'
    );
    req1.flush(errorMessage, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    const req2 = httpMock.expectOne(
      'https://accurate-spoonbill-539.convex.site/members'
    );
    req2.flush(errorMessage, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    const req3 = httpMock.expectOne(
      'https://accurate-spoonbill-539.convex.site/members'
    );
    req3.flush(errorMessage, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should retry failed requests', () => {
    service.getTeamMembers().subscribe({
      next: (members) => {
        expect(members).toEqual(mockTeamMembers);
      },
      error: () => fail('Should not error after successful retry'),
    });

    const req1 = httpMock.expectOne(
      'https://accurate-spoonbill-539.convex.site/members'
    );
    req1.flush('Network error', { status: 0, statusText: 'Unknown Error' });

    const req2 = httpMock.expectOne(
      'https://accurate-spoonbill-539.convex.site/members'
    );
    req2.flush('Network error', { status: 0, statusText: 'Unknown Error' });

    const req3 = httpMock.expectOne(
      'https://accurate-spoonbill-539.convex.site/members'
    );
    req3.flush(mockTeamMembers);
  });
});

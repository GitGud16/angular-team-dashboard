import { TeamMember, TeamMemberUI } from '../models/team-member.interface'

export class DataTransformUtil{
    static transformToUI(member: TeamMember):TeamMemberUI{
        return{
            id:member.id,
            name:member.name,
            email:member.email,
            role:member.role,
            status:member.status,
            performanceScore:member.performance_indicator,
            startDate: new Date(member.start_date),
            endDate: new Date(member.end_date),
            teamLead: member.team_lead,
            vacationTaken: member.vacation_taken
        }
    }

    static transformArrayToUI(members:TeamMember[]):TeamMemberUI[]{
        return members.map(member=>this.transformToUI(member))
    }
}
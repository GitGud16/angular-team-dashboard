describe('Team Dashboard E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/')
    
    cy.contains('Team Dashboard').should('be.visible')
  })

  it('should load the dashboard and display team members', () => {
    cy.contains('Team Dashboard').should('be.visible')
    cy.contains('Manage and monitor your team members').should('be.visible')
    
    cy.get('app-team-member-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    
    cy.contains('Total Members').should('be.visible')
    cy.contains('Active Members').should('be.visible')
    cy.get('.grid').contains(/Filtered Results|Showing All/).should('be.visible')
  })

  it('should display team member cards with correct information', () => {
    cy.get('app-team-member-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    
    cy.get('app-team-member-card').first().within(() => {
      cy.get('h3').should('exist') 
      cy.get('[href^="mailto:"]').should('exist') 
      cy.contains('Employee ID').should('exist')
      cy.contains('Status').should('exist')
      cy.contains('Performance Score').should('exist')
      cy.contains('Vacation Usage').should('exist')
    })
  })

  it('should filter team members by role', () => {
    cy.get('app-team-member-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    
    cy.get('app-team-member-card').then($cards => {
      const initialCount = $cards.length
      
      cy.get('#role-filter').find('option').then($options => {
        if ($options.length > 1) {
          const roleValue = $options.eq(1).val() as string
          const roleText = $options.eq(1).text()
          
          cy.get('#role-filter').select(roleValue)
          
          cy.wait(500)
          
          cy.get('app-team-member-card').should('have.length.lessThan', initialCount)
          
          cy.contains(`Role: ${roleText}`).should('be.visible')
          
          cy.get('[class*="ring-blue"]').should('exist')
        }
      })
    })
  })

  it('should filter team members by status', () => {
    cy.get('app-team-member-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    
    cy.get('app-team-member-card').then($cards => {
      const initialCount = $cards.length
      
      cy.get('#status-filter').find('option').then($options => {
        if ($options.length > 1) {
          const statusValue = $options.eq(1).val() as string
          const statusText = $options.eq(1).text()
          
          cy.get('#status-filter').select(statusValue)
          
          cy.wait(500)
          
          cy.get('app-team-member-card').should('have.length.lessThan', initialCount)
          
          cy.contains(`Status: ${statusText}`).should('be.visible')
        }
      })
    })
  })

  it('should clear filters and show all team members', () => {
    cy.get('app-team-member-card', { timeout: 15000 }).should('have.length.greaterThan', 0)
    
    cy.get('app-team-member-card').then($cards => {
      const initialCount = $cards.length
      
      cy.get('#role-filter').find('option').then($options => {
        if ($options.length > 1) {
          cy.get('#role-filter').select($options.eq(1).val() as string)
          cy.wait(500)
          
          cy.get('app-team-member-card').should('have.length.lessThan', initialCount)
          
          cy.contains('Clear Filters').click()
          cy.wait(500)
          
          cy.get('app-team-member-card').should('have.length', initialCount)
          
          cy.get('[class*="Active Filters"]').should('not.exist')
        }
      })
    })
  })

  it('should handle responsive design', () => {
    cy.viewport(375, 667) 
    cy.get('app-team-member-card', { timeout: 15000 }).should('be.visible')
    
    cy.get('.grid').should('have.class', 'grid-cols-1')
    
    cy.viewport(768, 1024) 
    cy.get('app-team-member-card').should('be.visible')
    
    cy.viewport(1280, 720)
    cy.get('app-team-member-card').should('be.visible')
  })

  it('should display loading state initially', () => {
    cy.intercept('GET', '**/members', { delay: 2000, fixture: 'team-members.json' }).as('getTeamMembers')
    
    cy.visit('/')
    
    cy.contains('Loading team members').should('be.visible')
    cy.get('.animate-spin').should('be.visible')
    
    cy.wait('@getTeamMembers')
    
    cy.contains('Loading team members').should('not.exist')
  })

  it('should handle error states gracefully', () => {
    cy.intercept('GET', '**/members', { statusCode: 500, body: 'Server Error' }).as('getTeamMembersError')
    
    cy.visit('/')
    
    cy.wait('@getTeamMembersError')
    
    cy.contains('Error loading team data').should('be.visible')
    cy.contains('Try Again').should('be.visible')
    
    cy.intercept('GET', '**/members', { fixture: 'team-members.json' }).as('getTeamMembersRetry')
    cy.contains('Try Again').click()
    
    cy.wait('@getTeamMembersRetry')
    cy.get('app-team-member-card', { timeout: 10000 }).should('have.length.greaterThan', 0)
  })
})
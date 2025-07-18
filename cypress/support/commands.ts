/// <reference types="cypress" />


declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to wait for team members to load
       * @example cy.waitForTeamMembers()
       */
      waitForTeamMembers(): Chainable<void>
      
      /**
       * Custom command to apply a filter
       * @example cy.applyFilter('role', 'Developer')
       */
      applyFilter(filterType: 'role' | 'status', value: string): Chainable<void>
      
      /**
       * Custom command to clear all filters
       * @example cy.clearAllFilters()
       */
      clearAllFilters(): Chainable<void>
    }
  }
}

Cypress.Commands.add('waitForTeamMembers', () => {
  cy.get('[data-cy="loading-spinner"]', { timeout: 10000 }).should('not.exist')
  cy.get('[data-cy="team-member-card"]').should('have.length.greaterThan', 0)
})

Cypress.Commands.add('applyFilter', (filterType: 'role' | 'status', value: string) => {
  const selectId = filterType === 'role' ? '#role-filter' : '#status-filter'
  cy.get(selectId).select(value)
})

Cypress.Commands.add('clearAllFilters', () => {
  cy.get('[data-cy="clear-filters-btn"]').click()
})

export {}
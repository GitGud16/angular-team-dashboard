# Angular Team Dashboard

A lightweight, modular Angular front-end interface for team management built as part of a technical challenge. This application displays team member data dynamically with filtering capabilities, state management using RxJS, and comprehensive testing.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture Overview](#architecture-overview)
- [Setup Instructions](#setup-instructions)
- [Development](#development)
- [Testing](#testing)
- [Build and Deployment](#build-and-deployment)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Accessibility](#accessibility)
- [Assumptions](#assumptions)
- [Development Reflection](#development-reflection)
- [AI Tool Usage](#ai-tool-usage)

## Features

### Core Functionality
- Display team member data in responsive card layout
- Filter team members by role and status
- Real-time filtering without page refresh
- Loading states and error handling with retry functionality
- Responsive design supporting mobile, tablet, and desktop viewports

### Technical Features
- Lazy-loaded feature modules
- RxJS-based reactive state management
- OnPush change detection for performance optimization
- Comprehensive unit and end-to-end testing
- WCAG accessibility compliance
- Professional gray color scheme with hover effects

## Technology Stack

### Core Technologies
- **Angular 17+**: Latest stable version with standalone components
- **TypeScript**: Strict mode enabled for type safety
- **RxJS**: Reactive programming and state management
- **Tailwind CSS**: Utility-first styling and responsive design

### Development Tools
- **Angular CLI**: Project scaffolding and build tools
- **ESLint + Prettier**: Code quality and formatting
- **Jasmine/Karma**: Unit testing framework
- **Cypress**: End-to-end testing framework

## Architecture Overview

### High-Level Architecture

The application follows a modular architecture with clear separation of concerns:

```
App Module (Root)
├── App Routing Module (lazy loads Dashboard)
├── Shared Module (services, utilities)
└── Dashboard Module (lazy-loaded feature module)
    ├── Dashboard Component (smart component)
    ├── Team Filter Component (presentation component)
    ├── Team List Component (presentation component)
    └── Team Member Card Component (presentation component)
```

### Data Flow Architecture

```
API Service → Team Service → Components
     ↓              ↓           ↓
  Raw Data    Business Logic  UI State
```

### State Management Pattern

The application uses RxJS reactive patterns instead of NgRx for simplicity:
- **BehaviorSubjects** in TeamService hold state
- **Observables** expose state to components
- **Operators** (map, filter, combineLatest) handle data transformations
- Components subscribe to observables and react to changes

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm 8+

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/GitGud16/angular-team-dashboard.git>
cd angular-team-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## Development

### Available Scripts

```bash
# Development server
npm start

# Build for production
npm run build

# Run unit tests
npm test

# Run unit tests with coverage
npm test -- --code-coverage

# Run end-to-end tests (interactive)
npm run e2e:open

# Run end-to-end tests (headless)
npm run e2e:ci

# Lint code
npm run lint
```

### Development Server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Testing

### Unit Tests
The application includes comprehensive unit tests covering:
- Component functionality and user interactions
- Service logic and state management
- API integration and error handling
- Filter operations and data transformations

**Coverage**: 43 unit tests with 100% success rate

### End-to-End Tests
Cypress E2E tests cover complete user workflows:
- Dashboard loading and team member display
- Filter functionality (role and status)
- Clear filters operation
- Responsive design behavior
- Loading states and error handling
- Error recovery with retry functionality

**Coverage**: 8 comprehensive E2E test scenarios

### Running Tests

```bash
# Unit tests
npm test

# E2E tests (requires running dev server)
npm run e2e:ci
```

## Build and Deployment

### Production Build
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Considerations
- The application is optimized for production with lazy loading
- All routes are configured for single-page application deployment
- Static assets are optimized and compressed
- Source maps are generated for debugging

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/
│   │   ├── team-filter/
│   │   └── team-member-card/
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   ├── dashboard.component.html
│   │   └── dashboard.routes.ts
│   ├── models/
│   │   ├── team-member.interface.ts
│   │   ├── filter-state.interface.ts
│   │   └── dashboard-state.interface.ts
│   ├── services/
│   │   ├── api.service.ts
│   │   └── team.service.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── assets/
└── styles.css
```

## API Integration

### Data Source
The application integrates with a Convex API endpoint:
- **URL**: `https://accurate-spoonbill-539.convex.site/members`
- **Method**: GET
- **Response**: Array of team member objects

### Data Model
```typescript
interface TeamMember {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  performance_indicator: number;
  start_date: string;
  end_date: string;
  team_lead: string;
  vacation_taken: number;
}
```

### Error Handling
- Automatic retry logic for failed requests (2 retries)
- User-friendly error messages
- Graceful degradation when API is unavailable
- Loading states during API calls

## Accessibility

### WCAG Compliance
The application implements WCAG 2.1 AA accessibility standards:

- **Semantic HTML**: Proper use of article, header, main, and section elements
- **ARIA Labels**: Comprehensive labeling for interactive elements
- **Keyboard Navigation**: Full keyboard accessibility for all interactive elements
- **Focus Management**: Visible focus indicators and logical tab order
- **Screen Reader Support**: Announcements for filter changes and dynamic content
- **Color Contrast**: Sufficient contrast ratios for all text and interactive elements

### Accessibility Features
- Skip links for keyboard navigation
- Screen reader announcements for filter changes
- ARIA live regions for dynamic content updates
- Focus indicators for all interactive elements
- Semantic HTML structure throughout

## Assumptions

### Technical Assumptions
- Modern browser support (ES2020+)
- JavaScript enabled in user browsers
- Stable internet connection for API calls
- Screen resolutions from 320px to 1920px width

### Business Assumptions
- Team member data structure remains consistent
- API endpoint maintains backward compatibility
- Performance indicators are percentage values (0-100)
- Vacation taken values are percentage values (0-100)
- Team member roles and statuses are predefined sets

### Data Assumptions
- Team member IDs are unique integers
- Email addresses are valid and properly formatted
- Date strings follow ISO format (YYYY-MM-DD)
- Empty end_date indicates current employment
- Performance and vacation values are numeric

## Development Reflection

### Most Challenging Aspects

The most challenging part of this development was implementing the reactive data flow with RxJS while maintaining performance and user experience. Specifically:

1. **State Management Complexity**: Coordinating multiple observables (team data, filters, loading states) while ensuring they update reactively without causing unnecessary re-renders.

2. **Testing Reactive Components**: Creating comprehensive unit tests for components that rely heavily on observables and async data streams required careful mocking and timing considerations.

3. **Performance Optimization**: Implementing OnPush change detection strategy while ensuring all reactive updates trigger properly required careful attention to immutable data patterns.

4. **Accessibility Integration**: Balancing modern UI design with comprehensive accessibility features, particularly implementing screen reader announcements for dynamic filter changes.

The solution involved careful architecture planning, extensive use of RxJS operators like combineLatest and map, and thorough testing of both synchronous and asynchronous behaviors.

## AI Tool Usage

### Tools Used

**Primary AI Assistant**: Claude (Anthropic)
- **Purpose**: Code generation, architecture guidance, testing strategy, and documentation
- **Usage**: Approximately 80% of initial code structure and component implementations

### What Was Adjusted or Rejected

**Accepted from AI**:
- Overall architecture and component structure
- RxJS reactive patterns and state management approach
- Tailwind CSS styling and responsive design patterns
- Unit and E2E testing strategies and implementations
- Accessibility implementation patterns

**Modified from AI Suggestions**:
- **Color Scheme**: Changed from blue-based theme to professional gray theme for better visual hierarchy
- **Error Handling**: Enhanced error messages to be more user-friendly and specific
- **Performance Optimizations**: Added OnPush change detection and trackBy functions
- **Test Coverage**: Expanded test scenarios beyond AI suggestions to include edge cases

**Rejected from AI Suggestions**:
- **NgRx Implementation**: Rejected in favor of simpler RxJS BehaviorSubjects for this scope
- **Complex Animation Libraries**: Rejected additional animation dependencies for simplicity
- **Over-engineered Abstractions**: Simplified several suggested abstract classes and interfaces
- **Excessive Documentation**: Reduced verbose inline comments in favor of clear, self-documenting code

### Development Process
The AI tools significantly accelerated development by providing solid architectural foundations and reducing boilerplate code writing. However, all generated code was reviewed, tested, and modified to meet specific requirements and maintain code quality standards.

---

## License

This project was developed as part of a technical challenge and is intended for evaluation purposes.
import { Injectable, inject } from '@angular/core';
import { ErrorHandler } from '@angular/core';

@Injectable()
export class GlobalErrorHandlerService implements ErrorHandler {
  
  handleError(error: any): void {
    console.error('Global error caught:', error);
    
    this.logErrorDetails(error);
    
    this.showUserFriendlyError(error);
  }

  private logErrorDetails(error: any): void {
    const errorInfo = {
      message: error?.message || 'Unknown error',
      stack: error?.stack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };
    
    console.group('🚨 Application Error Details');
    console.error('Error:', errorInfo);
    console.groupEnd();
    
  }

  private showUserFriendlyError(error: any): void {
    const message = this.getUserFriendlyMessage(error);
    
    this.createErrorNotification(message);
  }

  private getUserFriendlyMessage(error: any): string {
    if (error?.message?.includes('Http failure')) {
      return 'Network connection issue. Please check your internet connection and try again.';
    }
    
    if (error?.status === 404) {
      return 'The requested information was not found. Please refresh the page.';
    }
    
    if (error?.status >= 500) {
      return 'Server error occurred. Please try again in a few moments.';
    }
    
    if (error?.message?.includes('ChunkLoadError')) {
      return 'Application update detected. Please refresh the page to get the latest version.';
    }
    
    return 'An unexpected error occurred. Please refresh the page and try again.';
  }

  private createErrorNotification(message: string): void {
    const notification = document.createElement('div');
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'assertive');
    notification.className = 'fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50 max-w-md';
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg class="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div class="ml-3 flex-1">
          <h3 class="text-sm font-medium text-red-800">Application Error</h3>
          <p class="text-sm text-red-700 mt-1">${message}</p>
          <button onclick="window.location.reload()" class="mt-2 text-sm bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-red-500">
            Refresh Page
          </button>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-red-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded" aria-label="Close error notification">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
          </svg>
        </button>
      </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 10000);
    
    notification.focus();
  }
}
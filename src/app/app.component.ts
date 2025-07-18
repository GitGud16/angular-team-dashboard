import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { SkipLinksComponent } from './components/skip-links/skip-links.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SkipLinksComponent],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'angular-team-dashboard';
}

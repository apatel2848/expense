import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, NgClass } from '@angular/common'; 
import { AngularSvgIconModule } from 'angular-svg-icon'; 
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ClickOutsideDirective } from '../../../../shared/directives/click-outside.directive';
import { ThemeService } from '../../../../core/services/theme.service'; 
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile-menu',
  templateUrl: './profile-menu.component.html',
  styleUrls: ['./profile-menu.component.scss'],
  standalone: true,
  imports: [ClickOutsideDirective, NgClass, RouterLink, AngularSvgIconModule],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
          transform: 'translateY(0)',
          visibility: 'visible',
        }),
      ),
      state(
        'closed',
        style({
          opacity: 0,
          transform: 'translateY(-20px)',
          visibility: 'hidden',
        }),
      ),
      transition('open => closed', [animate('0.2s')]),
      transition('closed => open', [animate('0.2s')]),
    ]),
  ],
})
export class ProfileMenuComponent implements OnInit {
  public user: { name: string; email: string; } = { name: '', email: ''}
  public isOpen = false;
  public profileMenu = [
    {
      title: 'Log out',
      icon: './assets/icons/heroicons/outline/logout.svg',
      link: '',
    },
  ];

  public themeColors = [
    {
      name: 'base',
      code: '#e11d48',
    },
    {
      name: 'yellow',
      code: '#f59e0b',
    },
    {
      name: 'green',
      code: '#22c55e',
    },
    {
      name: 'blue',
      code: '#3b82f6',
    },
    {
      name: 'orange',
      code: '#ea580c',
    },
    {
      name: 'red',
      code: '#cc0022',
    },
    {
      name: 'violet',
      code: '#6d28d9',
    },
  ];

  public themeMode = ['light', 'dark'];

  constructor(public themeService: ThemeService, private afAuth: AngularFireAuth) {}

  ngOnInit(): void {
    this.afAuth.authState.subscribe(d => {
      if (d !== null && d !== undefined) {
        this.user.name = d.displayName || '';
        this.user.email = d.email || '';
      }
    }
    );
  }

  public toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  toggleThemeMode() {
    this.themeService.theme.update((theme) => {
      const mode = !this.themeService.isDark ? 'dark' : 'light';
      return { ...theme, mode: mode };
    });
  }

  toggleThemeColor(color: string) {
    this.themeService.theme.update((theme) => {
      return { ...theme, color: color };
    });
  }
}

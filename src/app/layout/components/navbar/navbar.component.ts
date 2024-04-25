import { Component, OnInit } from '@angular/core';  
import { ProfileMenuComponent } from './profile-menu/profile-menu.component'; 
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MenuService } from '../../services/menu.service'; 
import { NavbarMobileComponent } from './navbar-mobile/navbar-mobilecomponent';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: true,
    imports: [
        AngularSvgIconModule, 
        ProfileMenuComponent,
        NavbarMobileComponent,
    ],
})
export class NavbarComponent implements OnInit {
  constructor(  private menuService: MenuService) {}

  ngOnInit(): void {}

  public toggleMobileMenu(): void {
    this.menuService.showMobileMenu = true;
  }
}

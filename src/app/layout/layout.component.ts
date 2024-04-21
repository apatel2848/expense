import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FirebaseUISignInSuccessWithAuthResult, FirebaseUIModule } from 'firebaseui-angular';
import { NavigationEnd, RouterOutlet, Event, RouterLink, Router } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, RouterOutlet, FooterComponent, FirebaseUIModule, RouterLink]
})
export class LayoutComponent implements OnInit {
  private mainContent: HTMLElement | null = null;

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if (this.mainContent) {
          this.mainContent!.scrollTop = 0;
        }
      }
    });
  }

  ngOnInit(): void {
    this.afAuth.authState.subscribe(d => {
      if (d === null || d === undefined) {
        this.router.navigate(['']);
      }
    }
    );
    this.mainContent = document.getElementById('main-content');
  }

  logout() {
    this.afAuth.signOut();
    this.router.navigate(['']);
  }

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log(data);
  }
}

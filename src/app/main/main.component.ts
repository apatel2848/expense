import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import { FirebaseUISignInFailure, FirebaseUISignInSuccessWithAuthResult, FirebaseUIModule } from 'firebaseui-angular';
import { Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    standalone: true,
    imports: [FirebaseUIModule, RouterLink]
})
export class MainComponent implements OnInit {


  constructor(private afAuth: AngularFireAuth, private router: Router) {
  }

  ngOnInit(): void { 
    this.afAuth.signOut();
  }
 

  successCallback(data: FirebaseUISignInSuccessWithAuthResult) {
    console.log('successCallback', data);
    // this.router.navigate(['view/config/location']);
    this.router.navigate(['view/report/weeklyfoodreport']);
  }

  errorCallback(data: FirebaseUISignInFailure) {
    console.warn('errorCallback', data);
  }

  uiShownCallback() {
    console.log('UI shown');
  }
}

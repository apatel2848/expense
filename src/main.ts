import {enableProdMode, importProvidersFrom} from '@angular/core';


import {environment} from './environments/environment'; 
import {firebase, firebaseui, FirebaseUIModule} from 'firebaseui-angular';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {AngularFireModule} from '@angular/fire/compat';
import {AppRoutingModule} from './app/app-routing.module';
import {FormsModule} from '@angular/forms';
import {bootstrapApplication, BrowserModule} from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MainComponent } from './app/main/main.component';
import { AppComponent } from './app/main/app/app.component';

const firebaseUiAuthConfig: firebaseui.auth.Config = {
  signInFlow: 'popup',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  tosUrl: '<your-tos-link>',
  privacyPolicyUrl: '<your-privacyPolicyUrl-link>',
  credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
};


if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    FirebaseUIModule.forRoot(firebaseUiAuthConfig)),
    provideAnimations()
  ]
})
  .catch(err => console.log(err));


# Expense Tracker Application with firebase

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.4.

## How to build this repo

Download and follow the below steps

1. `npm install`
2. `ng serve` 

## How to deploy

### Install Firebase CLI globally

    npm install -g firebase-tools

### Log in to Firebase

    firebase login

### Navigate to your Angular project directory

    cd your-angular-project

### Initialize Firebase in your project

    firebase init

##### During this step, you will be asked the following:

Which Firebase features do you want to set up for this directory?

> Select Hosting: Configure files for Firebase Hosting and (optionally)
> set up GitHub Action deploys.

Please select an option:

> Choose Use an existing project and select your Firebase project.

What do you want to use as your public directory?

> Enter dist/expense-tracker-app/browser

Configure as a single-page app (rewrite all urls to /index.html)?

> Answer Yes.

Set up automatic builds and deploys with GitHub?

> Answer No unless you want to set up continuous deployment with GitHub.

### Build your Angular project

    ng build --configuration production

### Deploy your app to Firebase

    firebase deploy

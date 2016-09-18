//import 'nprogress';
import {inject} from 'aurelia-framework';
import {Redirect} from 'aurelia-router';
import {AuthenticationManager, Configuration as FirebaseConfiguration} from './resources/firebase/index';

export class App {

  router = null;

  configureRouter(config, router) {

    config.title = 'Jogger';
    config.addPipelineStep('authorize', AuthorizeStep);
    config.map([
      {route: ['', 'jog'], name: 'home', moduleId: 'jog/index', nav: true, title: 'Jogs'},
      {route: ['account/signin'], name: 'accountSignin', moduleId: 'account/signin', title: 'Sign in'},
      {route: ['account/signup'], name: 'accountSignup', moduleId: 'account/signup', title: 'Sign up'},
      {
        route: ['account', 'account/index'],
        name: 'accountIndex',
        moduleId: 'account/index',
        title: 'Account',
        auth: true
      },
      {
        route: ['account/edit/email'],
        name: 'accountEditEmail',
        moduleId: 'account/edit_email',
        title: 'Edit email',
        auth: true
      },
      {
        route: ['account/edit/password'],
        name: 'accountEditPassword',
        moduleId: 'account/edit_password',
        title: 'Edit password',
        auth: true
      }
    ]);

    this.router = router;
  }
}

@inject(AuthenticationManager, FirebaseConfiguration)
class AuthorizeStep {

  authManager = null;
  fbConfig = null;

  constructor(authManager:AuthenticationManager, config:FirebaseConfiguration) {
    this.authManager = authManager;
    this.fbConfig = config;
  }

  run(navigationInstruction, next) {
    // Check if the route has an "auth" key
    // Then check if the current authenticated user is valid
    console.log("AuthorizeStep.run",this.authManager);
    if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
      let currentUser = this.authManager.currentUser();
      if (!this.authManager || !currentUser) {
        console.log("No user authenticated. Redirect to login.",this.fbConfig,currentUser);
        return next.cancel(new Redirect(this.fbConfig.getLoginRoute()));
      }
    }
    return next();
  }
}

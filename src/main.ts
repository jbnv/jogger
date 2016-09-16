import {Aurelia} from 'aurelia-framework'
import environment from './environment';

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(<any>Promise).config({
  warnings: {
    wForgottenReturn: false
  }
});

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .feature('resources');
    //.plugin('aurelia-animator-css');

  if (environment.debug) {
    aurelia.use.developmentLogging();
  }

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => {
    var config = {
        apiKey: "AIzaSyDzXBpaPN3aWEq_yDA8TAlALjFuFinl2fI",
        authDomain: "jogger-8f982.firebaseapp.com",
        databaseURL: "https://jogger-8f982.firebaseio.com",
        storageBucket: "jogger-8f982.appspot.com",
        messagingSenderId: "304130820150"
    };
    //firebase.initializeApp(config);
    aurelia.setRoot();
  });
}

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  emailAPI: 'http://XXXXXX.com/contact-form.php',
  database: 'firebase',
  social: {
    role: 'Guest',
    fblink: 'https://www.facebook.com/elishconsulting',
    linkedin: 'https://www.linkedin.com/company/elish-consulting/about/?viewAsMember=true',
    github: 'https://github.com/AmitXShukla',
    emailid: 'info@elishconsulting.com'
  },
  socialAuthEnabled: true,
  firebase : {
    apiKey: "",
    authDomain: "",
    databaseURL: "https://elishcrm.firebaseio.com",
    projectId: "elishcrm",
    storageBucket: "",
    messagingSenderId: ""
  }
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

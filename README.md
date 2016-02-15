# giftable
[![Build Status](https://travis-ci.org/bpkennedy/giftable.svg?branch=master)](https://travis-ci.org/bpkennedy/giftable)

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 1.0.0.

# Installation & development

1. Go to your directory for projects
2. `git clone https://github.com/bpkennedy/giftable.git`
3. `cd giftable`
4. `bower install` and then `npm install`
5. `grunt` and then `grunt serve` to start the local webserver serving from the `/src` directory.  This will use LiveReload to watch for file changes and automatically refresh the browser.
5a. Alternately, you could serve the `dist` folder in the way that the production node process does by going into the `/server` folder and doing `node app.js` and then navigating to the port in your browser.

# Building

As new bower modules are installed, using the common `bower install xxx --save`, you need to inject these into your index.html file via the `<!-- usemin -->` blocks in the html.  To do this, simply ensure that the module is in your bower.json dependencies section and then do a `grunt wiredep` or `grunt build`.

We can use the Yo/Angularfire generator to perform a Build which will create the `dist` folder.  You can do `grunt build` to do this.

The production application uses whatever is in the `dist` folder and serves it, so performing a build before a deployment is essential.

# Deployment

The production appliction is running on a Heroku dyno, and is set to for continuous deployment with the master branch of this repo.  A successful build flow is:  Merge to master > Travis Builds and runs unit tests > Heroku Builds and Deploys Master.  When Heroku deploys it is actually starting a node process for the web process which is setup in the procfile like:

```web: node server/app.js
worker: node server/checkEvents.js```

# Server Jobs
A worker node process is run hourly using the [Heroku Scheduler addon](https://elements.heroku.com/addons/scheduler), which is very cron-like.  It runs the `checkEvents` process which makes calls to Firebase to check event times, uses nodeMailer to construct and send emails to users.  Additionally, some application emails are sent from the node instance that is running the web worker, since it is always up.

# Google Searchable
Prerender.io's pre-caching service is used to cache the angular app pages for the Google Search Crawler.  This is configured in `/server/app.js` and is also the reason for the hashbang route configuration in the interface.  I would prefer the HTML5 mode, although I had trouble getting it working correctly.

# Firebase backend
This application uses Firebase for the persistent data.  Actually, developing locally uses the same [production data](https://giftable.firebaseio.com), so I needed to put some security rules in place.  For this I used the [Bolt Compiler](https://www.firebase.com/docs/security/bolt/guide.html) and created the rules.bolt file for node-specific security and data type validation.  Users may write and read to children of the main nodes: events, gifts, person, user.  However, they are restricted from being able to write the nodes themselves (to prevent accidental or malicious removal of other users' data).

## Firebase Util
The experimental [Firebase Util](https://github.com/firebase/firebase-util) package is used to do some important join type operations with a helpful `NormalizedCollection` method.  This allowed me to create a flat data architecture and yet still join a Person resource's Events and Gifts to the Events and Gifts node and display all matching items on their page.

# Testing
Running `grunt test` will run the unit tests with karma.

# Doorbell.io
Doorbell is used to collect user feedback and is setup to integrate with this repo's Issues list, if an enhancement is agreed on or a needed bugfix is validated.

# Google Analytics
This is used to track metrics on app usage - pages visited, action events (new gifts/events/people), and also logging errors.

# Collaboration
Feel free to create a PR for a bug or even enhancement!

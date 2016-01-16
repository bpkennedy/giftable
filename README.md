# giftable
[![Build Status](https://travis-ci.org/bpkennedy/giftable.svg?branch=master)](https://travis-ci.org/bpkennedy/giftable)

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 1.0.0.

# Installation & development

1. Go to your directory for projects
2. `git clone https://github.com/bpkennedy/giftable.git`
3. `cd giftable`
4. `bower install` and then `npm install`
5. `grunt` and then `grunt serve` to start the local webserver.  This will use LiveReload to watch for file changes and automatically refresh the browser.

# Building and Deploying

As new bower modules are installed, using the common `bower install xxx --save`, you need to inject these into your index.html file via the `<!-- usemin -->` blocks in the html.  To do this, simply ensure that the module is in your bower.json dependencies section and then do a `grunt wiredep`.

We can use the Yo/Angularfire generator to perform a Build which will create the `dist` folder.  You can do `grunt build` to do this.

Finally, this application is being hosted in Firebase's free app hosting.  Continuous Integration is stup with Travis CI.  And simply doing a commit or merge to Master will initiate Travis to do a Build and then a `firebase deploy` after it is done.  This will deploy to the url: https://giftable.firebaseap.com

## Testing

Running `grunt test` will run the unit tests with karma.

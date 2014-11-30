Mandrill App   [![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
==============

This is a sandbox app for learning FullStackJS development<br> It's the also the place where I try new tools and test various frontend stuff.
It's developed with [AngularJS](http://angularjs.org) on client side and the backend part is supported with an [NodeJS](http://nodejs.org/) web server thanks to [Express](http://expressjs.com/) framework. Data are stored on [Firebase](http://www.firebase.com) database

This app is a simple [Mandrill](http://www.mandrill.com) (third party emailing service) client.



# Current Features
- Firebase Authentication
- Simple template editing
- Template sending


# WIP
- Password Reset
- Admin space

# Quick Start

* Clone the repo
* Install dependencies
```
npm install && bower install
```
* Run grunt serve
 ```
grunt serve
```

# Grunt tasks

- `grunt serve` runs Express Server in development mode
- `grunt serve:dist` runs Express Server in production mode
- `grunt build` builds the optimized project

# Deploying on Heroku

- `cd dist`
- `git add . -A`
- `git commit -m "deploying..."`
- `git push heroku master`

For more information, see : [Heroku Deploying Docs](https://devcenter.heroku.com/articles/git)

## Made with :
* AngularJS
* Yeoman [generator-angular-fullstack](https://www.npmjs.org/package/generator-angular-fullstack)
* Firebase
* Bower
* Grunt
* Bootstrap 3
* SASS
* Mandrill
* NodeJS (Express)

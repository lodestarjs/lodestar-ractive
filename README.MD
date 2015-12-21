Lodestar-Ractive
==
_A combination of the [LodestarJS-Router](https://github.com/lodestarjs/lodestar-router) and [RactiveJS](https://github.com/ractivejs/ractive) in one place as a proof of concept, presented as a framework._

### What is Lodestar-Ractive?

[![Join the chat at https://gitter.im/lodestarjs/lodestar-ractive](https://badges.gitter.im/lodestarjs/lodestar-ractive.svg)](https://gitter.im/lodestarjs/lodestar-ractive?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Lodestar-Ractive provides you with a light, quick and simple way of using a JavaScript framework in your project. It makes use of the Router and general structure provided by LodeStar and the Models and Views provided by Ractive.

I created it as a proof of concept to see how easy it would be to bring two projects like these together to create a simple but powerful framework.

Jump down to [usage](#Using-the-framework) to see just how simple using Lodestar-Ractive is!

### Installing

This framework has been published to both NPM and Bower.

**Installing through bower**
```
bower install lodestar-ractive
````
**Installing through npm**
```
npm install lodestar-ractive
```

### Including the framework in your project

This framework is dependant on Ractive, so far it has been tested to work with `0.7.3`.

After installing both Ractive and lodestar-ractive to your project, include them both at the bottom of your file in the following order:
```
  <script type="text/javascript" src="ractive.js"></script>
  <script type="text/javascript" src="lodestar-ractive.js"></script>
```

After you have included these two files you can include your JavaScript beneath them to make use of the framework.

#### Es6 jsnext:main
If you ware using ES6 with a bundler such as Rollup you may know about [jsnext:main](https://github.com/rollup/rollup/wiki/jsnext:main). This framework is compliant with that and as such, as a different way of including the framework into your project you could do the following after installing it through npm:

```
import LodeRactive from 'lodestar-ractive';
```

### Using the framework

After setting up your project, the first thing that you'll probably want to do is to declare an instance of the framework and create a route.

#### Declaring an instance

After including the router in your project, declare a new instance of it. While creating a new instance, you can optionally pass it some config options to control how your router should behave, [see config](#configuring).

```
var router = new LodeRactive(/* Configure using an object */);
```

#### Creating Routes

Creating a route accepts an [Object](#An-object) of options.

As the router operates by a hierarchy, you may be wondering how this shorthand would map to that hierarchy?

Simple! To declare a parent to a current route you wrap that part of the route in square brackets. For example:

**Example**
```
var router = new LodeRactive();

router.createRoute({
  path: '/',
  controller: function() {
    console.log('I am the index route!');
  }
});

router.createRoute({
  path: '[/]dashboard',
  controller: function() {
    console.log('I am a child of that ^ index route!');
  }
});

```

#### Adding Views, Actions and Models

This is where Ractive comes in. If you pass the view option to createRoute, then you can make use of Ractive nearly the same as normal. I say nearly as we have changed how the events work a bit but I'll come to that in a [second](#actions).

##### Views

Adding a view is nearly identical to how you add a view in [Ractive](http://docs.ractivejs.org/latest/get-started), but with another cool feature. If you pass an object to template instead of the template string, then you can retrieve HTML from other pages of the website, providing that there is static HTML there i.e. before JavaScript is executed.

**Example**
```
var router = new LodeRactive();

router.createRoute({
  path: '/',
  controller: function() {
    console.log('I am the index route!');
  },
  view: {
    el: '#target-element',
    template: '<h1> I am a header </h1>'
  }
});
```

##### Actions

For this framework we have moved the .on() and .observe() events from the Ractive object and put them onto the router in an actions object to provide more separation between the two so that less code needs to go directly into the controller.

**Example**
```
var router = new LodeRactive();

router.createRoute({
  path: '/',
  controller: function() {
    console.log('I am the index route!');
  },
  view: {
    el: '#target-element',
    template: '<h1 on-click="sayHi"> I am a header </h1>'
  },
  actions: {
    sayHi: function(){
      alert('Hi!');
    }
  }
});
```

#### Models

A model is an object that, in this framework, will represent the data of your controller and view. Using data binding any data that you have specified in your html to change, will also change the data available to your controller.

**Example**
```
var router = new LodeRactive();

router.createRoute({
  path: '/',
  controller: function() {
    console.log('This is my full name ' + this.get('fullName'));
  },
  view: {
    el: '#target-element',
    template: '<input type="text" value="{{fullName}}"/>',
    data: { fullName: "Test Name" }
  }
});
```

#### Configuring

The available options to configure are the following with their defaults:

```
{
  DEBUG: true,
  useHistory: false,
  loggingLevel: 'LOW'
}
```

#### DEBUG - Global

This option will log all of the issues that are encountered by Ractive and the Router. By default this will only log a minimal amount of issues i.e. the important ones. By saying that this option is global we mean that setting the DEBUG option will manually configure all instance of the Router.

#### useHistory

If this is set to true, then if the History API is available then the hash will be removed from the url and use pushState to put the current state into the URL.

If you are not using history, in your HTML, you will have to link to pages by having the hash present in the href.

**Example**
```
<a href="#/blog">To the blog!</a>
```

#### loggingLevel

By default this is set to LOW, so it will only tell you about the issues that we feel you should know. However, if this is set to HIGH then everything in the Router will be logged.


### Tests

As this is just a proof of concept, I haven't included any tests in the framework itself as there isn't alot to it at the moment (It's 150 lines including comments).

### Contributing

Feel free to contribute! If you see anything that could do with improvements or if you encounter any bugs, create an issue for it first so that it can be tracked.

I am using [commitizen](https://commitizen.github.io/cz-cli/) for my commits, so if you're planning on contributing, then using that would be nice to keep the commits to a similar standard.
/* Lodestar-Ractive - 1.1.0. 
Author: Dan J Ford 
Contributors: undefined 
Published: Wed Dec 23 2015 00:40:31 GMT+0000 (GMT) */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  global.LodeRactive = factory();
}(this, function () { 'use strict';

  var hasConsole = typeof console !== 'undefined';
  var hasCollapsedConsole = !!console.groupCollapsed;
  var hasHistory = !!(window.history && history.pushState);
  var hasEventListener = !!window.addEventListener;

  function fullExtend(dest, objs, deep) {
    for (var i = 0, ii = objs.length; i < ii; i++) {
      var obj = objs[i];

      if (!isObject(obj)) return;

      var objKeys = Object.keys(obj);

      for (var j = 0, jj = objKeys.length; j < jj; j++) {
        var key = objKeys[j];
        var val = obj[key];

        if (isObject(val) && deep) {
          if (!isObject(dest[key])) dest[key] = Array.isArray(val) ? [] : {};
          fullExtend(dest[key], [val], true);
        } else {
          dest[key] = val;
        }
      }
    }

    return dest;
  }

  /**
   * Low extend of the object i.e. not recursive copy
   *
   * @param  {Object} dest, the object that will have properties copied to it
   * @param  {Object} val, the second object with the properties to copy
   * @return {Object} the new object with properties copied to it
   */
  function merge(dest, val) {
    return fullExtend(dest, [val], false);
  }

  /**
   * Deep extend the object i.e. recursive copy
   *
   * @param  {Object} dest, the object that will have properties copied to it
   * @param  {Object} val, the second object with the properties to copy
   * @return {Object} the new object with properties copied to it
   */
  function copy(dest, val) {
    return fullExtend(dest, [val], true);
  }

  /**
   * @param  {Object} val, the parameter to check if it is a object
   * @return {Boolean} whether or not the parameter is an object
   */
  function isObject(val) {
    return val !== null && typeof val === 'object';
  }

  var globals = {
    DEBUG: true
  };
  var defaultConfig = {
    useHistory: false,
    basePath: '',
    loggingLevel: 'LOW', // options are LOW or HIGH
    usingMap: '',
    listenerActive: false
  };
  /**
   * This initialises the config for each instance with a fresh config,
   * also adds a global variable to the window which may be used by other libs.
   *
   * @param  {Object} _this, this passed in from the constructore
   * @return {Void}, nothing returned
   */
  function initConfig(_this) {

    _this.routes = {};
    _this.config = merge({}, defaultConfig);
    _this.cachedPath = [];
    window.LodeVar = window.LodeVar || {};
  }

  /**
   * Modifies the config for an instance
   * @param  {Object} _this, this passed in from the constructore
   * @param  {Object} changes, the changes the user wants to make to the config.
   * @return {Void}, nothing returned
   */
  function modifyConfig(_this, changes) {

    if (changes) {

      if (typeof changes.DEBUG !== 'undefined') globals = copy({}, { DEBUG: changes.DEBUG });delete changes.DEBUG;

      if (changes.loggingLevel) changes.loggingLevel = changes.loggingLevel.toUpperCase();

      _this.config = fullExtend({}, [_this.config, changes], true);
    }

    return _this.config;
  }

  var logger = {};

  logger.debug = function () {
    if (hasConsole && globals.DEBUG) console.debug.apply(console, arguments);
  };

  logger.log = function () {
    if (hasConsole && globals.DEBUG) console.log.apply(console, arguments);
  };

  logger.warn = function () {
    if (hasConsole && globals.DEBUG) console.warn.apply(console, arguments);
  };

  var routerIntro = ['LodestarJs-Router 1.1.0 in debug mode.'];
  var routerMessage = '\n\nHello, you are running the LodestarJs Router 1.1.0 in debug mode.\nThis will help you to identify any problems in your application.\n\nDEBUG mode is a global option, to disable debug mode will disable it for each\ninstance. You can disable it when declaring a new instance. For example,\nnew Router({DEBUG: false});\n\nFor documentation head to the wiki:\n  https://github.com/lodestarjs/lodestar-router/wiki\n\nIf you have found any bugs, create an issue for us:\n  https://github.com/lodestarjs/lodestar-router/issues\n\n';

  /**
   * The welcome function gives a message to the user letting the know
   * some key things about the Router.
   * @return {Void}, nothing returned
   */
  function welcome() {

    if (hasConsole && globals.DEBUG) {

      console[hasCollapsedConsole ? 'groupCollapsed' : 'log'].apply(console, routerIntro);

      console.log(routerMessage);

      if (hasCollapsedConsole) {
        console.groupEnd(routerIntro);
      }
    }
  }

  /**
   * Logs the route that has not been found.
   * @param  {String} path, the child of the parent route to watch.
   * @param  {String} originalPath, the original path
   * @return {Void}, nothing returned
   */
  function notFoundLog(path, originalPath) {
    logger.warn('Route ' + path + ' of ' + originalPath + ' not found.');
  }

  /**
   * Clears the routes cache of no longer needed active routes
   * @param  {String} path, The current path
   * @return {Void}, nothing returned
   */
  function clearCache(path) {

    var cachedPath = this.cachedPath,
        i = cachedPath.length;

    while (i--) {

      var key = Object.keys(cachedPath[i])[0];

      if (path.indexOf(key) === -1) {

        cachedPath[i][key].active = false;
        cachedPath.splice(i, 1);
      }
    }
  }

  /**
   * Splits the dynamic part
   * @param  {String} path, the current path to match the dynamic section
   * @param  {Array} splitKey, the path split into dynamic segments
   * @return {Object}, the object to map the dynamic segments into
   */
  function dynamicSplit(path, splitKey) {

    var output = {};

    splitKey.shift();

    for (var i = 0, ii = splitKey.length; i < ii; i++) {

      output[splitKey[i].split('/')[0].replace(/\//g, '')] = path.match(/[^\/]*/g)[i !== 0 ? i + i : i];
    }

    return output;
  }

  /**
   * The page not found function, will execute a not found function that the user sets up
   * @param  {String} path, the current path that was not found
   * @param  {String} originalPath, the parent of the current path that was not found
   * @return {Void}, nothing returned
   */
  function pageNotFound(path, originalPath) {

    if (typeof this.userNotFound !== 'undefined') this.userNotFound();

    notFoundLog(path, originalPath);
  }

  function getParentPointer(pointer) {

    return pointer;
  }

  /**
   * This goes through the entire routing tree, executing the matching paths.
   *
   * It also makes use of caching as in that it will only need to execute the
   * paths that are necessary.
   *
   * @param  {String} path, the current path that we are on
   * @return {Void}, nothing returned
   */
  function resolve(path) {

    if (path === '') path = '/';
    if (!path) return;

    var pointer = this.routes,
        parent = false,
        originalPath = path,
        isFinal = false,
        keyCache = '',
        matchedParent = false,
        currentPath = [];

    while (path.length) {

      var routeData = {};

      // For each child of the current pointer which is some child of routes
      for (var key in pointer) {

        var dynamicKey = false;

        keyCache = key;

        // If contains : then it has dynamic segments
        if (key.indexOf(':') > -1) {

          var splitKey = key.split(':');

          // If there are more : than expected then there are multiple dynamic segments
          if (splitKey.length > 2) {

            routeData = dynamicSplit(path, splitKey);
            dynamicKey = key.replace(/\:[^\/]*/g, '[^\\/]*');
          } else {

            routeData[key.match(/\:[^\/]*/g)[0].replace(/(\:|\/)/g, '')] = path.match(/[^\/]*/)[0];
            dynamicKey = key.replace(/\*[^\/]*/g, '').replace(/\:[^\/]*/g, '[^\\/]*');
          }
        }

        // If contains * then there is a wildcard segment
        if (key.match(/\*[a-z]+/i)) {

          routeData[key.match(/\*[a-z]+/i)[0].replace(/\*/gi, '')] = path.replace(new RegExp(dynamicKey), '').match(/.*/)[0].split('/');
          dynamicKey = '.*';
        }

        matchedParent = path.match('^' + (dynamicKey || key));

        // Find out if we're on the final run
        isFinal = matchedParent && path.replace(matchedParent[0], '').replace(/^\//, '').replace(/\/$/, '').length === 0 ? true : false;

        if (path.length && matchedParent) {

          // This will be used to clear the cache
          var obj = {};
          obj[key] = pointer[key];
          currentPath.push(key);
          this.cachedPath.push(obj);

          // If it's not the final run and the current route is not active, execute it
          if (!pointer[key].active && !isFinal) {

            pointer[key].routeData = routeData;
            pointer[key].active = true;
            if (parent) pointer[key].getParent = function () {
              return getParentPointer(parent);
            };
            pointer[key].controller();
          }

          // Remove current part from the path
          path = path.replace(matchedParent[0], '').replace(/^\//, '').replace(/\/$/, '');

          // If it is not final then re-assign the pointer
          if (pointer[key].childRoutes && !isFinal) {

            parent = pointer[key];
            pointer = pointer[key].childRoutes;
          } else if (!isFinal) {

            pageNotFound.call(this, path, originalPath);
            path = '';
          }

          break;
        }
      }

      // If it's the final page, re-execute it and set to active
      if (isFinal) {

        pointer[keyCache].routeData = routeData;
        pointer[keyCache].active = true;
        if (parent) pointer[keyCache].getParent = function () {
          return getParentPointer(parent);
        };
        pointer[keyCache].controller();
        clearCache.call(this, currentPath);
      } else if (!matchedParent) {

        pageNotFound.call(this, path, originalPath);
        clearCache.call(this, currentPath);
        path = '';
        break;
      }
    }
  }

  /**
   * Used in createRoute to map a routing object to a parent in a way
   * that the Router can understand it.
   * @param  {String} parents, the parent path
   * @param  {Object} routeObject, the object to add as a child
   * @return {Void}, nothing returned
   */
  function traverse(parents, routeObject) {

    var pointer = this.routes,
        createPointer = {};

    while (parents.length) {

      for (var key in pointer) {

        var matchedParent = parents.match('^' + key);

        if (parents.length && matchedParent) {

          parents = parents.replace(matchedParent[0], '').replace(/^\//, '').replace(/\/$/, '');

          createPointer = pointer[key];
          pointer = pointer[key].childRoutes || pointer[key];

          break;
        }
      }
    }

    if (typeof createPointer.childRoutes === 'undefined') {
      createPointer.childRoutes = {};
    }

    routeObject.path = routeObject.path.substring(routeObject.path.indexOf(']') + 1).replace(/^\//, '').replace(/\/$/, '');

    createPointer.childRoutes[routeObject.path] = {};
    createPointer.childRoutes[routeObject.path].controller = routeObject.controller;
  }

  function formatRoute(route) {

    if (route === '') {
      route = '/';
    }

    route = route.replace(/^(\/?[\#\!\?]+)/, '').replace(/$\//, '');

    if (this.config.basePath.length) {
      route = route.replace(this.config.basePath, '');
    }

    return route;
  }

  /**
   * For createRoute() grab the parent specified in the []
   * @param  {String} url, the route to find a parent in
   * @return {String}, the parent URL
   */
  function getParent$1(url) {
    var begin = url.indexOf('[') + 1,
        end = url.indexOf(']');
    return url.substring(begin, end);
  }

  /**
   * Removes the origin from the link, for those who are using absolute links..
   * @param  {String} link, the link to have the origin removed from it.
   * @return {String}, the link with the origin removed.
   */
  function removeOrigin(link) {

    if (!window.location.origin) {
      return link.replace(window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : ''), '');
    } else {
      return link.replace(window.location.origin, '');
    }
  }

  /**
   * Traverses through the parent nodes to look for an Anchor tag.
   * Used in historyMode.
   * @param  {HTMLElement} target, the element to begin traversing from.
   * @return {Boolean|HTMLElement} returns false or the found element.
   */
  function checkParents(target) {

    while (target) {

      if (target instanceof HTMLAnchorElement) {
        return target;
      }

      target = target.parentNode;
    }

    return false;
  }

  /**
   * On click, finds the anchor tag formats the link and returns it.
   * @param  {Event} e, the event passed through from the click event.
   * @return {String} returns the formatted href for this link
   */
  function historyClick(e) {

    e = window.e || e;

    var target = e.target,
        anchorLink = '',
        targetAttr = '',
        formattedRoute = '',
        unformattedRoute = '';

    if (target.tagName !== 'A') target = checkParents(target);

    if (!target) return;

    anchorLink = target.getAttribute('href');
    targetAttr = target.getAttribute('target');

    if (anchorLink.indexOf(':') > -1 && !anchorLink.match(/(?:https?):/)) return;

    if (targetAttr === '_blank' || anchorLink.match(/(?:https?):/) && anchorLink.indexOf(window.location.hostname) === -1) return;

    // To push to the url in case there is a base path
    unformattedRoute = removeOrigin(anchorLink);
    formattedRoute = formatRoute.call(this, unformattedRoute);

    history.pushState(null, null, unformattedRoute);

    e.preventDefault();

    return formattedRoute === '' ? '/' : formattedRoute;
  }

  function listenEvent(target, e, f) {

    if (hasEventListener) {

      target.addEventListener(e, f, false);
    } else {

      target.attachEvent(e, f);
    }
  }

  /**
   * This sets up the events for 'Hashchange' and 'History' mode depending on what has been selected and what is available.
   * @return {Void}, nothing returned
   */
  function listener() {
    var _this = this;

    if (this.config.listenerActive) return;

    if (this.config.loggingLevel === 'HIGH') logger.debug('Listener is now active.');

    var initialLink = this.config.useHistory && hasHistory ? window.location.pathname : window.location.hash;

    this.config.listenerActive = true;

    listenEvent(document, 'click', function (e) {
      window.LodeVar.previousPath = formatRoute.call(_this, removeOrigin(window.location.href));
    });

    if (!this.config.useHistory || !hasHistory) {

      if (this.config.loggingLevel === 'HIGH') logger.debug('Listening for hash changes.');

      listenEvent(window, hasEventListener ? 'hashchange' : 'onhashchange', function () {
        _this.resolve(formatRoute.call(_this, window.location.hash));
      });
    } else if (this.config.useHistory && hasHistory) {

      if (this.config.loggingLevel === 'HIGH') logger.debug('Listening for clicks or popstate.');

      listenEvent(document, 'click', function (e) {
        var historyLink = historyClick.call(_this, e);

        if (historyLink) {
          _this.resolve(historyLink);
        }
      });

      listenEvent(window, 'popstate', function () {
        _this.resolve(formatRoute.call(_this, window.location.pathname));
      });
    }

    // Fire the initial page load link
    this.resolve(formatRoute.call(this, initialLink));
  }

  /**
   * The bare bones-way of creating a routing object
   * @param  {Object} routeObject, the route object as the Router expects it
   * @return {Void}, nothing returned
   */
  function map(routeObject) {

    if (this.config.usingMap === false) throw new Error('Do not use map() as well as createRoute().');

    for (var key in routeObject) {

      this.routes[key] = routeObject[key];
    }

    this.config.usingMap = true;

    listener.call(this);
  }

  /**
   * The nicer way of creating a route filled with validation, may take longer than map().
   * @param  {Object} routeObject, an object that the Router will translate into an object it can understand
   * @return {Void}, nothing returned
   */
  function createRoute(routeObject) {
    var _this = this;

    if (this.config.usingMap === true) throw new Error('Do not use createRoute() as well as map().');

    if (!routeObject) throw new Error('No route object defined.');

    if (!routeObject.path) throw new Error('Please define the route to use.');

    if (!routeObject.controller || typeof routeObject.controller !== 'function') throw new Error('Please define the function that should be executed.');

    var parentUrls = '';

    if (routeObject.path.indexOf('[') > -1) {

      parentUrls = getParent$1(routeObject.path);

      traverse.call(this, parentUrls, routeObject);
    } else {

      routeObject.path = formatRoute.call(this, routeObject.path);
      this.routes[routeObject.path] = {};
      this.routes[routeObject.path].controller = routeObject.controller;
    }

    if (this.config.usingMap === '') {

      setTimeout(function () {
        listener.call(_this);
      }, 0);
    }

    this.config.usingMap = false;
  }

  function Router(options) {

    initConfig(this);

    modifyConfig(this, options);

    welcome();
  }

  Router.prototype = {

    createRoute: createRoute,
    map: map,
    resolve: resolve,
    notFound: function notFound(callback) {
      this.userNotFound = callback;
    }

  };

  var Promise = Promise || Ractive.Promise;

  // Returns the requested element of the target doc and removes script tags

  function parser(doc, options) {

    var el = options.container ? options.container : 'body',
        regExp = new RegExp('(<[\s\/]*script\\b[^>]*>)([^>]*)(<\/script>)', 'gi');

    return doc.querySelector(el).innerHTML.replace(regExp, '');
  }

  /**
   * Load the given url and return its contents.
   * When support for fetch increases this will probably be a lot simpler.
   * @param  {String} options, the internal url to load page content from
   * @return {Promise}, Will return a string of the page content
   */

  function loadPage(options) {

    return new Promise(function (resolve, reject) {

      var xhr = undefined;

      // code for IE7+, Firefox, Chrome, Opera, Safari, SeaMonkey
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      }

      xhr.onreadystatechange = function () {

        var errorCodes = [404, 400, 500];

        if (xhr.readyState === 4 && xhr.status === 200) {
          resolve(parser(xhr.responseXML, options));
        } else if (errorCodes.indexOf(xhr.status) > -1) {
          reject({ status: this.status, statusText: xhr.statusText });
        }
      };

      xhr.onerror = function (error) {
        reject({ status: this.status, statusText: xhr.statusText });
      };

      xhr.open('GET', options.url);
      xhr.responseType = 'document';
      xhr.send();
    });
  }

  function setup(options) {

    var controllerOpts = options.controller ? options.controller : {},
        getParent = this.getParent,
        hasView = typeof options.view !== 'undefined';

    this.controllerModel = hasView ? new Ractive(options.view) : {};

    if (hasView) {

      if (controllerOpts.actions) this.controllerModel.on(controllerOpts.actions);
      if (controllerOpts.observe) this.controllerModel.observe(controllerOpts.observe);
      if (controllerOpts.observeOnce) this.controllerModel.observeOnce(controllerOpts.observeOnce);
    }

    if (typeof this.getParent === 'function') this.controllerModel.getParent = function () {
      return getParent().controllerModel;
    };

    this.controllerModel.on = function () {
      throw new Error('Use the actions attribute in the route object.');
    };
    this.controllerModel.observe = function () {
      new Error('Use the observe attribute in the route object.');
    };
    this.controllerModel.observeOnce = function () {
      new Error('Use the observeOnce attribute in the route object.');
    };

    if (typeof controllerOpts.controller === 'function') {
      controllerOpts.controller.call(this.controllerModel, this.routeData || {});
    }
  }

  /**
   * Sets up and runs the controller, if an object is given to template then it will attempt to
   * load in a template from the given url.
   * @param  {Object} options, the route object to set the controller up with.
   * @return {Void}, nothing to return.
   */
  function setupController(options) {
    var _this = this;

    if (options.view && !options.active) {

      if (isObject(options.view.template) && options.view.template.url) {

        if (options.view.template.notOnSame && options.view.template.url === (window.LodeVar.previousPath || options.view.template.url)) {

          options.view.template = parser(document.getElementsByTagName('body')[0], options.view.template);

          setup.call(this, options);
          return;
        }

        loadPage(options.view.template).then(function (template) {

          options.view.template = template;
          setup.call(_this, options);
        });
      } else {

        setup.call(this, options);
      }
    } else {

      setup.call(this, options);
    }
  }

  /**
   * Constructor for the framework. It depends on Ractive as this is a POC
   * of using the router with Ractive.
   * @param {Object} options, the configuration options for the framework.
   * @returns {Void}, nothing returned
   */
  function LodeRactive(options) {

    if (typeof Ractive === 'undefined') throw Error('Couldn\'t find an instance of Ractive, you need to have it in order to use this framework.');

    if (options && typeof options.DEBUG !== 'undefined') Ractive.DEBUG = options.DEBUG;

    this.router = new Router(options);
  }

  /**
   * Pulling in some of the functions from the lodestar Router and
   * adding it to the frameworks prototype
   * @type {Object}
   */
  LodeRactive.prototype = {

    createRoute: function createRoute(options) {
      this.router.createRoute({
        path: options.path,
        controller: function controller(routeData) {
          setupController.call(this, options);
        }
      });
    },
    notFound: function notFound(options) {
      this.router.notFound(options);
    }

  };

  return LodeRactive;

}));
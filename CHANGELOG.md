## 1.2.0

### Breaking Change - Enhancements

- The controller attribute of controller has now been changed to onInit, a deprecation notice will be logged for those still using controller.
 - https://github.com/lodestarjs/lodestar-ractive/issues/33

### Enhancements

- The notOnSame attribute has been removed as the framework now knows when it is the correct time to request templates
 - https://github.com/lodestarjs/lodestar-ractive/issues/32
- Now, when you create a route, if you pass the view an el but nothing else then it will assume you want to progressively enhance the current page.

## 1.1.0

### Breaking Changes

- Changing controller from a Function into an Object
- Moving all events from the router into the controller Object
 - This will create a nicer flow and will be nice for when the cli is built

### Enhancements

- Faster routing due to cache improvements in the LodestarJS Router
- this.getParent() to get the parent route's Ractive View-Model

### Bug Fixes
- Fix so that target="_blank" will now work
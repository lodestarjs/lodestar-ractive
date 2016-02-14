## 1.1.1

### Enhancements

- The notOnSame attribute has been removed as the framework now knows when it is the correct time to request templates
 - https://github.com/lodestarjs/lodestar-ractive/issues/32
- Now, when you create a route, if you pass the view an el but nothing else then it will assume you want to progressively enhance the current page.

### Bug Fixes

-  Pulling in bugfix from the lodestar-router where the dynamic segments were being mismatched

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
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
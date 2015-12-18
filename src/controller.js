import { loadPage, parser} from './ajax';
import events from './events';
import { isObject } from 'lodestar-router/src/utils/object';
import { logger }  from 'lodestar-router/src/utils/log';

function setup( options ) {

  let ractive = new Ractive(options.view);

  for ( let key in  ractive ) {
    if ( ractive.hasOwnProperty(key) && key !== 'data' ) {
      this[key] = ractive[key];
    }
  }

  // Ractive doesn't let us touch data, so we'll have to manually add the data methods
  for ( let i = 0, ii = events.length; i < ii; i++ ) {
    if ( typeof ractive[events[i]] !== 'undefined' ) {
      this[[events[i]]] = ractive[events[i]];
    }
  }

  if ( options.actions ) ractive.on( options.actions );
  if ( options.observe ) ractive.observe( options.observe );

  this.on = function() { throw new Error('Use the actions attribute in the route object.'); };
  this.observe = function() { new Error('Use the observe attribute in the route object.'); };

  options.controller.call(this, this.routeData || {});

}

/**
 * Sets up and runs the controller, if an object is given to template then it will attempt to
 * load in a template from the given url.
 * @param  {Object} options, the route object to set the controller up with.
 * @return {Void}, nothing to return.
 */
export default function setupController( options ) {

  if ( options.view && !options.active) {

    if ( isObject(options.view.template) && options.view.template.url ) {

      if ( options.view.template.notOnSame && options.view.template.url === ( window.LodeVar.previousPath || options.view.template.url ) ) {

        options.view.template = parser( document.getElementsByTagName('body')[0], options.view.template );

        setup.call( this, options);
        return;
      }

      loadPage( options.view.template ).then( ( template ) => {

        options.view.template = template;
        setup.call( this, options );

      });

    } else {

      setup.call( this, options );

    }

  }

}
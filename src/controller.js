import { loadPage, parser} from './ajax';
import events from './events';
import { isObject, fullExtend } from 'lodestar-router/src/utils/object';
import { logger }  from 'lodestar-router/src/utils/log';

function setup( options ) {

  let controllerOpts = options.controller ? options.controller : {};

  this.controller = new Ractive(options.view);

  if ( controllerOpts.actions ) this.controller.on( controllerOpts.actions );
  if ( controllerOpts.observe ) this.controller.observe( controllerOpts.observe );
  if ( controllerOpts.observeOnce ) this.controller.observeOnce( controllerOpts.observeOnce );

  this.controller.on = function() { throw new Error('Use the actions attribute in the route object.'); };
  this.controller.observe = function() { new Error('Use the observe attribute in the route object.'); };
  this.controller.observeOnce = function() { new Error('Use the observeOnce attribute in the route object.'); };

  if ( typeof controllerOpts.controller === 'function' ) {
    controllerOpts.controller.call(this.controller, this.routeData || {});
  }

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
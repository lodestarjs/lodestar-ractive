import { loadPage, parser} from './ajax';
import { isObject } from 'lodestar-router/src/utils/object';
import { logger }  from 'lodestar-router/src/utils/log';

function setup( options ) {

  let controllerOpts = options.controller ? options.controller : {},
    getParent = this.getParent,
    hasView = typeof options.view !== 'undefined';

  this.controllerModel = hasView ? new Ractive( options.view ) : {};

  if ( hasView ) {

    if ( controllerOpts.actions ) this.controllerModel.on( controllerOpts.actions );
    if ( controllerOpts.observe ) this.controllerModel.observe( controllerOpts.observe );
    if ( controllerOpts.observeOnce ) this.controllerModel.observeOnce( controllerOpts.observeOnce );

  }

  if ( typeof this.getParent === 'function' ) this.controllerModel.getParent = function() { return getParent().controllerModel; };

  this.controllerModel.on = function() { throw new Error('Use the actions attribute in the route object.'); };
  this.controllerModel.observe = function() { new Error('Use the observe attribute in the route object.'); };
  this.controllerModel.observeOnce = function() { new Error('Use the observeOnce attribute in the route object.'); };

  if ( typeof controllerOpts.controller) logger.warn('DEPRECATED: The controller attribute within the controller has been changed to onInit.');

  if ( typeof controllerOpts.onInit === 'function' ) {
    controllerOpts.onInit.call(this.controllerModel, this.routeData || {});
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

    if ( !options.view.template ) options.view.template = {};
    if ( typeof options.view.template === 'object' && !options.view.template.url ) options.view.template.url = options.path;

    if ( isObject(options.view.template) && options.view.template.url ) {

      if ( options.view.template.url === ( window.LodeVar.previousPath || options.view.template.url ) ) {

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

  } else {

    setup.call( this, options );

  }

}
import Router from 'lodestar-router';
import setupController from './controller';

/**
 * Constructor for the framework. It depends on Ractive as this is a POC
 * of using the router with Ractive.
 * @param {Object} options, the configuration options for the framework.
 * @returns {Void}, nothing returned
 */
function LodeRactive( options ) {

  if ( typeof Ractive === 'undefined' ) throw Error('Couldn\'t find an instance of Ractive, you need to have it in order to use this framework.');

  if ( options && typeof options.DEBUG !== 'undefined') Ractive.DEBUG = options.DEBUG;

  this.router = new Router( options );

}

/**
 * Pulling in some of the functions from the lodestar Router and
 * adding it to the frameworks prototype
 * @type {Object}
 */
LodeRactive.prototype = {

  createRoute: function ( options ) {
    this.router.createRoute({
      path: options.path,
      controller: function ( routeData ) {
        setupController.call( this, options );
        options.controller.call( this, routeData || {} );
      }
    });
  },
  notFound: function( options ) { this.router.notFound(options); }

};

export default LodeRactive;
let Promise = Promise || Ractive.Promise;

// Returns the requested element of the target doc and removes script tags
function parser( doc, options ) {

  let el = options.container ? options.container : 'body',
    regExp = new RegExp('(<[\s\/]*script\\b[^>]*>)([^>]*)(<\/script>)', 'gi');

  if ( el.indexOf('#') > -1 ) {
    return doc.getElementById( el.replace('#', '') ).innerHTML.replace(regExp, '');
  } else if ( el.indexOf('.') > -1 ) {
    return doc.getElementsByClassName( el.replace('.', '') )[0].innerHTML.replace(regExp, '');
  } else {
    return doc.getElementsByTagName( el )[0].innerHTML.replace(regExp, '');
  }

}

/**
 * Load the given url and return its contents.
 * When support for fetch increases this will probably be a lot simpler.
 * @param  {String} options, the internal url to load page content from
 * @return {Promise}, Will return a string of the page content
 */
export default function loadPage( options ) {

  return new Promise(function ( resolve, reject ) {

    let xhr;

    // code for IE7+, Firefox, Chrome, Opera, Safari, SeaMonkey
    if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
    } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    xhr.onreadystatechange = function() {

      let errorCodes = [ 404, 400, 500 ];

      if (xhr.readyState === 4 && xhr.status === 200) {
        resolve( parser( xhr.responseXML, options ) );
      } else if ( errorCodes.indexOf(xhr.status) > -1 ) {
        reject({ status: this.status, statusText: xhr.statusText });
      }

    };

    xhr.onerror = function(error) {
      reject({ status: this.status, statusText: xhr.statusText });
    };

    xhr.open( 'GET', options.url );
    xhr.responseType = 'document';
    xhr.send();

  });

}
var gobble = require( 'gobble' ),
  info = require('./package.json'),
  src = gobble( 'src' ),
  lib;

lib = gobble([
  src
    .observe( 'eslint' )
    .transform( 'rollup-babel', {
      format: 'umd',
      transform: function ( src, path ) {
        return src.replace( /<@version@>/g, info.version );
      },
      external: ['ractive'],
      entry: 'main.js',
      moduleName: 'LodeRactive',
      dest: 'lodestar-ractive.js',
      banner: `/* LodestarJS Router - ${info.version}. \nAuthor: Dan J Ford \nContributors: ${info.contributors} \nPublished: ${new Date()} \nCommit Hash: ${process.env.COMMIT_HASH || 'none'} */\n`
    })
]);

module.exports = gobble([
  lib,
  lib.transform( 'uglifyjs', { ext: '.min.js' })
]);
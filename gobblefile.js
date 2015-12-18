var gobble = require( 'gobble' ),
  info = require('./package.json'),
  src = gobble( 'src' ),
  lib,
  less = gobble( 'src/less' );

lib = gobble([
  src.observe( 'eslint' )
    .transform( 'rollup-babel', {
      format: 'cjs',
      external: ['ractive'],
      entry: 'js/main.js',
      dest: 'main.js',
      banner: `/* LodestarJS Router - ${info.version}. \nAuthor: Dan J Ford \nContributors: ${info.contributors} \nPublished: ${new Date()} \nCommit Hash: ${process.env.COMMIT_HASH || 'none'} */\n`
    }),
  less.transform( 'less', {
    src: 'base.less',
    dest: 'css/main.css'
  })
]);


module.exports = gobble([
  lib
]);
// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'space-before-function-paren': 0,
    "keyword-spacing": 0,
    "space-before-blocks": 0,
    'no-multiple-empty-lines': 0,
    'no-useless-escape': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}

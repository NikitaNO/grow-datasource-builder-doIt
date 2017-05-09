module.exports = {
  'env': {
    'browser': true,
    'node': true,
    'mocha': true,
    'jquery': true
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 8,
    'ecmaFeatures': {
      'jsx': true
    }
  },
  'plugins': [
    'react',
    'lodash',
    'security'
  ],
  'extends': [
    'eslint:recommended',
	'plugin:react/recommended',
    'plugin:lodash/canonical'
  ],
  'globals': {
    '_': false,
    'autoprefixer': false,
    'path': false
  },
  'rules': {
    'accessor-pairs': 'warn',
    'array-bracket-spacing': 'off',
    'array-callback-return': 'warn',
    'arrow-body-style': 'off',
    'arrow-parens': 'off',
    'arrow-spacing': [
      'warn',
      {
        'after': true,
        'before': true
      }
    ],
    'block-scoped-var': 'warn',
    'block-spacing': 'warn',
    'brace-style': 'off',
    'no-case-declarations': 'off',
    'callback-return': 'off',
    'camelcase': [
      'warn',
      {
        'properties': 'never'
      }
    ],
    'comma-spacing': [
      'warn',
      {
        'after': true,
        'before': false
      }
    ],
    'comma-style': [
      'warn',
      'last'
    ],
    'complexity': ['warn', 100],
    'computed-property-spacing': [
      'warn',
      'never'
    ],
    'consistent-return': 'off',
    'consistent-this': 'off',
    'curly': 'warn',
    'default-case': 'warn',
    'dot-location': [
      'warn',
      'property'
    ],
    'dot-notation': 'warn',
    'eol-last': 'off',
    'eqeqeq': 'warn',
    'func-names': 'off',
    'func-style': 'off',
    'generator-star-spacing': 'warn',
    'global-require': 'off',
    'guard-for-in': 'warn',
    'handle-callback-err': 'off',
    'id-blacklist': 'warn',
    'id-length': 'off',
    'id-match': 'warn',
    'indent': ['warn', 2, { "SwitchCase": 1}],
    'init-declarations': 'off',
    'jsx-quotes': 'warn',
    'key-spacing': 'warn',
    'keyword-spacing': [
      'warn',
      {
        'after': true,
        'before': true
      }
    ],
    'linebreak-style': [
      'warn',
      'unix'
    ],
    'lines-around-comment': 'off',
    'max-depth': 'warn',
    'max-len': 'off',
    'max-nested-callbacks': 'warn',
    'max-params': 'off',
    'max-statements': 'off',
    'max-statements-per-line': 'warn',
    'new-parens': 'warn',
    'newline-after-var': 'off',
    'newline-before-return': 'off',
    'newline-per-chained-call': 'off',
    'no-alert': 'warn',
    'no-array-constructor': 'warn',
    'no-bitwise': 'off',
    'no-caller': 'warn',
    'no-catch-shadow': 'off',
    'no-confusing-arrow': 'warn',
    'no-console': 'off',
    'no-continue': 'warn',
    'no-div-regex': 'warn',
    'no-duplicate-imports': 'warn',
    'no-else-return': 'off',
    'no-empty': [
      'warn',
      {
        'allowEmptyCatch': true
      }
    ],
    'no-empty-function': 'off',
    'no-eq-null': 'warn',
    'no-eval': 'warn',
    'no-extend-native': 'warn',
    'no-extra-bind': 'warn',
    'no-extra-label': 'warn',
    'no-extra-parens': 'off',
    'no-extra-semi': 'warn',
    'no-floating-decimal': 'warn',
    'no-implicit-globals': 'off',
    'no-implied-eval': 'warn',
    'no-inline-comments': 'off',
    'no-inner-declarations': [
      'warn',
      'functions'
    ],
    'no-invalid-this': 'off',
    'no-iterator': 'warn',
    'no-label-var': 'warn',
    'no-labels': 'warn',
    'no-lone-blocks': 'warn',
    'no-lonely-if': 'off',
    'no-loop-func': 'warn',
    'no-magic-numbers': 'off',
    'no-mixed-requires': 'warn',
    'no-multi-spaces': 'off',
    'no-multi-str': 'warn',
    'no-multiple-empty-lines': 'off',
    'no-native-reassign': 'warn',
    'no-negated-condition': 'off',
    'no-unreachable': 'warn',
    'no-new': 'warn',
    'no-new-func': 'warn',
    'no-new-object': 'warn',
    'no-new-require': 'warn',
    'no-new-wrappers': 'warn',
    'no-octal-escape': 'warn',
    'no-param-reassign': 'off',
    'no-path-concat': 'off',
    'no-plusplus': 'off',
    'no-process-env': 'off',
    'no-process-exit': 'off',
    'no-proto': 'warn',
    'no-prototype-builtins': 'off',
    'no-restricted-globals': 'warn',
    'no-restricted-imports': 'warn',
    'no-restricted-modules': 'warn',
    'no-restricted-syntax': 'warn',
    'no-return-assign': 'off',
    'no-script-url': 'warn',
    'no-self-compare': 'warn',
    'no-sequences': 'warn',
    'no-shadow': 'off',
    'no-shadow-restricted-names': 'warn',
    'no-spaced-func': 'warn',
    'no-sync': 'off',
    'no-ternary': 'off',
    'no-throw-literal': 'off',
    'no-trailing-spaces': 'warn',
    'no-undef-init': 'off',
    'no-undef': 'off',
    'no-undefined': 'off',
    'no-underscore-dangle': 'off',
    'no-unmodified-loop-condition': 'warn',
    'no-unneeded-ternary': 'off',
    'no-unsafe-finally': 'warn',
    'no-unused-expressions': 'warn',
    'no-unused-vars': 'warn',
    'no-use-before-define': 'off',
    'no-useless-call': 'warn',
    'no-useless-computed-key': 'warn',
    'no-useless-concat': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-escape': 'off',
    'no-useless-rename': 'warn',
    'no-var': 'off',
    'no-void': 'warn',
    'no-warning-comments': 'off',
    'no-whitespace-before-property': 'warn',
    'no-with': 'warn',
    'object-curly-spacing': 'off',
    'object-property-newline': [
      'warn',
      {
        'allowMultiplePropertiesPerLine': true
      }
    ],
    'object-shorthand': 'off',
    'one-var': 'off',
    'one-var-declaration-per-line': 'warn',
    'operator-assignment': 'off',
    'operator-linebreak': 'off',
    'padded-blocks': 'off',
    'prefer-arrow-callback': 'off',
    'prefer-const': 'off',
    'prefer-reflect': 'off',
    'prefer-rest-params': 'off',
    'prefer-spread': 'off',
    'prefer-template': 'off',
    'quote-props': 'off',
    'quotes': ['warn', 'single', {'avoidEscape': true, 'allowTemplateLiterals': true}],
    'radix': 'off',
    'require-jsdoc': 'off',
    'require-yield': 'warn',
    'semi': 'warn',
    'semi-spacing': 'warn',
    'sort-imports': 'off',
    'sort-vars': 'warn',
    'space-before-blocks': 'warn',
    'space-before-function-paren': 'off',
    'space-in-parens': [
      'warn',
      'never'
    ],
    'space-infix-ops': 'warn',
    'space-unary-ops': 'warn',
    'spaced-comment': 'off',
    'strict': 'off',
    'template-curly-spacing': [
      'warn',
      'never'
    ],
    'unicode-bom': [
      'warn',
      'never'
    ],
    'valid-jsdoc': 'off',
    'vars-on-top': 'off',
    'wrap-iife': ['warn', 'any'],
    'wrap-regex': 'off',
    'yield-star-spacing': 'warn',
    'yoda': [
      'warn',
      'never'
    ],
    'lodash/prefer-lodash-method': [2, {
      'ignoreObjects': ['collection', 'models', 'BPromise', 'Promise', 'React\\.Children'],
      'ignoreMethods': ['replace', 'split', 'toLower', 'toUpper']
    }],
    'lodash/prefer-filter': 'off',
    'lodash/prefer-lodash-chain': 'off',
    'lodash/prefer-constant': 'off',
    'lodash/chaining': 'off',
    'react/jsx-closing-bracket-location': [1, 'line-aligned']
  }
};

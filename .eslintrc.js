module.exports = {
  'root': true,
  'plugins': ['deprecation', 'prefer-arrow'],
  'overrides': [
    {
      'files': ['*.ts'],
      'parserOptions': {
        'ecmaVersion': 2020,
        'sourceType': 'module',
        'project': [
          'tsconfig.json',
          'e2e/tsconfig.json'
        ],
        'createDefaultProgram': true
      },
      'extends': [
        './.eslint-config-basic.js'
      ],
      'rules': {}
    },
    {
      'files': ['*.spec.ts', '*.e2e-spec.ts'],
      'extends': [
        './.eslint-config-basic.js'
      ],
      'rules': {}
    },
    {
      'files': ['*.html'],
      'extends': [
        './.eslint-config-basic.js'
      ],
      'rules': {}
    },
    {
      'files': ['*.js'],
      'extends': [
        './.eslint-config-basic.js'
      ],
      'parserOptions': {
        'ecmaVersion': 9
      },
      'env': {
        'node': true,
        'es6': true
      },
      'rules': {}
    }
  ]
};

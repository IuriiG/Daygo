module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'import'],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'prettier'
    ],
    env: {
        browser: true,
        es2020: true
    },
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: './tsconfig.base.json',
        sourceType: 'module',
        ecmaVersion: 2020
    },
    settings: {
        'import/parsers': {
            '@typescript-eslint/parser': ['.ts', '.tsx']
        },
        'import/resolver': {
            typescript: true
        },
        react: {
            version: 'detect'
        }
    },
    rules: {
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/consistent-type-imports': [
            'error',
            { prefer: 'type-imports' }
        ],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-inferrable-types': [
            'error',
            { ignoreParameters: true }
        ],
        'import/default': 'off',
        'import/export': 'off',
        'import/namespace': 'off',
        'import/newline-after-import': 'error',
        'import/no-cycle': 'off',
        'import/no-duplicates': 'off',
        'import/no-named-as-default-member': 'off',
        'import/no-unresolved': ['error', { ignore: ['^@daygo/'] }],
        'import/no-unused-modules': ['off', { unusedExports: true }],
        'import/order': [
        'error',
        {
            groups: [
                'builtin',
                'external',
                'internal',
                'parent',
                'sibling',
                'index',
                'object',
                'type'
            ]
        }
        ],
        'no-redeclare': 'off',
        'no-shadow': 'error',
        'no-trailing-spaces': 'error',
        'eol-last': ["error", "always"],
        'comma-dangle': ['error', 'never'],
        'object-curly-spacing': ["error", "always"],
        'semi': ["error", "always"],
        'indent': ['error', 'tab'],
        'no-multiple-empty-lines': 'error',
        'sort-imports': ['error', { ignoreDeclarationSort: true }]
    },
    overrides: [
        {
            files: ['**/*.test.{ts,tsx}'],
            rules: {
                '@typescript-eslint/no-unnecessary-condition': 'off'
            }
        }
    ]
};

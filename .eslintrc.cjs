module.exports = {
    root: true,
    env: {
        node: true,
        browser: true,
        es2021: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/typescript/recommended',
        'plugin:prettier/recommended'
    ],
    parserOptions: {
        ecmaVersion: 2021,
        parser: '@typescript-eslint/parser'
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'vue/multi-word-component-names': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
        'prettier/prettier': [
            'error',
            {
                singleQuote: true,
                semi: true,
                trailingComma: 'none',
                printWidth: 100,
                tabWidth: 2,
                endOfLine: 'auto',
                useTabs: false,
                bracketSpacing: true,
                arrowParens: 'avoid'
            }
        ]
    }
}; 
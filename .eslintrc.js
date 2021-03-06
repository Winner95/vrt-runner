module.exports = {
    env: {
        es6: true,
        node: true,
    },
    extends: ['eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'prettier'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'babel', 'prettier'],

    rules: {
        'prettier/prettier': 2,
        'no-unused-vars': 0,
    },
};

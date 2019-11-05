module.exports = {
    root: true,
    extends: "@piloteers/eslint-config/ts-common",
    parserOptions: {
        // The option below may be disabled in case of performance issues (possible caching issues may however arise depending on the IDE)
        createDefaultProgram: false
    },
    rules: {}
};

module.exports = () => {
    return {
        autoDetect: true,

        testFramework: {
            configFile: './test/jest-e2e.json',
        },
    };
};

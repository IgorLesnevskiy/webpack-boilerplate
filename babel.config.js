module.exports = {
    presets: [
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                //
                //     modules: false,
                //     debug: false,
            },
        ],
    ],
    //
    plugins: [
        '@babel/plugin-transform-runtime',
    ],
};

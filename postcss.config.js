const autoprefixer = require('autoprefixer');
const mqpacker = require('css-mqpacker');
const lost = require('lost');


// (file, options, env)
module.exports = () => {
    return {
        plugins: [
            autoprefixer(),

            mqpacker({
                sort: true,
            }),

            lost
        ],
    };
};

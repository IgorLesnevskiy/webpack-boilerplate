const webfontsGenerator = require('webfonts-generator');
const path = require('path');
const fs = require('fs');

const svgFiles = fs.readdirSync('src/webfont-icons').filter(file => {
    return !fs.lstatSync(`src/webfont-icons/${file}`).isDirectory()
        && path.extname(file) === '.svg';
}).map(f => `src/webfont-icons/${f}`);

webfontsGenerator({
    files: [
        ...svgFiles
    ],
    dest: 'src/fonts/webfont',
    fontName: 'webfont',
    css: true,
    cssDest: 'src/styles/start/webfont.scss',
    cssTemplate: 'src/utilities/webfont-template.scss.hbs',
    types: ['woff', 'woff2'],
    templateOptions: {
        classPrefix: 'webfont-icon--',
        baseSelector: '.webfont-icon',
    },
    fileName: '[fontname].[ext]',
    normalize: true,
    centerHorizontally: true,
    prependUnicode: true,
    fontHeight: 1001,
    writeFile: false,
}, function(error) {
    if (error) {
        console.log('Webfont\'s generating was failed!', error);
    } else {
        console.log('Webfont has been generated!');
    }
})
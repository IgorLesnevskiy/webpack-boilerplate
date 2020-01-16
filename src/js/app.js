import '../styles/app.scss';

import modernizr from 'modernizr';

const AppModule = function () {
	return {
		init() {}
	};
};

const app = new AppModule();

window.addEventListener('load', () => {
	app.init();
});

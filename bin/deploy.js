const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
const config = require('../deploy.config.js');

ftpDeploy.deploy(config)
	.then(res => console.log('finished:', res))
	.catch(err => console.log(err))

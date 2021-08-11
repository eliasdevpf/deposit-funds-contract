require('dotenv').config()
require('@nomiclabs/hardhat-waffle')
require('hardhat-watcher')
require('solidity-coverage')

module.exports = {
	solidity: '0.8.6',
	watcher: {
		test: {
			tasks: ['test'],
			files: ['./contracts']
		}
	},
	networks: {
		hardhat: {},
		localhost: {
			url: 'http://127.0.0.1:8545'
		}
	}
}

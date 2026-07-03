# Load variables from .env
include .env
export

run:
	npm start

node:
	nvm install $(NODE_VERSION)
	nvm use $(NODE_VERSION)
	npm update npm -g
	npm install -g npm-check-updates
	npm install -g firebase-tools

update:
	rm -rf node_modules
	rm -f package-lock.json
	ncu
	ncu -u
	npm install

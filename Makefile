.PHONY: default help

default: help
help:
	@echo "Check Makefile to choose command"


.PHONY: pretty lint test
pretty: 
	@echo "Run mandatory check of code quality"
	@npx prettier --config .prettierrc 'src/*.ts' --write
lint:
	@echo "Run mandatory check of code quality"
	@npx tslint -c tslint.yaml 'src/*.ts'  -e \"node_modules\"

.PHONY: test test-client test-server
test:
	$(MAKE) test-client
	$(MAKE) test-server
test-client:
	@echo "Run tests client"
# @npm run test --prefix ./client/
test-server:
	@echo "Run tests server"
	@npx newman run ./tests/api/testCollection.json


.PHONY: install start
install: install-npm-root install-npm-client 
start-client:
	@echo "Starting client"
	@npm run dev --prefix client/
start-server:
	@echo "Starting server"
	@npx nodemon --exec npx ts-node server/server.ts
start-sensor-ecg:
	@echo "Starting ECG sensor"
	@node sensor/sensor.js ./config/ecg_config
start-sensor-resp:
	@echo "Starting Respiration sensor"
	@node sensor/sensor.js ./config/respiration_config
start-sensor-temperature:
	@echo "Starting Respiration sensor"
	@npx nodemon --exec npx node sensor/sensor.js ./config/temperature_config
install-npm-root:
	@echo "Run npm install"
	@rm -rf node_modules
	@npm install
install-npm-client:
	@echo "Run npm install client"
	@rm -rf client/node_modules
	@npm install --prefix ./client/
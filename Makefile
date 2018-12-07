# This is a makefile to ease the process of installing/running the webgui locally
# If you need additional assistance in using this system, please type the following command into
# console:
# 	make help

# Specify the port 
.PHONY: test start

PORT ?= 3000

install: 	## Install node deps
	npm install

start: install ## Start the local webserver for testing on PORT
	nodemon ./app.js localhost $(PORT)

test:    ## Run unit tests on js implementations of cilantro
	npm test

help:           ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

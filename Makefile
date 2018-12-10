# This is a makefile to ease the process of installing/running the webgui locally
# If you need additional assistance in using this system, please type the following command into
# console:
# 	make help

# Specify the port 
.PHONY: test start

PORT ?= 3000

schemas:    ## Compile the capnp schemas into js format
	cd capnp-schemas && capnpc -o js transaction.capnp && mv transaction.capnp.js ../public/javascripts/

adddeps:    ## Download/install all dependencies
	npm install

install: adddeps test 	## Install deps and run tests

start: install ## Start the local webserver for testing on PORT
	nodemon ./app.js localhost $(PORT)

test:    ## Run unit tests on js implementations of cilantro
	npm test

help:           ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

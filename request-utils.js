'use strict';

const request = require('request-promise-native');
const delay = require('delay');

module.exports = RED => {

    function ComesAvailable(config) {
        RED.nodes.createNode(this, config);
        let node = this;

        let completeTimeout = parseInt(config.completeTimout);
        let successStatusCode = parseInt(config.successStatusCode);
        let timoutPerRequest = parseInt(config.timoutPerRequest);
        let url = config.url;

        let requestObject = {
            method: 'HEAD',
            url: url,
            timeout: timoutPerRequest * 1000,
            resolveWithFullResponse: true
        };

        node.on("input", async msg => {
            let timeElapsed = 0;
            while (timeElapsed < completeTimeout) {
                try {
                    timeElapsed += timoutPerRequest;
                    let response = await request(requestObject);
                    if (successStatusCode === response.statusCode) {
                        node.send([msg, null]);
                        return;
                    }
                } catch (ex) {
                    // Do nothing in the exception case as to try over
                    await delay(timoutPerRequest * 1000);
                }
            }

            node.send([null, msg]);
        });
    }

    RED.nodes.registerType("comes-available", ComesAvailable);

};
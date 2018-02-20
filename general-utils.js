module.exports = function (RED) {

    function Toggle(config) {
        RED.nodes.createNode(this, config);
        let node = this;
        let wasActive = false;

        node.on("input", function (msg) {
            if(msg.set) {
                wasActive = msg.set ? true : false;
            }

            if(msg.reset) {
                wasActive = false;

                if(msg.proceed === false) {
                    return;
                }
            }

            if (!wasActive) {
                wasActive = true;
                node.send([msg, null]);
            } else {
                wasActive = false;
                node.send([null, msg]);
            }
        });
    }

    RED.nodes.registerType("toggle", Toggle);

};
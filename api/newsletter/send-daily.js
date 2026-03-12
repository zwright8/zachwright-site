const sendModule = require("./send");

module.exports = async function handler(req, res) {
    return sendModule.runSendHandler(req, res, {
        forcedCadence: sendModule.CADENCE_DAILY
    });
};

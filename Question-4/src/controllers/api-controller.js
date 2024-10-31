const rateLimiterService = require('../services/rate-limiter-service');
const apiService = require('../services/api-service');

async function handleApiRequest(req, res) {
    const input = req.params.input;
    const resultMessage = await rateLimiterService.makeApiCall(apiService.callExternalApi, input);
    res.send(resultMessage);
}

module.exports = {
    handleApiRequest
};

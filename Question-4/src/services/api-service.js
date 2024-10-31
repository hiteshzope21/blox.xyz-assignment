const axios = require('axios');
const logger = require('../utils/logger');

async function callExternalApi(input) {
    try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${input}`);
        logger.log(`API response for input ${input}: ${JSON.stringify(response.data)}`);
    } catch (error) {
        logger.error(`Error calling API for input ${input}: ${error.message}`);
    }
}

module.exports = {
    callExternalApi
};

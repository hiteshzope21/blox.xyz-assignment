const { MAX_CALLS_PER_MINUTE, PENALTY_DURATION } = require('../config/settings');
const logger = require('../utils/logger');

class RateLimiterService {
    constructor() {
        this.callsMade = 0;
        this.penaltyActive = false;
        this.callQueue = [];
        this.startRateLimitReset();
    }

    startRateLimitReset() {
        setInterval(() => this.resetCalls(), 60000); // Reset every minute
    }

    resetCalls() {
        if (this.penaltyActive) {
            this.penaltyActive = false;
            logger.log("Penalty period has ended. Resuming API calls.");
        }
        this.callsMade = 0;
        this.processQueue();
    }

    async makeApiCall(apiCall, input) {
        if (this.penaltyActive) {
            logger.log(`Penalty active. Cannot make API call for input: ${input}`);
            return `Penalty active. Please wait ${PENALTY_DURATION / 1000} seconds before retrying.`;
        }

        if (this.callsMade < MAX_CALLS_PER_MINUTE) {
            // Under the limit, call the API
            await apiCall(input);
            this.callsMade++;
            return `API call for input ${input} was successful.`;
        } else {
            // Queue the call if limit is reached
            logger.log(`Limit reached. Queuing call for input: ${input}`);
            this.callQueue.push({ apiCall, input });
            return `Rate limit exceeded. Your request has been queued and will be processed shortly.`;
        }
    }

    async processQueue() {
        while (this.callQueue.length > 0 && this.callsMade < MAX_CALLS_PER_MINUTE) {
            const { apiCall, input } = this.callQueue.shift();
            await this.makeApiCall(apiCall, input);
        }

        if (this.callQueue.length > 0 && this.callsMade >= MAX_CALLS_PER_MINUTE) {
            this.activatePenalty();
        }
    }

    activatePenalty() {
        this.penaltyActive = true;
        logger.log("Penalty activated due to limit exceedance.");
        setTimeout(() => this.resetCalls(), PENALTY_DURATION);
    }
}

module.exports = new RateLimiterService();

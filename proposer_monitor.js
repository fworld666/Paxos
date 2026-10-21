class ProposerMonitor {
    constructor(threshold = 3) {
        this.threshold = threshold;
        this.proposalHistory = [];
        this.warningReported = false;
    }

    record(proposalNumber) {
        this.proposalHistory.push(proposalNumber);

        console.log(
            `Proposer monitor: recorded proposal ${proposalNumber}`
        );

        if (
            this.proposalHistory.length >= this.threshold &&
            !this.warningReported
        ) {
            console.warn(
                "PROPOSER CHURN DETECTED: excessive proposals generated."
            );

            console.warn(
                "Consider stabilising the leader or using Multi-Paxos."
            );

            this.warningReported = true;
        }
    }
}

module.exports = ProposerMonitor;

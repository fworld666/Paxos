const Proposal = require("./proposal");
const ProposerMonitor = require("./proposer_monitor");

class Proposer {
    constructor(id) {
        this.id = id;
        this.proposalNumber = 100;
        this.monitor = new ProposerMonitor(3);
    }

    nextProposal(value) {
        this.proposalNumber++;

        this.monitor.record(this.proposalNumber);

        return new Proposal(
            this.proposalNumber,
            value
        );
    }
}

module.exports = Proposer;
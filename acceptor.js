class Acceptor {

    constructor(id) {

        this.id = id;
        this.highestPromised = 0;
        this.acceptedProposal = null;
        this.online = true;
        this.stateWasPreviouslyStored = false;
    }

    fail() {
        this.online = false;
    }

    recover() {
        this.online = true;
    }

    prepare(number) {

        if (!this.online) {
            console.log(`${this.id} OFFLINE`);
            return null;
        }

        if (number > this.highestPromised) {
            this.highestPromised = number;
            this.stateWasPreviouslyStored = true;

            if (this.acceptedProposal) {
                console.log(`${this.id} reports previously accepted:`);
                console.log(`(${this.acceptedProposal.number}, ${this.acceptedProposal.value})`);
            }

            return {
                type: "PROMISE",
                acceptor: this.id,
                proposalNumber: number,
                accepted: this.acceptedProposal
            };
        }

        return null;
    }

    accept(proposal) {

        if (!this.online) {
            console.log(`${this.id} OFFLINE`);
            return null;
        }

        if (proposal.number >=this.highestPromised) {
            this.highestPromised = proposal.number;
            this.acceptedProposal = proposal;
            this.stateWasPreviouslyStored = true;

            return {
                type: "ACCEPTED",
                acceptor: this.id,
                proposal
            };
        }
        console.log(`${this.id} REJECTED proposal ${proposal.number}`);

        return null;
    }
    checkStateLoss() {
    const stateLost =
        this.stateWasPreviouslyStored &&
        this.highestPromised === 0 &&
        this.acceptedProposal === null;

    if (stateLost) {
        console.error(`${this.id}: STATE LOSS DETECTED`);
        return true;
    }

    return false;
    }
}

module.exports = Acceptor;
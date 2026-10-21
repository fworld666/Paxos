const Quorum = require("./quorum");
const AuditLogger = require("./audit_logger");

class Simulator {
    constructor(proposer, acceptors, learners) {
        this.proposer = proposer;
        this.acceptors = acceptors;
        this.learners = learners;

        this.quorum = new Quorum(acceptors.length);
        this.audit = new AuditLogger();
    }

    run(value) {
        console.log("\n====================");
        console.log(`Proposal Value = ${value}`);
        console.log("====================");

        console.log(`Acceptors: ${this.acceptors.length}`);
        console.log(`Required Quorum: ${this.quorum.majority()}`);
        console.log("");

        this.audit.record("RUN_STARTED", {
            proposer: this.proposer.id,
            proposedValue: value,
            acceptorCount: this.acceptors.length,
            requiredQuorum: this.quorum.majority()
        });

        // Task 8.3: check whether a majority is online.
        const onlineCount = this.acceptors.filter(
            acceptor => acceptor.online
        ).length;

        console.log(`Online Acceptors: ${onlineCount}`);

        this.audit.record("ONLINE_ACCEPTORS_CHECKED", {
            onlineCount,
            requiredQuorum: this.quorum.majority()
        });

        if (!this.quorum.reached(onlineCount)) {
            console.log("MAJORITY LOST");
            console.log("New proposals disabled");

            this.audit.record("MAJORITY_LOST", {
                onlineCount,
                requiredQuorum: this.quorum.majority()
            });

            return;
        }

        // Generate a proposal.
        const proposal = this.proposer.nextProposal(value);

        this.audit.record("PROPOSAL_CREATED", {
            proposer: this.proposer.id,
            proposalNumber: proposal.number,
            value: proposal.value
        });

        // PREPARE phase: request promises from acceptors.
        const promises = [];

        for (const acceptor of this.acceptors) {
            const response = acceptor.prepare(proposal.number);

            if (response) {
                promises.push(response);

                console.log(`${acceptor.id} PROMISE`);

                this.audit.record("PROMISE_RECEIVED", {
                    acceptor: acceptor.id,
                    proposalNumber: proposal.number,
                    previouslyAccepted: response.accepted
                });
            } else {
                this.audit.record("PROMISE_NOT_RECEIVED", {
                    acceptor: acceptor.id,
                    proposalNumber: proposal.number
                });
            }
        }

        console.log(
            `Promises Received: ${promises.length}/${this.acceptors.length}`
        );

        const prepareQuorumReached =
            this.quorum.reached(promises.length);

        this.audit.record("PREPARE_QUORUM_CHECK", {
            promisesReceived: promises.length,
            requiredQuorum: this.quorum.majority(),
            quorumReached: prepareQuorumReached
        });

        if (!prepareQuorumReached) {
            console.log("FAILED: no quorum of promises");

            this.audit.record("PROPOSAL_FAILED", {
                stage: "PREPARE",
                reason: "No quorum of promises",
                proposalNumber: proposal.number
            });

            return;
        }

        // Paxos safety: preserve the highest-numbered accepted value.
        let highestAccepted = null;

        for (const promise of promises) {
            if (promise.accepted) {
                if (
                    highestAccepted === null ||
                    promise.accepted.number > highestAccepted.number
                ) {
                    highestAccepted = promise.accepted;
                }
            }
        }

        if (highestAccepted) {
            console.log("\nPREVIOUSLY ACCEPTED VALUE FOUND");
            console.log(`Proposal ${highestAccepted.number}`);
            console.log(`Value = ${highestAccepted.value}`);
            console.log("Overriding proposer value to preserve safety");

            this.audit.record("PREVIOUSLY_ACCEPTED_VALUE_FOUND", {
                proposalNumber: highestAccepted.number,
                value: highestAccepted.value
            });

            proposal.value = highestAccepted.value;
        }

        // ACCEPT phase.
        const accepted = [];

        for (const acceptor of this.acceptors) {
            const response = acceptor.accept(proposal);

            if (response) {
                accepted.push(response);

                console.log(`${acceptor.id} ACCEPTED`);

                this.audit.record("VALUE_ACCEPTED", {
                    acceptor: acceptor.id,
                    proposalNumber: proposal.number,
                    value: proposal.value
                });
            } else {
                this.audit.record("VALUE_NOT_ACCEPTED", {
                    acceptor: acceptor.id,
                    proposalNumber: proposal.number,
                    value: proposal.value
                });
            }
        }

        console.log(
            `Acceptances Received: ${accepted.length}/${this.acceptors.length}`
        );

        const acceptQuorumReached =
            this.quorum.reached(accepted.length);

        this.audit.record("ACCEPT_QUORUM_CHECK", {
            acceptancesReceived: accepted.length,
            requiredQuorum: this.quorum.majority(),
            quorumReached: acceptQuorumReached
        });

        if (!acceptQuorumReached) {
            console.log("FAILED: no quorum of accepts");

            this.audit.record("PROPOSAL_FAILED", {
                stage: "ACCEPT",
                reason: "No quorum of accepts",
                proposalNumber: proposal.number,
                value: proposal.value
            });

            return;
        }

        // LEARN phase: a quorum has accepted the proposal.
        console.log(`VALUE CHOSEN: ${proposal.value}`);

        this.audit.record("VALUE_CHOSEN", {
            proposalNumber: proposal.number,
            value: proposal.value
        });

        for (const learner of this.learners) {
            learner.learn(proposal.value);
        }

        this.audit.record("LEARNERS_NOTIFIED", {
            value: proposal.value,
            learnerCount: this.learners.length
        });
    }
}

module.exports = Simulator;
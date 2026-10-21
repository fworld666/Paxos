const Acceptor = require("../../acceptor");

console.log("\n====================");
console.log("SCENARIO: STATE LOSS");
console.log("====================");

const a1 = new Acceptor("A1");

/*
 * Simulate previously stored state.
 */
a1.acceptedProposal = {
    number: 101,
    value: "instances=10"
};

a1.highestPromised = 101;
a1.stateWasPreviouslyStored = true;

console.log("\nBefore Loss:");
console.log(a1);

/*
 * Simulate disk loss.
 */
a1.acceptedProposal = null;
a1.highestPromised = 0;

console.log("\nAfter Loss:");
console.log(a1);

console.log("\nChecking state integrity...");

const detected = a1.checkStateLoss();

if (detected) {
    console.log("WARNING: Acceptor forgot previous history.");
    console.log("Paxos safety assumption may be violated.");
} else {
    console.log("State check passed.");
}
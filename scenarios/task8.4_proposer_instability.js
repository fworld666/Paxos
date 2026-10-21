const Proposer = require("../proposer");

console.log("\n====================================");
console.log("TASK 8.4: DETECT PROPOSER INSTABILITY");
console.log("====================================");

const proposer1 = new Proposer("P1");
const proposer2 = new Proposer("P2");

console.log("\nP1 generates proposals:");
proposer1.nextProposal("value-A");
proposer1.nextProposal("value-B");
proposer1.nextProposal("value-C");

console.log("\nP2 generates proposals:");
proposer2.nextProposal("value-X");
proposer2.nextProposal("value-Y");
proposer2.nextProposal("value-Z");

console.log("\nP1 proposal history:");
console.log(proposer1.monitor.proposalHistory);

console.log("\nP2 proposal history:");
console.log(proposer2.monitor.proposalHistory);

console.log("\nTASK 8.4 TEST COMPLETE");

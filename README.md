# Paxos

## Overview

This workshop extends the Paxos simulator with additional mechanisms to improve fault detection, quorum handling, proposer monitoring, and audit logging.

## Tasks 8.2–8.5

### Task 8.2: Detect Acceptor State Loss

- **Modified:** `acceptor.js`
- **Added:** A state integrity check to detect unexpected loss of previously stored acceptor state.
- **Added:** `scenarios/breaking_assumptions/state_loss.js` to simulate a state reset.
- **Result:** The scenario reports `STATE LOSS DETECTED` when the expected state is missing.

*Note: This simulates state-loss detection; it does not implement persistent storage across real process restarts.*

### Task 8.3: Handle Majority Loss

- **Modified:** `simulator.js`
- **Added:** A quorum availability check before creating a new proposal.
- **Added:** `scenarios/breaking_assumptions/majority_loss.js` to simulate insufficient online acceptors.
- **Result:** When the number of online acceptors falls below the required quorum, the simulator reports `MAJORITY LOST` and disables new proposals.

### Task 8.4: Detect Proposer Instability

- **Added:** `scenarios/task8.4_proposer_instability.js`
- **Added:** A `ProposerMonitor` to track proposal numbers and detect excessive proposal generation.
- **Configured:** A threshold of three proposals.
- **Result:** The scenario reports `PROPOSER CHURN DETECTED` when a proposer's proposal count reaches the threshold.

*Note: This is a simplified proposal-count simulation, not a time-based measurement of real concurrent proposer activity.*

### Task 8.5: Add Audit Logging

- **Added:** `audit_logger.js`
- **Modified:** `simulator.js` to record important protocol events.
- **Logged events include:**
  - Simulation start
  - Online acceptor and quorum checks
  - Proposal creation
  - Promise responses
  - Previously accepted values
  - Accept quorum checks
  - Chosen values
  - Learner notifications
  - Proposal failures and majority loss
- **Output:** Events are printed to the terminal and appended to `audit.log` in JSON format.

## Running the Scenarios

Run the following commands from the project directory:

```bash
# Task 8.2: Detect acceptor state loss
node scenarios/breaking_assumptions/state_loss.js

# Task 8.3: Simulate majority loss
npm run majority-loss

# Task 8.4: Detect proposer instability
node scenarios/task8.4_proposer_instability.js

# Task 8.5: Test successful execution and audit logging
npm run happy

# Task 8.5: Test majority-loss logging
npm run majority-loss

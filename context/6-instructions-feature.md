### Instructions Phase (Post-Raffle Redistribution)

**Overview**

* After all gifts have been initially assigned to participants, the application must enter a new phase called **“Instructions Phase”**.
* This phase introduces a second layer of interaction where gifts may be **redistributed based on predefined instructions**, adding surprise and fun to the raffle.

**Requirements**

* Each participant must receive **one instruction** during this phase.
* The order in which participants receive instructions must follow the **original raffle selection order** (i.e., the order in which participants were drawn).
* Instructions are assigned **one at a time**, triggered by clicking the **“Assign Instruction”** button.

**Behavior**

* When clicking **“Assign Instruction”**:

  * The next participant in the original draw order is selected.
  * One instruction is assigned to that participant.
* Instructions must be loaded from a **configurable list**, preferably from an **external JSON file**.
* Instructions may cause the participant to:

  * Exchange their gift with another participant.
  * Pass their gift to someone else.
  * Receive a different gift based on the instruction logic.
* As a result, the participant **may not keep their originally assigned gift**.
* The system must ensure:

  * No gift is duplicated.
  * No gift is lost.
  * All participants end the phase with exactly **one gift**.

**State Management Considerations**

* The application must clearly distinguish between:

  * **Initial gift assignment phase**
  * **Instructions phase**
* Gift ownership changes must be **traceable and deterministic**, even if triggered by instructions.

**UX Considerations**

* Clearly indicate:

  * The current phase (*Raffle* vs *Instructions*).
  * The current participant receiving an instruction.
* Display:

  * The participant’s **current gift**.
  * The **instruction received**.
  * The **resulting gift after applying the instruction**.
* Disable instruction assignment once all participants have received an instruction.

**Optional Enhancements**

* Show an animation when gifts are redistributed.
* Display a final **“Gift Summary”** after all instructions are applied.
* Allow replaying the Instructions Phase without re-running the initial raffle.
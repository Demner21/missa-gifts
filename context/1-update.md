### Participant Naming Enhancement

**Requirement**

* The application must allow **each participant to have a custom name** for better interaction and engagement.
* Participants should be able to **enter their own names or nicknames** before the raffle starts.
* Each participant’s name must be displayed during:

  * The gift assignment process
  * The final list of winners

**Constraints**

* Participant names are stored **in memory only**.
* Names should be **editable before the raffle begins**, but **locked once the raffle starts** to avoid inconsistencies.

**Optional Improvements**

* Validate names (e.g., non-empty, max length).
* Provide a default placeholder name (e.g., *Participant 1*, *Participant 2*) if no name is entered.

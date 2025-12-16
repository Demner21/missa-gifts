### Quick Raffle Selection

**Requirement**

* The application must provide a mechanism to select a **raffle type**.
* Each raffle type must **automatically load and assign a predefined set of participants** for the selected raffle.

**Behavior**

* When a raffle type is selected, the application should:

  * Automatically populate the participant list associated with that raffle.
* Example:

  * Selecting **“Initial Raffle”** loads a predefined list of **six participants**.
  * Selecting **“Primary Raffle”** loads a predefined list of **nine participants**.

**UX Considerations**

* Provide a **simple and intuitive selector** (e.g., dropdown, toggle, or radio buttons) to switch between raffle types.
* Clearly indicate the **currently selected raffle type**.
* Changing the raffle type should **reset the current raffle state** (participants, gifts, and results), or prompt the user for confirmation.

**Optional Enhancements**

* Allow raffle types to be **configured via a data file or configuration object**.
* Display a short description for each raffle type (e.g., purpose or participant count).
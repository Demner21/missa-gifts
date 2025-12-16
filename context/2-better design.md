### Dynamic Winner Selection (Roulette-Style)

**Requirement**

* The process of selecting a winner should be **more dynamic and exciting**, instead of an instant random selection.
* When the user clicks the **“Draw Next Gift”** button, the application should display a **roulette-style animation** that cycles through the remaining participants.
* The roulette must **visually highlight participant names** while spinning and gradually slow down before stopping on the selected winner.

**Behavior**

* Only **remaining participants** (not yet selected) should appear in the roulette.
* Once the roulette stops:

  * The selected participant is declared the winner of the current gift.
  * The participant is removed from the remaining participants list.
* The final winner must still be determined by a **fair random selection**, with the animation acting as a visual effect.

**UX Considerations**

* Disable the **“Draw Next Gift”** button while the roulette animation is running.
* Clearly show the **current gift being drawn**.
* Provide a short visual or sound cue when the winner is selected (optional).

**Optional Enhancements**

* Adjustable spin duration.
* Simple easing effect (fast → slow).
* Confetti or celebration animation when a winner is chosen.
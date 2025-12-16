### Random Gift Selection Order

**Requirement**

* The order in which gifts are selected must be **random**, instead of strictly sequential.
* Rather than always starting with *Gift 1* and continuing to *Gift N*, the application should:

  * Randomly select a gift from the list of **remaining (unassigned) gifts** for each draw.

**Behavior**

* Only gifts that have **not yet been assigned** may be selected.
* Once a gift is assigned to a participant:

  * It is removed from the pool of available gifts.
  * It cannot be selected again.
* The random gift selection must be **fair and unbiased**.

**UX Considerations**

* Clearly display the **current gift** being drawn.
* Optionally show a visual cue (e.g., shuffle animation or highlight) when the gift is randomly selected.

**Optional Enhancements**

* Allow toggling between **sequential** and **random** gift selection modes.
* Visually display the list of remaining gifts in a shuffled order.

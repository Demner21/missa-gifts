### 🎁 Gift Raffle Application – Prompt

**Goal**
I need to create a simple web application that allows me to run a gift raffle.

**Functional Requirements**

* Each gift has a unique number or identifier.
* There are **15 gifts in total**, but this number must be configurable.
* There are **15 participants in total**, also configurable.
* Gift assignment must be **random**.
* When selecting a winner for a gift:

  * The selected participant must be **removed from the pool** of participants.
  * The removed participant must **not be eligible** for the remaining gifts.
* Each gift can be assigned to **only one participant**, and each participant can win **only one gift**.

**Non-Functional Requirements**

* The application should be **simple and lightweight**.
* No backend persistence is required (in-memory state is sufficient).
* The UI should clearly display:

  * Remaining participants
  * Remaining gifts
  * Assigned gifts and winners

**Technology Stack & Constraints**

* The application will be **deployed on Vercel**.
* Use the following stack:

  * **Node.js (latest version)**
  * **Vite**
  * **TypeScript**
  * **Vue 3 (Composition API preferred)**

**Optional Enhancements (Nice to Have)**

* Ability to reset the raffle.
* Basic animations or transitions when selecting a winner.
* Simple responsive layout for desktop and mobile.

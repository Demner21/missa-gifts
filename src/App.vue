<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-title">
        <h1>🎁 Gift Raffle</h1>
        <p>Randomly assign unique gifts to participants with no repeats.</p>
      </div>
      <div class="badge">
        <span class="badge-dot" />
        <span>In-memory · Vite + Vue 3 + TS</span>
      </div>
    </header>

    <section class="controls">
      <div class="field-group">
        <span class="field-label">Gifts</span>
        <div class="field-input">
          <span>Total</span>
          <input
            type="number"
            min="1"
            max="500"
            v-model.number="giftCount"
            :disabled="raffleStarted"
          />
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">Participants</span>
        <div class="field-input">
          <span>Total</span>
          <input
            type="number"
            min="1"
            max="500"
            v-model.number="participantCount"
            :disabled="raffleStarted"
          />
        </div>
        <p v-if="participantCount < giftCount" class="error-text">
          Participants should be ≥ gifts to avoid unassigned gifts.
        </p>
      </div>

      <div class="buttons">
        <button
          class="btn btn-primary"
          type="button"
          @click="drawNext"
          :disabled="isDrawDisabled"
        >
          <span>Draw next gift</span>
        </button>
        <button
          class="btn btn-secondary"
          type="button"
          @click="resetRaffle"
        >
          Reset raffle
        </button>
      </div>
    </section>

    <section class="layout">
      <div class="column">
        <header class="column-header">
          <h2 class="column-title">Participants</h2>
          <span class="column-count">{{ remainingParticipants.length }}</span>
        </header>
        <ul v-if="remainingParticipants.length" class="list">
          <li
            v-for="p in remainingParticipants"
            :key="p.id"
            class="list-item"
          >
            <span>#{{ p.id }}</span>
            <template v-if="!raffleStarted">
              <input
                class="name-input"
                type="text"
                v-model="p.name"
                :placeholder="`Participant ${p.id}`"
                maxlength="40"
              />
            </template>
            <template v-else>
              <span>{{ displayParticipantName(p.id, p.name) }}</span>
            </template>
          </li>
        </ul>
        <p v-else class="empty">No participants left.</p>
      </div>

      <div class="column">
        <header class="column-header">
          <h2 class="column-title">Remaining gifts</h2>
          <span class="column-count">{{ remainingGifts.length }}</span>
        </header>
        <ul v-if="remainingGifts.length" class="list">
          <li
            v-for="g in remainingGifts"
            :key="g.id"
            class="list-item"
          >
            <span>#{{ g.id }}</span>
            <span>{{ g.label }}</span>
          </li>
        </ul>
        <p v-else class="empty">All gifts have been assigned.</p>

        <div
          v-if="lastWinner"
          class="winner-card"
          :class="{ animate: winnerAnimate }"
        >
          <span class="winner-label">Last draw</span>
          <div class="winner-main">
            <span class="winner-name">{{ lastWinner.participantName }}</span>
            <span class="winner-gift">won {{ lastWinner.giftLabel }}</span>
          </div>
        </div>
      </div>

      <div class="column">
        <header class="column-header">
          <h2 class="column-title">Assigned gifts</h2>
          <span class="column-count">{{ assignments.length }}</span>
        </header>
        <table v-if="assignments.length" class="assignments-table">
          <thead>
            <tr>
              <th>Gift</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in assignments" :key="a.giftId">
              <td>
                <span class="pill">
                  <span class="pill-label">Gift</span>
                  <span class="pill-value">#{{ a.giftId }}</span>
                </span>
                &nbsp;{{ a.giftLabel }}
              </td>
              <td>
                <span class="pill">
                  <span class="pill-label">Participant</span>
                  <span class="pill-value">#{{ a.participantId }}</span>
                </span>
                &nbsp;{{ a.participantName }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">No assignments yet. Draw your first gift!</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

type Participant = { id: number; name: string };
type Gift = { id: number; label: string };

type Assignment = {
  giftId: number;
  giftLabel: string;
  participantId: number;
  participantName: string;
};

const giftCount = ref(15);
const participantCount = ref(15);

const remainingParticipants = ref<Participant[]>([]);
const remainingGifts = ref<Gift[]>([]);
const assignments = ref<Assignment[]>([]);

const raffleStarted = ref(false);
const lastWinner = ref<Assignment | null>(null);
const winnerAnimate = ref(false);

const isDrawDisabled = computed(() => {
  if (participantCount.value < giftCount.value) return true;
  if (!remainingParticipants.value.length) return true;
  if (!remainingGifts.value.length) return true;
  return false;
});

function displayParticipantName(id: number, rawName: string): string {
  const trimmed = rawName.trim();
  if (!trimmed) return `Participant ${id}`;
  return trimmed;
}

function initPools() {
  remainingParticipants.value = Array.from({ length: participantCount.value }, (_, i) => ({
    id: i + 1,
    name: '',
  }));

  remainingGifts.value = Array.from({ length: giftCount.value }, (_, i) => ({
    id: i + 1,
    label: `Gift ${i + 1}`,
  }));

  assignments.value = [];
  raffleStarted.value = false;
  lastWinner.value = null;
}

function drawNext() {
  if (isDrawDisabled.value) return;

  if (!raffleStarted.value) {
    raffleStarted.value = true;
  }

  const participantIndex = Math.floor(Math.random() * remainingParticipants.value.length);
  const [winner] = remainingParticipants.value.splice(participantIndex, 1);

  const gift = remainingGifts.value.shift();
  if (!gift) return;

  const assignment: Assignment = {
    giftId: gift.id,
    giftLabel: gift.label,
    participantId: winner.id,
    participantName: displayParticipantName(winner.id, winner.name),
  };

  assignments.value.push(assignment);
  lastWinner.value = assignment;

  winnerAnimate.value = false;
  requestAnimationFrame(() => {
    winnerAnimate.value = true;
  });
}

function resetRaffle() {
  initPools();
}

onMounted(() => {
  initPools();
});

watch([giftCount, participantCount], () => {
  if (!raffleStarted.value) {
    initPools();
  }
});
</script>

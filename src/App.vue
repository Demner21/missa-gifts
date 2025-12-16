<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-title">
        <h1>🎁 {{ t('app.title') }}</h1>
        <p>{{ t('app.subtitle') }}</p>
      </div>
      <div class="header-right">
        <div class="badge">
          <span class="badge-dot" />
          <span>{{ t('app.techBadge') }}</span>
        </div>
        <div class="language-switch">
          <span class="language-label">{{ t('layout.language') }}:</span>
          <button
            type="button"
            class="language-chip"
            :class="{ active: currentLocale === 'es' }"
            @click="setLocale('es')"
          >
            ES
          </button>
          <button
            type="button"
            class="language-chip"
            :class="{ active: currentLocale === 'en' }"
            @click="setLocale('en')"
          >
            EN
          </button>
        </div>
      </div>
    </header>

    <section class="controls">
      <div class="field-group raffle-type-group">
        <span class="field-label">{{ t('raffle.typeLabel') }}</span>
        <div class="raffle-type-chips">
          <button
            type="button"
            class="raffle-chip"
            :class="{ active: selectedRaffleTypeId === 'custom' }"
            @click="applyRaffleType('custom')"
          >
            <span class="raffle-chip-title">{{ t('raffle.customName') }}</span>
            <span class="raffle-chip-subtitle">{{ t('raffle.customDescription') }}</span>
          </button>
          <button
            v-for="preset in rafflePresets"
            :key="preset.id"
            type="button"
            class="raffle-chip"
            :class="{ active: selectedRaffleTypeId === preset.id }"
            @click="applyRaffleType(preset.id)"
          >
            <span class="raffle-chip-title">{{ t(preset.nameKey) }}</span>
            <span class="raffle-chip-subtitle">
              {{ t(preset.descriptionKey, { count: preset.participants.length }) }}
            </span>
          </button>
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">{{ t('controls.giftsLabel') }}</span>
        <div class="field-input">
          <span>{{ t('controls.total') }}</span>
          <input
            type="number"
            min="1"
            max="500"
            v-model.number="giftCount"
            :disabled="raffleStarted || selectedRaffleTypeId !== 'custom'"
          />
        </div>
      </div>

      <div class="field-group">
        <span class="field-label">{{ t('controls.participantsLabel') }}</span>
        <div class="field-input">
          <span>{{ t('controls.total') }}</span>
          <input
            type="number"
            min="1"
            max="500"
            v-model.number="participantCount"
            :disabled="raffleStarted || selectedRaffleTypeId !== 'custom'"
          />
        </div>
        <p v-if="participantCount < giftCount" class="error-text">
          {{ t('controls.validationParticipantsGteGifts') }}
        </p>
      </div>

      <div class="buttons">
        <button
          class="btn btn-primary"
          type="button"
          @click="drawNext"
          :disabled="isDrawDisabled"
        >
          <span>{{ t('controls.drawNext') }}</span>
        </button>
        <button
          class="btn btn-secondary"
          type="button"
          @click="resetRaffle"
        >
          {{ t('controls.reset') }}
        </button>
      </div>
    </section>

    <section class="layout">
      <div class="column">
        <header class="column-header">
          <h2 class="column-title">{{ t('participants.columnTitle') }}</h2>
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
                :placeholder="t('participants.placeholder', { id: p.id })"
                maxlength="40"
              />
            </template>
            <template v-else>
              <span>{{ displayParticipantName(p.id, p.name) }}</span>
            </template>
          </li>
        </ul>
        <p v-else class="empty">{{ t('participants.empty') }}</p>
      </div>

      <div class="column">
        <header class="column-header">
          <h2 class="column-title">{{ t('gifts.columnTitle') }}</h2>
          <span class="column-count">{{ remainingGifts.length }}</span>
        </header>
        <p
          v-if="currentGift"
          class="current-gift-label"
          :class="{ shuffling: isSpinning }"
        >
          {{ t('gifts.currentLabel') }}:
          <strong>{{ currentGift.label }}</strong>
          (#{{ currentGift.id }})
        </p>
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
        <p v-else class="empty">{{ t('gifts.empty') }}</p>

        <div
          v-if="isSpinning && currentGift"
          class="winner-card spinning"
        >
          <span class="winner-label">{{ t('roulette.drawingLabel', { gift: currentGift.label }) }}</span>
          <div class="winner-main">
            <span class="winner-name">{{ rouletteDisplayName }}</span>
            <span class="winner-gift">{{ t('roulette.spotlight') }}</span>
          </div>
        </div>

        <div
          v-else-if="lastWinner"
          class="winner-card"
          :class="{ animate: winnerAnimate }"
        >
          <span class="winner-label">{{ t('assignments.lastDrawLabel') }}</span>
          <div class="winner-main">
            <span class="winner-name">{{ lastWinner.participantName }}</span>
            <span class="winner-gift">
              {{ t('assignments.winnerWonGift', { gift: lastWinner.giftLabel }) }}
            </span>
          </div>
        </div>
      </div>

      <div class="column">
        <header class="column-header">
          <h2 class="column-title">{{ t('assignments.columnTitle') }}</h2>
          <span class="column-count">{{ assignments.length }}</span>
        </header>
        <table v-if="assignments.length" class="assignments-table">
          <thead>
            <tr>
              <th>{{ t('assignments.tableGift') }}</th>
              <th>{{ t('assignments.tableWinner') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in assignments" :key="a.giftId">
              <td>
                <span class="pill">
                  <span class="pill-label">{{ t('assignments.pillGift') }}</span>
                  <span class="pill-value">#{{ a.giftId }}</span>
                </span>
                &nbsp;{{ a.giftLabel }}
              </td>
              <td>
                <span class="pill">
                  <span class="pill-label">{{ t('assignments.pillParticipant') }}</span>
                  <span class="pill-value">#{{ a.participantId }}</span>
                </span>
                &nbsp;{{ a.participantName }}
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">{{ t('assignments.empty') }}</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

type Participant = { id: number; name: string };
type Gift = { id: number; label: string };

type Assignment = {
  giftId: number;
  giftLabel: string;
  participantId: number;
  participantName: string;
};

type RafflePresetId = 'initial' | 'primary';
type RaffleTypeId = 'custom' | RafflePresetId;

type RafflePreset = {
  id: RafflePresetId;
  nameKey: string;
  descriptionKey: string;
  participants: string[];
};

const rafflePresets: RafflePreset[] = [
  {
    id: 'initial',
    nameKey: 'raffle.initialName',
    descriptionKey: 'raffle.initialDescription',
    participants: ['Nadia', 'Tania', 'Jhoss', 'Ruth', 'Maida', 'Ibeth'],
  },
  {
    id: 'primary',
    nameKey: 'raffle.primaryName',
    descriptionKey: 'raffle.primaryDescription',
    participants: [
      'Laura',
      'Erika',
      'Maria',
      'Leidi',
      'Andy',
      'Jhan',
      'Wally',
      'Nélida',
      'Pilar',
    ],
  },
];

const giftCount = ref(15);
const participantCount = ref(15);

const remainingParticipants = ref<Participant[]>([]);
const remainingGifts = ref<Gift[]>([]);
const assignments = ref<Assignment[]>([]);

const raffleStarted = ref(false);
const lastWinner = ref<Assignment | null>(null);
const winnerAnimate = ref(false);

// Roulette / spinning state
const isSpinning = ref(false);
const spinParticipants = ref<Participant[]>([]);
const rouletteIndex = ref(0);
const activeGift = ref<Gift | null>(null);

const selectedRaffleTypeId = ref<RaffleTypeId>('custom');

const { t, locale } = useI18n();
const currentLocale = computed(() => locale.value as 'es' | 'en');

function setLocale(next: 'es' | 'en') {
  locale.value = next;
}

const isDrawDisabled = computed(() => {
  if (isSpinning.value) return true;
  if (participantCount.value < giftCount.value) return true;
  if (!remainingParticipants.value.length) return true;
  if (!remainingGifts.value.length) return true;
  return false;
});

const currentGift = computed(() => activeGift.value ?? remainingGifts.value[0] ?? null);

const rouletteDisplayName = computed(() => {
  if (!spinParticipants.value.length) return '';
  const p = spinParticipants.value[rouletteIndex.value % spinParticipants.value.length];
  return displayParticipantName(p.id, p.name);
});

function displayParticipantName(id: number, rawName: string): string {
  const trimmed = rawName.trim();
  if (!trimmed) return t('participants.placeholder', { id });
  return trimmed;
}

function initPools() {
  remainingParticipants.value = Array.from({ length: participantCount.value }, (_, i) => ({
    id: i + 1,
    name: '',
  }));

  remainingGifts.value = Array.from({ length: giftCount.value }, (_, i) => ({
    id: i + 1,
    label: t('gifts.giftLabel', { id: i + 1 }),
  }));

  resetCoreState();
}

function resetCoreState() {
  assignments.value = [];
  raffleStarted.value = false;
  lastWinner.value = null;
  spinParticipants.value = [];
  isSpinning.value = false;
  activeGift.value = null;
}

function loadPreset(id: RafflePresetId) {
  const preset = rafflePresets.find((p) => p.id === id);
  if (!preset) return;

  participantCount.value = preset.participants.length;
  giftCount.value = preset.participants.length;

  remainingParticipants.value = preset.participants.map((name, index) => ({
    id: index + 1,
    name,
  }));

  remainingGifts.value = Array.from({ length: giftCount.value }, (_, i) => ({
    id: i + 1,
    label: t('gifts.giftLabel', { id: i + 1 }),
  }));

  resetCoreState();
}

function applyRaffleType(id: RaffleTypeId) {
  if (selectedRaffleTypeId.value === id) return;

  if (raffleStarted.value || assignments.value.length) {
    const confirmed = window.confirm(t('raffle.changeConfirm'));
    if (!confirmed) return;
  }

  selectedRaffleTypeId.value = id;

  if (id === 'custom') {
    initPools();
  } else {
    loadPreset(id);
  }
}

function drawNext() {
  if (isDrawDisabled.value) return;

  if (!raffleStarted.value) {
    raffleStarted.value = true;
  }

  const participantsSnapshot = [...remainingParticipants.value];
  if (!participantsSnapshot.length) return;

  const giftIndex = Math.floor(Math.random() * remainingGifts.value.length);
  const gift = remainingGifts.value[giftIndex];
  if (!gift) return;
  activeGift.value = gift;

  spinParticipants.value = participantsSnapshot;
  isSpinning.value = true;

  const winnerIndex = Math.floor(Math.random() * participantsSnapshot.length);
  const rounds = 3 + Math.floor(Math.random() * 3); // 3–5 full cycles
  const totalSteps = rounds * participantsSnapshot.length + winnerIndex;

  let step = 0;
  let localIndex = 0;

  const baseInterval = 60;
  const maxInterval = 260;

  const spinStep = () => {
    if (!isSpinning.value) return;

    rouletteIndex.value = localIndex % participantsSnapshot.length;
    localIndex += 1;
    step += 1;

    if (step >= totalSteps) {
      finishSpin(participantsSnapshot[winnerIndex]);
      return;
    }

    const t = step / totalSteps; // 0 → 1
    const eased = t * t; // simple ease-out
    const delay = baseInterval + (maxInterval - baseInterval) * eased;

    window.setTimeout(spinStep, delay);
  };

  const finishSpin = (winner: Participant) => {
    isSpinning.value = false;

    const giftToAssign = activeGift.value ?? remainingGifts.value[0] ?? null;
    if (!giftToAssign) return;

    const assignedGiftIndex = remainingGifts.value.findIndex(
      (g) => g.id === giftToAssign.id,
    );
    if (assignedGiftIndex === -1) {
      activeGift.value = null;
      return;
    }

    const [assignedGift] = remainingGifts.value.splice(assignedGiftIndex, 1);
    activeGift.value = null;

    const winnerIdxInRemaining = remainingParticipants.value.findIndex(
      (p) => p.id === winner.id,
    );
    if (winnerIdxInRemaining === -1) return;

    const [winnerObj] = remainingParticipants.value.splice(winnerIdxInRemaining, 1);

    const assignment: Assignment = {
      giftId: assignedGift.id,
      giftLabel: assignedGift.label,
      participantId: winnerObj.id,
      participantName: displayParticipantName(winnerObj.id, winnerObj.name),
    };

    assignments.value.push(assignment);
    lastWinner.value = assignment;

    winnerAnimate.value = false;
    requestAnimationFrame(() => {
      winnerAnimate.value = true;
    });

    spinParticipants.value = [];
  };

  spinStep();
}

function resetRaffle() {
  if (selectedRaffleTypeId.value === 'custom') {
    initPools();
  } else {
    loadPreset(selectedRaffleTypeId.value as RafflePresetId);
  }
}

onMounted(() => {
  initPools();
});

watch([giftCount, participantCount], () => {
  if (raffleStarted.value) return;

  if (selectedRaffleTypeId.value === 'custom') {
    initPools();
  } else {
    loadPreset(selectedRaffleTypeId.value as RafflePresetId);
  }
});
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <div class="app-title">
        <h1>🎁 {{ t('app.title') }}</h1>
        <p>{{ t('app.subtitle') }}</p>
      </div>
      <div class="header-right">
        <div class="phase-pill" :data-phase="phase">
          <span class="phase-label">{{ t('instructions.phaseLabel') }}</span>
          <span class="phase-value">
            <span v-if="phase === 'raffle'">{{ t('instructions.phaseRaffle') }}</span>
            <span v-else-if="phase === 'instructions'">
              {{ t('instructions.phaseInstructions') }}
            </span>
            <span v-else-if="phase === 'instructions-complete'">
              {{ t('instructions.phaseComplete') }}
            </span>
            <span v-else>{{ t('instructions.phaseFinal') }}</span>
          </span>
        </div>
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

      <div
        v-if="phase !== 'final-ceremony'"
        class="buttons"
      >
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
        <button
          v-if="phase === 'raffle'"
          class="btn btn-secondary"
          type="button"
          @click="startInstructionsPhase"
          :disabled="!isRaffleComplete"
        >
          {{ t('instructions.startPhase') }}
        </button>
        <button
          v-else-if="phase === 'instructions'"
          class="btn btn-primary"
          type="button"
          @click="assignNextInstruction"
          :disabled="isAssignInstructionDisabled"
        >
          {{ t('instructions.assignOne') }}
        </button>
        <button
          v-else-if="phase === 'instructions-complete'"
          class="btn btn-primary"
          type="button"
          @click="startFinalCeremony"
        >
          {{ t('final.summaryTitle') }}
        </button>
      </div>
    </section>

    <section
      v-if="phase === 'raffle'"
      class="layout"
    >
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

    <section
      v-else-if="phase === 'instructions' || phase === 'instructions-complete'"
      class="layout"
    >
      <div class="column">
        <header class="column-header">
          <h2 class="column-title">{{ t('instructions.phaseInstructions') }}</h2>
          <span class="column-count">{{ instructionIndex }} / {{ assignments.length }}</span>
        </header>

        <div class="instructions-panel">
          <p class="instructions-remaining">
            {{ t('instructions.remainingCount', { count: remainingInstructions.length }) }}
          </p>
          <p
            v-if="!remainingInstructions.length && phase === 'instructions'"
            class="instructions-complete-text"
          >
            {{ t('instructions.noRemaining') }}
          </p>

          <p v-if="nextInstructionParticipant && phase === 'instructions'" class="instructions-next">
            <strong>{{ t('instructions.nextParticipantLabel') }}:</strong>
            &nbsp;{{ nextInstructionParticipant.participantName }}
          </p>

          <div
            v-if="isInstructionSpinning && currentInstructionText"
            class="instruction-roulette"
          >
            {{ currentInstructionText }}
          </div>

          <div v-if="lastInstructionResult" class="instruction-result-card">
            <p class="instruction-participant">
              {{ lastInstructionResult.participantName }}
            </p>
            <p class="instruction-random-hint">
              {{ t('instructions.randomSelected') }}
            </p>
            <p class="instruction-line">
              <span class="instruction-label">{{ t('instructions.currentGiftLabel') }}:</span>
              <span class="instruction-value">
                #{{ lastInstructionResult.initialGiftId }} ·
                {{ lastInstructionResult.initialGiftLabel }}
              </span>
            </p>
            <p class="instruction-line">
              <span class="instruction-label">{{ t('instructions.instructionLabel') }}:</span>
              <span class="instruction-value">{{ lastInstructionResult.instructionText }}</span>
            </p>
          </div>

          <p
            v-if="phase === 'instructions-complete'"
            class="instructions-complete-text"
          >
            {{ t('instructions.allDone') }}
          </p>
        </div>
      </div>
    </section>
    <section
      v-else
      class="layout final-layout"
    >
      <div class="column final-column">
        <header class="column-header">
          <h2 class="column-title">{{ t('final.title') }}</h2>
        </header>
        <p class="final-subtitle">{{ t('final.subtitle') }}</p>

        <h3 class="final-summary-title">{{ t('final.summaryTitle') }}</h3>

        <table
          v-if="revealedFinalRows.length"
          class="assignments-table final-table"
        >
          <thead>
            <tr>
              <th>{{ t('final.headerParticipant') }}</th>
              <th>{{ t('final.headerGift') }}</th>
              <th>{{ t('final.headerInstruction') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="row in revealedFinalRows"
              :key="row.assignment.giftId"
              class="final-row-visible"
            >
              <td>{{ displayParticipantName(row.assignment.participantId, row.assignment.participantName) }}</td>
              <td>{{ row.assignment.giftLabel }}</td>
              <td>{{ row.instructionText || t('final.noInstruction') }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else class="empty">{{ t('assignments.empty') }}</p>

        <div class="final-actions">
          <button
            class="btn btn-secondary"
            type="button"
            @click="resetRaffle"
            :disabled="isFinalEffectActive"
          >
            {{ t('final.playAgain') }}
          </button>
        </div>
      </div>
      <div
        v-if="isFinalEffectActive"
        class="christmas-effect"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import rawInstructions from './instructions.json';

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

type InstructionType =
  | 'keep'
  | 'swap_next'
  | 'swap_prev'
  | 'swap_random'
  | 'shift_right'
  | 'shift_left'
  | 'swap_last'
  | 'swap_first'
  | 'rotate_all'
  | 'rotate_all_reverse'
  | 'swap_youngest'
  | 'swap_oldest';

type InstructionConfig = {
  id: string;
  type: InstructionType;
  textEs: string;
  textEn: string;
};

type Phase = 'raffle' | 'instructions' | 'instructions-complete' | 'final-ceremony';

type InstructionResult = {
  participantId: number;
  participantName: string;
  initialGiftId: number;
  initialGiftLabel: string;
  instructionText: string;
  resultingGiftId: number;
  resultingGiftLabel: string;
};

const instructions = rawInstructions as InstructionConfig[];

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

const phase = ref<Phase>('raffle');
const instructionIndex = ref(0);
const ownership = ref<Record<number, number>>({});
const lastInstructionResult = ref<InstructionResult | null>(null);
const isInstructionSpinning = ref(false);
const remainingInstructions = ref<InstructionConfig[]>([]);
const spinInstructions = ref<InstructionConfig[]>([]);
const instructionRouletteIndex = ref(0);
const instructionHistory = ref<InstructionResult[]>([]);
const isFinalEffectActive = ref(false);

const { t, locale } = useI18n();
const currentLocale = computed(() => locale.value as 'es' | 'en');

function setLocale(next: 'es' | 'en') {
  locale.value = next;
}

const isDrawDisabled = computed(() => {
  if (phase.value !== 'raffle') return true;
  if (isSpinning.value) return true;
  if (participantCount.value < giftCount.value) return true;
  if (!remainingParticipants.value.length) return true;
  if (!remainingGifts.value.length) return true;
  return false;
});

const isRaffleComplete = computed(
  () => remainingGifts.value.length === 0 && assignments.value.length > 0,
);

const currentGift = computed(() => activeGift.value ?? remainingGifts.value[0] ?? null);

const rouletteDisplayName = computed(() => {
  if (!spinParticipants.value.length) return '';
  const p = spinParticipants.value[rouletteIndex.value % spinParticipants.value.length];
  return displayParticipantName(p.id, p.name);
});

const currentInstructionText = computed(() => {
  if (!isInstructionSpinning.value) return '';
  if (!spinInstructions.value.length) return '';
  const inst = spinInstructions.value[instructionRouletteIndex.value % spinInstructions.value.length];
  return currentLocale.value === 'es' ? inst.textEs : inst.textEn;
});

const nextInstructionParticipant = computed(() => {
  if (phase.value !== 'instructions') return null;
  return assignments.value[instructionIndex.value] ?? null;
});

const isAssignInstructionDisabled = computed(
  () =>
    phase.value !== 'instructions' ||
    instructionIndex.value >= assignments.value.length ||
    isInstructionSpinning.value ||
    remainingInstructions.value.length === 0,
);

const revealedFinalRows = computed(() =>
  assignments.value.map((assignment) => {
    const history = instructionHistory.value.find(
      (h) => h.participantId === assignment.participantId,
    );
    return {
      assignment,
      instructionText: history?.instructionText ?? '',
    };
  }),
);

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
  phase.value = 'raffle';
  instructionIndex.value = 0;
  ownership.value = {};
  lastInstructionResult.value = null;
  isInstructionSpinning.value = false;
  remainingInstructions.value = [];
  spinInstructions.value = [];
  instructionRouletteIndex.value = 0;
  instructionHistory.value = [];
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

function startInstructionsPhase() {
  if (!isRaffleComplete.value) return;

  const map: Record<number, number> = {};
  for (const a of assignments.value) {
    map[a.participantId] = a.giftId;
  }

  ownership.value = map;
  instructionIndex.value = 0;
  lastInstructionResult.value = null;
  remainingInstructions.value = [...instructions];
  instructionHistory.value = [];
  phase.value = 'instructions';
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

function assignNextInstruction() {
  if (phase.value !== 'instructions') return;
  if (instructionIndex.value >= assignments.value.length) return;

  if (isInstructionSpinning.value) return;
  if (!remainingInstructions.value.length) {
    phase.value = 'instructions-complete';
    return;
  }
  isInstructionSpinning.value = true;
  const current = assignments.value[instructionIndex.value];
  const participantId = current.participantId;
  const participantName = current.participantName;

  const participantsCount = assignments.value.length;
  const instructionsSnapshot = [...remainingInstructions.value];
  const instructionsCount = instructionsSnapshot.length;

  spinInstructions.value = instructionsSnapshot;

  const winnerIndex = Math.floor(Math.random() * instructionsCount);
  const rounds = 3 + Math.floor(Math.random() * 3); // 3–5 full cycles
  const totalSteps = rounds * instructionsCount + winnerIndex;

  let step = 0;
  let localIndex = 0;

  const baseInterval = 60;
  const maxInterval = 260;

  const spinStep = () => {
    if (!isInstructionSpinning.value) return;

    instructionRouletteIndex.value = localIndex % instructionsCount;
    localIndex += 1;
    step += 1;

    if (step >= totalSteps) {
      finishSpinInstruction(instructionsSnapshot[winnerIndex]);
      return;
    }

    const tNorm = step / totalSteps; // 0 → 1
    const eased = tNorm * tNorm; // simple ease-out
    const delay = baseInterval + (maxInterval - baseInterval) * eased;

    window.setTimeout(spinStep, delay);
  };

  const finishSpinInstruction = (chosen: InstructionConfig) => {
    // Update ownership map based on chosen instruction
    const map: Record<number, number> = { ...ownership.value };

    if (!(participantId in map)) {
      map[participantId] = current.giftId;
    }

    const beforeGiftId = map[participantId];

    if (chosen.type === 'swap_next' || chosen.type === 'swap_prev') {
      const offset = chosen.type === 'swap_next' ? 1 : -1;
      const targetIndex = (instructionIndex.value + offset + participantsCount) % participantsCount;
      const target = assignments.value[targetIndex];
      const targetId = target.participantId;

      if (!(targetId in map)) {
        map[targetId] = target.giftId;
      }

      const temp = map[participantId];
      map[participantId] = map[targetId];
      map[targetId] = temp;
    }

    ownership.value = map;

    // Remove the chosen instruction from the remaining pool
    const poolIndex = remainingInstructions.value.findIndex((i) => i.id === chosen.id);
    if (poolIndex !== -1) {
      remainingInstructions.value.splice(poolIndex, 1);
    }

    const instructionText = currentLocale.value === 'es'
      ? chosen.textEs
      : chosen.textEn;

    const resultingGiftId = ownership.value[participantId];

    const result: InstructionResult = {
      participantId,
      participantName,
      initialGiftId: beforeGiftId,
      initialGiftLabel: t('gifts.giftLabel', { id: beforeGiftId }),
      instructionText,
      resultingGiftId,
      resultingGiftLabel: t('gifts.giftLabel', { id: resultingGiftId }),
    };

    lastInstructionResult.value = result;
    instructionHistory.value.push(result);

    instructionIndex.value += 1;

    if (
      instructionIndex.value >= assignments.value.length ||
      remainingInstructions.value.length === 0
    ) {
      phase.value = 'instructions-complete';
    }

    isInstructionSpinning.value = false;
    spinInstructions.value = [];
  };

  spinStep();
}

function startFinalCeremony() {
  phase.value = 'final-ceremony';
  isFinalEffectActive.value = true;

  window.setTimeout(() => {
    isFinalEffectActive.value = false;
  }, 4500);
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

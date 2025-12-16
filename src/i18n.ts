import { createI18n } from 'vue-i18n';

const messages = {
  es: {
    app: {
      title: 'Sorteo de regalos',
      subtitle: 'Asigna regalos únicos a participantes sin repetir.',
      techBadge: 'En memoria · Vite + Vue 3 + TS',
    },
    controls: {
      giftsLabel: 'Regalos',
      participantsLabel: 'Participantes',
      total: 'Total',
      drawNext: 'Sortear siguiente regalo',
      reset: 'Reiniciar sorteo',
      validationParticipantsGteGifts:
        'El número de participantes debe ser mayor o igual al número de regalos para evitar regalos sin asignar.',
    },
    participants: {
      columnTitle: 'Participantes',
      placeholder: 'Participante {id}',
      empty: 'No quedan participantes.',
    },
    gifts: {
      columnTitle: 'Regalos restantes',
      currentLabel: 'Sorteando ahora',
      empty: 'Todos los regalos han sido asignados.',
      giftLabel: 'Regalo {id}',
    },
    roulette: {
      drawingLabel: 'Sorteando {gift}',
      spotlight: 'está en la rueda…',
    },
    assignments: {
      columnTitle: 'Regalos asignados',
      tableGift: 'Regalo',
      tableWinner: 'Ganador',
      pillGift: 'Regalo',
      pillParticipant: 'Participante',
      empty: 'Aún no hay asignaciones. ¡Empieza el sorteo!',
      lastDrawLabel: 'Último sorteo',
      winnerWonGift: 'ganó {gift}',
    },
    layout: {
      language: 'Idioma',
    },
    raffle: {
      typeLabel: 'Tipo de sorteo',
      customName: 'Personalizado',
      customDescription: 'Define manualmente los participantes.',
      initialName: 'Sorteo profesores inicial',
      initialDescription: 'Sorteo con {count} participantes predefinidos.',
      primaryName: 'Sorteo profesores primaria + talleristas',
      primaryDescription: 'Sorteo con {count} participantes predefinidos.',
      changeConfirm:
        'Cambiar el tipo de sorteo reiniciará el estado actual. ¿Quieres continuar?',
    },
    instructions: {
      phaseLabel: 'Fase',
      phaseRaffle: 'Sorteo',
      phaseInstructions: 'Instrucciones',
      phaseComplete: 'Instrucciones completadas',
      phaseFinal: 'Ceremonia final',
      startPhase: 'Iniciar fase de instrucciones',
      assignOne: 'Asignar instrucción',
      nextParticipantLabel: 'Siguiente participante',
      currentGiftLabel: 'Regalo actual',
      instructionLabel: 'Instrucción',
      resultingGiftLabel: 'Regalo final',
      allDone: 'Todas las instrucciones han sido asignadas.',
      randomSelected: 'Instrucción seleccionada al azar',
      remainingCount: 'Instrucciones restantes: {count}',
      noRemaining: 'No quedan instrucciones disponibles.',
    },
    final: {
      title: '🎁 El sorteo de Navidad ha terminado',
      subtitle: 'Gracias por jugar y compartir este momento.',
      summaryTitle: 'Resumen ceremonial',
      noInstruction: 'Sin instrucción asignada',
      headerParticipant: 'Participante',
      headerGift: 'Regalo inicial',
      headerInstruction: 'Instrucción',
      revealNext: 'Revelar siguiente participante',
      playAgain: 'Jugar de nuevo',
    },
  },
  en: {
    app: {
      title: 'Gift raffle',
      subtitle: 'Randomly assign unique gifts to participants with no repeats.',
      techBadge: 'In-memory · Vite + Vue 3 + TS',
    },
    controls: {
      giftsLabel: 'Gifts',
      participantsLabel: 'Participants',
      total: 'Total',
      drawNext: 'Draw next gift',
      reset: 'Reset raffle',
      validationParticipantsGteGifts:
        'Participants should be ≥ gifts to avoid unassigned gifts.',
    },
    participants: {
      columnTitle: 'Participants',
      placeholder: 'Participant {id}',
      empty: 'No participants left.',
    },
    gifts: {
      columnTitle: 'Remaining gifts',
      currentLabel: 'Drawing now',
      empty: 'All gifts have been assigned.',
      giftLabel: 'Gift {id}',
    },
    roulette: {
      drawingLabel: 'Drawing {gift}',
      spotlight: 'is in the spotlight…',
    },
    assignments: {
      columnTitle: 'Assigned gifts',
      tableGift: 'Gift',
      tableWinner: 'Winner',
      pillGift: 'Gift',
      pillParticipant: 'Participant',
      empty: 'No assignments yet. Draw your first gift!',
      lastDrawLabel: 'Last draw',
      winnerWonGift: 'won {gift}',
    },
    layout: {
      language: 'Language',
    },
    raffle: {
      typeLabel: 'Raffle type',
      customName: 'Custom',
      customDescription: 'Manually define the participants.',
      initialName: 'Initial raffle',
      initialDescription: 'Raffle with {count} predefined participants.',
      primaryName: 'Primary raffle',
      primaryDescription: 'Raffle with {count} predefined participants.',
      changeConfirm:
        'Changing the raffle type will reset the current state. Do you want to continue?',
    },
    instructions: {
      phaseLabel: 'Phase',
      phaseRaffle: 'Raffle',
      phaseInstructions: 'Instructions',
      phaseComplete: 'Instructions complete',
      phaseFinal: 'Final ceremony',
      startPhase: 'Start instructions phase',
      assignOne: 'Assign instruction',
      nextParticipantLabel: 'Next participant',
      currentGiftLabel: 'Current gift',
      instructionLabel: 'Instruction',
      resultingGiftLabel: 'Final gift',
      allDone: 'All instructions have been assigned.',
      randomSelected: 'Instruction selected at random',
      remainingCount: 'Remaining instructions: {count}',
      noRemaining: 'No instructions remaining.',
    },
    final: {
      title: '🎁 The Christmas raffle has ended',
      subtitle: 'Thank you for playing and sharing this moment.',
      summaryTitle: 'Ceremonial summary',
      noInstruction: 'No instruction assigned',
      headerParticipant: 'Participant',
      headerGift: 'Initial gift',
      headerInstruction: 'Instruction',
      revealNext: 'Reveal next participant',
      playAgain: 'Play again',
    },
  },
} as const;

export type AppLocale = keyof typeof messages;

function detectInitialLocale(): AppLocale {
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language || navigator.languages?.[0];
    if (lang) {
      if (lang.toLowerCase().startsWith('es')) return 'es';
      if (lang.toLowerCase().startsWith('en')) return 'en';
    }
  }
  return 'es';
}

export const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: 'es',
  messages,
});

export default i18n;

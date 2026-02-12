import { useReducer, useCallback } from 'react';
import puzzlesData from '../puzzles.json';
import { shuffle } from '../lib/shuffle';

const STORAGE_KEY = 'onebit-solved';

function loadSolved() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY)) || []);
  } catch {
    return new Set();
  }
}

function saveSolved(solved) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...solved]));
}

function clearSolved() {
  localStorage.removeItem(STORAGE_KEY);
}

let nextId = 1;
function msg(type, text, variant) {
  return { id: nextId++, type, text, variant: variant || null };
}

function getPuzzleLimit() {
  const params = new URLSearchParams(window.location.search);
  const n = parseInt(params.get('n'), 10);
  return (n > 0 && n <= puzzlesData.length) ? n : puzzlesData.length;
}

function shouldReset() {
  const params = new URLSearchParams(window.location.search);
  return params.get('new') === '1';
}

function initState() {
  if (shouldReset()) {
    clearSolved();
  }

  const solved = loadSolved();
  const unsolved = puzzlesData.filter(p => !solved.has(p.secret));
  const pool = unsolved.length > 0 ? unsolved : puzzlesData;
  const puzzles = shuffle(pool).slice(0, getPuzzleLimit());
  const clues = shuffle(puzzles[0].clues);

  return {
    puzzles,
    solved,
    puzzleIndex: 0,
    clues,
    clueIndex: 0,
    phase: 'guessing',
    messages: [
      msg('system', 'guess the word. it has just one bit, like it is just one beat when you say it. i will give clues.'),
      msg('system', clues[0], 'clue'),
    ],
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'GUESS': {
      const text = action.text.trim().toLowerCase();
      const { puzzles, puzzleIndex, clues, clueIndex, phase, solved } = state;
      const secret = puzzles[puzzleIndex].secret;
      const total = puzzles.length;
      const newMessages = [...state.messages];

      if (phase === 'finished') return state;

      if (text === '') return state;

      if (text === 'hint') {
        // next clue
        if (clueIndex < clues.length - 1) {
          const next = clueIndex + 1;
          newMessages.push(msg('system', clues[next], 'clue'));
          return { ...state, clueIndex: next, messages: newMessages };
        } else {
          newMessages.push(msg('system', 'no more hints. think hard!'));
          return { ...state, messages: newMessages };
        }
      }

      // actual guess
      newMessages.push(msg('user', text));

      if (text === secret) {
        const newSolved = new Set(solved);
        newSolved.add(secret);
        saveSolved(newSolved);

        newMessages.push(msg('system', 'yes!', 'correct'));
        const nextIndex = puzzleIndex + 1;
        if (nextIndex >= total) {
          newMessages.push(msg('system', `done! you got ${newSolved.size} out of ${puzzlesData.length}.`, 'finish'));
          return { ...state, solved: newSolved, phase: 'finished', messages: newMessages };
        }
        const nextClues = shuffle(puzzles[nextIndex].clues);
        newMessages.push(msg('system', nextClues[0], 'clue'));
        return {
          ...state,
          solved: newSolved,
          puzzleIndex: nextIndex,
          clues: nextClues,
          clueIndex: 0,
          messages: newMessages,
        };
      } else {
        newMessages.push(msg('system', 'nope.', 'wrong'));
        return { ...state, messages: newMessages };
      }
    }
    default:
      return state;
  }
}

export function useGame() {
  const [state, dispatch] = useReducer(reducer, null, initState);

  const handleGuess = useCallback((text) => {
    dispatch({ type: 'GUESS', text });
  }, []);

  return {
    messages: state.messages,
    solved: state.solved.size,
    totalPuzzles: puzzlesData.length,
    phase: state.phase,
    handleGuess,
  };
}

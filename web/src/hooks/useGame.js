import { useReducer, useCallback } from 'react';
import puzzlesData from '../puzzles.json';
import { shuffle } from '../lib/shuffle';

let nextId = 1;
function msg(type, text, variant) {
  return { id: nextId++, type, text, variant: variant || null };
}

function initState() {
  const puzzles = shuffle(puzzlesData);
  const clues = shuffle(puzzles[0].clues);
  return {
    puzzles,
    puzzleIndex: 0,
    clues,
    clueIndex: 0,
    score: 0,
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
      const { puzzles, puzzleIndex, clues, clueIndex, score, phase } = state;
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
        const newScore = score + 1;
        newMessages.push(msg('system', 'yes!', 'correct'));
        const nextIndex = puzzleIndex + 1;
        if (nextIndex >= total) {
          newMessages.push(msg('system', `you got them all! ${newScore} out of ${newScore}. well done!`, 'finish'));
          return { ...state, score: newScore, phase: 'finished', messages: newMessages };
        }
        const nextClues = shuffle(puzzles[nextIndex].clues);
        newMessages.push(msg('system', nextClues[0], 'clue'));
        return {
          ...state,
          score: newScore,
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
    score: state.score,
    puzzleIndex: state.puzzleIndex,
    totalPuzzles: state.puzzles.length,
    phase: state.phase,
    clueNumber: state.clueIndex + 1,
    totalClues: state.clues.length,
    handleGuess,
  };
}

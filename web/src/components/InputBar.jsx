import { useState, useRef } from 'react';

export default function InputBar({ onSubmit, phase }) {
  const [text, setText] = useState('');
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(text);
    setText('');
    inputRef.current?.focus();
  }

  function handleHint() {
    onSubmit('hint');
    inputRef.current?.focus();
  }

  if (phase === 'finished') {
    return (
      <div className="border-t border-gray-200 bg-white px-4 py-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-blue-500 text-white rounded-full py-3 font-medium active:bg-blue-600"
        >
          play again
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white px-4 py-3 flex gap-2">
      <button
        type="button"
        onClick={handleHint}
        className="text-blue-500 text-sm font-medium shrink-0 px-2 active:text-blue-700"
      >
        hint
      </button>
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="type your guess..."
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-full w-11 h-11 flex items-center justify-center shrink-0 active:bg-blue-600"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
          <path d="M3.105 2.288a.75.75 0 0 0-.826.95l1.414 4.926A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95l14.095-5.637a.75.75 0 0 0 0-1.394L3.105 2.288Z" />
        </svg>
      </button>
    </form>
  );
}

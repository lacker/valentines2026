import { useGame } from './hooks/useGame';
import ScoreHeader from './components/ScoreHeader';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';

export default function App() {
  const { messages, score, puzzleIndex, totalPuzzles, phase, handleGuess } = useGame();

  return (
    <div className="h-dvh flex flex-col bg-gray-50">
      <ScoreHeader score={score} puzzleIndex={puzzleIndex} total={totalPuzzles} />
      <ChatWindow messages={messages} />
      <InputBar onSubmit={handleGuess} phase={phase} />
    </div>
  );
}

import { useGame } from './hooks/useGame';
import ScoreHeader from './components/ScoreHeader';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';

export default function App() {
  const { messages, solved, totalPuzzles, phase, handleGuess } = useGame();

  return (
    <div className="h-dvh flex flex-col bg-gray-50">
      <ScoreHeader solved={solved} total={totalPuzzles} />
      <ChatWindow messages={messages} />
      <InputBar onSubmit={handleGuess} phase={phase} />
    </div>
  );
}

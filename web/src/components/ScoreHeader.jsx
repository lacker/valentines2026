export default function ScoreHeader({ score, puzzleIndex, total }) {
  return (
    <div className="bg-gray-100 border-b border-gray-300 text-gray-900 px-4 py-3 text-sm font-medium flex justify-between">
      <span>one bit</span>
      <span>{score} of {total}</span>
    </div>
  );
}

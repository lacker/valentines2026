export default function MessageBubble({ type, text, variant }) {
  if (variant === 'divider') {
    return (
      <div className="text-center text-xs text-gray-400 py-2">
        {text}
      </div>
    );
  }

  if (type === 'user') {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-500 text-white rounded-2xl rounded-br-sm px-4 py-2 max-w-[80%]">
          {text}
        </div>
      </div>
    );
  }

  // system message
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 text-black rounded-2xl rounded-tl-sm px-4 py-2 max-w-[80%]">
        {text}
      </div>
    </div>
  );
}

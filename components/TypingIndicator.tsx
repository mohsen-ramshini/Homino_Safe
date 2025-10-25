'use client';

export default function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center">
      <span className="dot"> </span>
      <span className="dot"> </span>
      <span className="dot"> </span>
      <style jsx>{`
        .dot {
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: #999;
          opacity: 0.3;
          animation: typingBounce 1.4s infinite ease-in-out both;
        }
        .dot:nth-child(1) { animation-delay: 0s; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingBounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.3;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

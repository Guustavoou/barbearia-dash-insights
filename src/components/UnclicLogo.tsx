import React from "react";

interface UnclicLogoProps {
  collapsed?: boolean;
  className?: string;
}

export const UnclicLogo: React.FC<UnclicLogoProps> = ({
  collapsed = false,
  className = "",
}) => {
  if (collapsed) {
    // Logo compacta (apenas o papagaio)
    return (
      <div className={`w-8 h-8 flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 48 48"
          className="w-8 h-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Papagaio colorido */}
          <defs>
            <linearGradient
              id="parrotGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Corpo do papagaio */}
          <path
            d="M24 8C29 8 34 12 36 18C37 22 35 26 32 28C30 30 26 30 24 28C22 30 18 30 16 28C13 26 11 22 12 18C14 12 19 8 24 8Z"
            fill="url(#parrotGradient)"
          />

          {/* Cabeça/topo */}
          <path
            d="M24 6C28 6 32 9 33 14C32 12 29 10 24 10C19 10 16 12 15 14C16 9 20 6 24 6Z"
            fill="#3B82F6"
          />

          {/* Bico */}
          <path
            d="M12 18C10 19 9 21 11 22C12 21 13 20 14 19C13 18.5 12.5 18 12 18Z"
            fill="#374151"
          />

          {/* Olho */}
          <circle cx="20" cy="16" r="4" fill="white" />
          <circle cx="20" cy="16" r="2.5" fill="black" />
          <circle cx="21" cy="15" r="1" fill="white" />

          {/* Detalhes das penas */}
          <path
            d="M28 12C30 10 32 8 34 10C33 12 31 14 29 14C28.5 13 28 12.5 28 12Z"
            fill="#06B6D4"
          />
          <path
            d="M26 10C28 8 30 6 32 8C31 10 29 12 27 12C26.5 11 26 10.5 26 10Z"
            fill="#3B82F6"
          />
        </svg>
      </div>
    );
  }

  // Logo completa (papagaio + texto)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Papagaio */}
      <div className="w-10 h-10 flex items-center justify-center">
        <svg
          viewBox="0 0 48 48"
          className="w-10 h-10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              id="parrotGradientFull"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>
          </defs>

          {/* Corpo do papagaio */}
          <path
            d="M24 8C29 8 34 12 36 18C37 22 35 26 32 28C30 30 26 30 24 28C22 30 18 30 16 28C13 26 11 22 12 18C14 12 19 8 24 8Z"
            fill="url(#parrotGradientFull)"
          />

          {/* Cabeça/topo */}
          <path
            d="M24 6C28 6 32 9 33 14C32 12 29 10 24 10C19 10 16 12 15 14C16 9 20 6 24 6Z"
            fill="#3B82F6"
          />

          {/* Bico */}
          <path
            d="M12 18C10 19 9 21 11 22C12 21 13 20 14 19C13 18.5 12.5 18 12 18Z"
            fill="#374151"
          />

          {/* Olho */}
          <circle cx="20" cy="16" r="4" fill="white" />
          <circle cx="20" cy="16" r="2.5" fill="black" />
          <circle cx="21" cy="15" r="1" fill="white" />

          {/* Detalhes das penas */}
          <path
            d="M28 12C30 10 32 8 34 10C33 12 31 14 29 14C28.5 13 28 12.5 28 12Z"
            fill="#06B6D4"
          />
          <path
            d="M26 10C28 8 30 6 32 8C31 10 29 12 27 12C26.5 11 26 10.5 26 10Z"
            fill="#3B82F6"
          />
        </svg>
      </div>

      {/* Texto UNCLIC */}
      <div className="text-2xl font-bold tracking-wide">
        <span className="text-gray-900 dark:text-white">UNCLIC</span>
      </div>
    </div>
  );
};

export default UnclicLogo;

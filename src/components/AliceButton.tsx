interface AliceButtonProps {
  isActive: boolean;
  isDisabled: boolean;
  onClick: () => void;
  bloomSaturation: number;
}

export const AliceButton = ({
  isActive,
  isDisabled,
  onClick,
  bloomSaturation,
}: AliceButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="fixed right-0 z-20 transition-all duration-300 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
      style={{
        top: '50%',
        transform: 'translateY(-50%)',
        width: '56px',
        height: '60vh',
        background: `linear-gradient(to left, 
          transparent 0%, 
          hsl(190 ${bloomSaturation}% 45% / 0.2) 100%)`,
        borderLeft: `2px solid hsl(190 ${bloomSaturation}% 45% / 0.4)`,
        borderRadius: '16px 0 0 16px',
      }}
      aria-label="Open ALICE visualization"
      title={isDisabled ? "Scroll to capture text" : "Visualize this moment"}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Orb icon */}
        <div className="relative w-10 h-10">
          {/* Outer glow */}
          <div
            className="absolute inset-0 rounded-full blur-xl transition-all duration-300"
            style={{
              background: `radial-gradient(circle, hsl(190 ${bloomSaturation}% 45%) 0%, transparent 70%)`,
              opacity: isActive ? 0.5 : 0.3,
              animation: isActive ? 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
          
          {/* Core orb */}
          <div
            className="relative w-10 h-10 rounded-full transition-all duration-300"
            style={{
              background: `radial-gradient(circle at 30% 30%, 
                hsl(190 ${bloomSaturation}% 65%), 
                hsl(190 ${bloomSaturation}% 35%))`,
              boxShadow: `0 0 30px hsl(190 ${bloomSaturation}% 45% / 0.6), 
                inset 0 0 10px hsl(190 ${bloomSaturation}% 25%)`,
              animation: !isDisabled ? 'float-sphere 10s infinite linear' : 'none',
              filter: isDisabled ? 'grayscale(100%)' : 'none',
            }}
          />
        </div>
      </div>
    </button>
  );
};

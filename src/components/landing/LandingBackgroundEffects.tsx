export default function LandingBackgroundEffects() {
  return (
    <>
      {/* Base black background */}
      <div className="fixed inset-0 bg-black pointer-events-none" />
      
      {/* Subtle animated golden glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full"
          style={{
            top: '10%',
            left: '10%',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.3) 0%, transparent 70%)',
            filter: 'blur(120px)',
            animation: 'float-slow 30s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            bottom: '20%',
            right: '15%',
            background: 'radial-gradient(circle, rgba(202, 138, 4, 0.25) 0%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'float-slow 40s ease-in-out infinite 10s'
          }}
        />
      </div>
      

    </>
  );
}
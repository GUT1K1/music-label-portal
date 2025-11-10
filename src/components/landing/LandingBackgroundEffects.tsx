export default function LandingBackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-br from-gray-950 via-black to-gray-950 pointer-events-none" />
      
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[800px] h-[800px] rounded-full"
          style={{
            top: '10%',
            left: '-15%',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, rgba(202, 138, 4, 0.06) 50%, transparent 70%)',
            filter: 'blur(120px)',
            animation: 'float-gentle 35s ease-in-out infinite'
          }}
        />
        
        <div 
          className="absolute w-[900px] h-[900px] rounded-full"
          style={{
            top: '40%',
            right: '-10%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.1) 0%, rgba(245, 158, 11, 0.05) 50%, transparent 70%)',
            filter: 'blur(130px)',
            animation: 'float-gentle 40s ease-in-out infinite 10s'
          }}
        />
        
        <div 
          className="absolute w-[700px] h-[700px] rounded-full"
          style={{
            bottom: '5%',
            left: '30%',
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.08) 0%, rgba(234, 179, 8, 0.04) 50%, transparent 70%)',
            filter: 'blur(110px)',
            animation: 'float-gentle 45s ease-in-out infinite 20s'
          }}
        />
        
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.05) 0%, transparent 60%)',
            filter: 'blur(140px)',
            animation: 'pulse-gentle 25s ease-in-out infinite'
          }}
        />
      </div>
      
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(234, 179, 8, 0.03), transparent 70%)',
          }}
        />
      </div>
      
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}
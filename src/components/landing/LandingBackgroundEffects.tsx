export default function LandingBackgroundEffects() {
  return (
    <>
      {/* Rich gradient base */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none" />
      
      {/* Large golden orbs - bright and vibrant */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Top left - bright gold */}
        <div 
          className="absolute w-[1200px] h-[1200px] rounded-full"
          style={{
            top: '-20%',
            left: '-10%',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.4) 0%, rgba(202, 138, 4, 0.25) 40%, transparent 70%)',
            filter: 'blur(80px)',
            animation: 'float-slow 25s ease-in-out infinite'
          }}
        />
        
        {/* Center right - warm amber */}
        <div 
          className="absolute w-[1000px] h-[1000px] rounded-full"
          style={{
            top: '30%',
            right: '-5%',
            background: 'radial-gradient(circle, rgba(251, 191, 36, 0.35) 0%, rgba(245, 158, 11, 0.2) 40%, transparent 70%)',
            filter: 'blur(90px)',
            animation: 'float-slow 35s ease-in-out infinite 8s'
          }}
        />
        
        {/* Bottom center - bright yellow-gold */}
        <div 
          className="absolute w-[1100px] h-[1100px] rounded-full"
          style={{
            bottom: '-15%',
            left: '25%',
            background: 'radial-gradient(circle, rgba(250, 204, 21, 0.3) 0%, rgba(234, 179, 8, 0.2) 40%, transparent 70%)',
            filter: 'blur(100px)',
            animation: 'float-slow 30s ease-in-out infinite 15s'
          }}
        />
        
        {/* Small accent orb - intense gold */}
        <div 
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            top: '50%',
            left: '40%',
            background: 'radial-gradient(circle, rgba(234, 179, 8, 0.5) 0%, rgba(202, 138, 4, 0.3) 30%, transparent 60%)',
            filter: 'blur(60px)',
            animation: 'pulse-glow 8s ease-in-out infinite'
          }}
        />
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 20%, rgba(234, 179, 8, 0.15), transparent 50%)',
          }}
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 80% 70%, rgba(251, 191, 36, 0.12), transparent 50%)',
          }}
        />
      </div>
      
      {/* Subtle noise texture for premium feel */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}

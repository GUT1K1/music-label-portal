interface Platform {
  name: string;
  logo: string;
  gradient: string;
}

interface PlatformsSectionProps {
  platforms: Platform[];
}

export default function PlatformsSection({ platforms }: PlatformsSectionProps) {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-yellow-500/5 to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-20 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 bg-clip-text">
              Все площадки в одном месте
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
            Распространяем музыку на крупнейших стриминговых сервисах
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {platforms.map((platform, i) => (
            <div
              key={i}
              className="group relative p-6 md:p-8 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-all duration-500 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="relative z-10 text-center">
                <div className="text-4xl md:text-6xl mb-3 md:mb-4 group-hover:scale-110 transition-transform duration-500">
                  {platform.logo}
                </div>
                <h3
                  className={`text-sm md:text-lg font-bold bg-gradient-to-r ${platform.gradient} text-transparent bg-clip-text`}
                >
                  {platform.name}
                </h3>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

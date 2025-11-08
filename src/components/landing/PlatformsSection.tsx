import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Platform {
  name: string;
  logo: string;
  gradient: string;
}

interface PlatformsSectionProps {
  platforms: Platform[];
}

export default function PlatformsSection({ platforms }: PlatformsSectionProps) {
  const titleAnimation = useScrollAnimation({ threshold: 0.2 });
  const platformsAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="relative py-24 md:py-40 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/[0.03] to-transparent" />
      <div className="container mx-auto px-4 relative z-10">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${
            titleAnimation.isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            Все площадки в одном месте
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
            Распространяем вашу музыку на всех крупнейших стриминговых платформах
          </p>
        </div>

        <div 
          ref={platformsAnimation.ref}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 max-w-6xl mx-auto"
        >
          {platforms.map((platform, i) => (
            <div
              key={i}
              className={`group relative transition-all duration-700 ${
                platformsAnimation.isVisible
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-90'
              }`}
              style={{ 
                transitionDelay: platformsAnimation.isVisible ? `${i * 80}ms` : '0ms'
              }}
            >
              <div className="relative p-8 bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 hover:border-orange-500/30 transition-all duration-300 hover:scale-105">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-yellow-500/0 group-hover:from-orange-500/10 group-hover:to-yellow-500/10 rounded-2xl transition-all duration-300" />
                
                <div className="relative z-10 text-center">
                  <div className="text-5xl md:text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {platform.logo}
                  </div>
                  <h3 className="text-sm md:text-base font-semibold text-gray-300 group-hover:text-white transition-colors">
                    {platform.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
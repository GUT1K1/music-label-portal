import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface Service {
  icon: string;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  glowColor: string;
}

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const titleAnimation = useScrollAnimation({ threshold: 0.2 });
  const cardsAnimation = useScrollAnimation({ threshold: 0.1 });

  return (
    <section className="relative py-24 md:py-40">
      <div className="container mx-auto px-4">
        <div 
          ref={titleAnimation.ref}
          className={`text-center mb-16 md:mb-24 transition-all duration-1000 ${
            titleAnimation.isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="text-white">
              Что мы предлагаем
            </span>
          </h2>
          <p className="text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto font-light">
            Полный набор инструментов для развития вашей музыкальной карьеры
          </p>
        </div>

        <div 
          ref={cardsAnimation.ref}
          className="grid md:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto"
        >
          {services.map((service, i) => (
            <div
              key={i}
              className={`group relative transition-all duration-700 ${
                cardsAnimation.isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-20'
              }`}
              style={{ 
                transitionDelay: cardsAnimation.isVisible ? `${i * 150}ms` : '0ms'
              }}
            >
              <div className="relative p-8 md:p-10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 hover:border-orange-500/30 transition-all duration-500 h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-yellow-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-yellow-500/5 group-hover:to-orange-500/5 rounded-3xl transition-all duration-500" />
                
                <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon name={service.icon} className="w-8 h-8 md:w-10 md:h-10 text-orange-400" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                    {service.title}
                  </h3>
                  
                  <p className="text-base md:text-lg text-gray-400 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-3">
                    {service.features.map((feature, j) => (
                      <li key={j} className="flex items-start gap-3 text-base">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-br from-yellow-400 to-orange-400" />
                        </div>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
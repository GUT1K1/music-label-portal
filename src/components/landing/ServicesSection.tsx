import { Card } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

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
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-20 animate-fade-in">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">
            <span className="text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 bg-clip-text">
              Сервисы лейбла
            </span>
          </h2>
          <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto">
            Всё необходимое для успешного развития музыкальной карьеры
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
          {services.map((service, i) => (
            <Card
              key={i}
              className="group relative p-6 md:p-8 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 transition-all duration-500 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="relative z-10">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                >
                  <Icon name={service.icon} className="w-7 h-7 md:w-8 md:h-8 text-black" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-white">
                  {service.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6 leading-relaxed">
                  {service.description}
                </p>
                <ul className="space-y-2 md:space-y-3">
                  {service.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 md:gap-3 text-sm md:text-base">
                      <Icon
                        name="CheckCircle2"
                        className={`w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5 text-${service.glowColor}-500`}
                      />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

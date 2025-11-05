import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import AnimatedHero from "@/components/AnimatedHero";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  scrollY: number;
  heroRef: React.RefObject<HTMLDivElement>;
}

export default function HeroSection({ scrollY, heroRef }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 146, 60, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 146, 60, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10 py-0">
        <div className="max-w-6xl mx-auto text-center">
          <div
            className="mb-6 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="">
              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight py-0 px-0 my-0 mx-[110px]"></h2>
                <p className="text-base md:text-lg text-gray-400 font-black"></p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <AnimatedHero />
          </div>

          <p
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in"
            style={{ animationDelay: "0.6s" }}
          >
            Дистрибуция, продвижение и аналитика для артистов.
            <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-semibold">
              {" "}
              Без скрытых комиссий
            </span>{" "}
            и сложных договоров.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-12 md:mb-16 animate-fade-in px-4"
            style={{ animationDelay: "0.8s" }}
          >
            <Button
              onClick={() => navigate("/app")}
              size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 hover:shadow-2xl hover:shadow-yellow-500/50 text-black font-bold text-base md:text-lg px-8 md:px-10 py-5 md:py-7 border-0 group transition-all duration-500 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Начать бесплатно
                <Icon
                  name="ArrowRight"
                  className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform"
                />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
            <Button
              size="lg"
              className="relative overflow-hidden bg-white/5 backdrop-blur-xl border border-white/10 hover:border-yellow-500/50 text-white font-semibold text-base md:text-lg px-8 md:px-10 py-5 md:py-7 group transition-all duration-500 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Узнать больше
                <Icon
                  name="PlayCircle"
                  className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform"
                />
              </span>
            </Button>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto animate-fade-in"
            style={{ animationDelay: "1s" }}
          >
            {[
              { value: "10+", label: "лет опыта", gradient: "from-yellow-500 to-orange-500" },
              { value: "500+", label: "релизов", gradient: "from-amber-500 to-yellow-600" },
              { value: "50+", label: "артистов", gradient: "from-orange-500 to-amber-600" },
              { value: "24/7", label: "поддержка", gradient: "from-yellow-600 to-orange-600" },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative group p-4 md:p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:border-yellow-500/50 transition-all duration-500"
              >
                <div className="relative z-10">
                  <div
                    className={`text-3xl md:text-4xl font-bold mb-1 md:mb-2 bg-gradient-to-br ${stat.gradient} text-transparent bg-clip-text`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

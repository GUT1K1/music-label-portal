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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,146,60,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(234,179,8,0.15),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(249,115,22,0.1),transparent_50%)]" />
      
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(251, 146, 60, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251, 146, 60, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-12 md:mb-16">
            <AnimatedHero />
          </div>

          <h1
            className="text-2xl md:text-3xl lg:text-4xl text-gray-300 mb-6 max-w-4xl mx-auto leading-relaxed animate-fade-in font-light"
            style={{ animationDelay: "0.3s" }}
          >
            Музыкальный лейбл нового поколения.
            <br />
            <span className="text-transparent bg-gradient-to-r from-yellow-400 via-orange-400 to-amber-500 bg-clip-text font-bold">
              Дистрибуция, продвижение и аналитика
            </span>
            {" "}без скрытых комиссий.
          </h1>

          <div
            className="flex flex-col sm:flex-row gap-4 md:gap-5 justify-center mb-16 md:mb-20 animate-fade-in px-4"
            style={{ animationDelay: "0.5s" }}
          >
            <Button
              onClick={() => navigate("/app")}
              size="lg"
              className="relative overflow-hidden bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:shadow-2xl hover:shadow-orange-500/40 text-black font-bold text-base md:text-lg px-10 md:px-12 py-6 md:py-8 border-0 group transition-all duration-300 w-full sm:w-auto rounded-full"
            >
              <span className="relative z-10 flex items-center gap-2 justify-center">
                Начать сейчас
                <Icon
                  name="ArrowRight"
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                />
              </span>
            </Button>
          </div>

          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-5xl mx-auto animate-fade-in"
            style={{ animationDelay: "0.7s" }}
          >
            {[
              { value: "10+", label: "лет опыта" },
              { value: "500+", label: "релизов" },
              { value: "50+", label: "артистов" },
              { value: "24/7", label: "поддержка" },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative group"
              >
                <div className="text-center">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 text-transparent bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 bg-clip-text">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
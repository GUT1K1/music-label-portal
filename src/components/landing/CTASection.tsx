import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import Animated420Logo from "@/components/Animated420Logo";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

export default function CTASection() {
  const navigate = useNavigate();
  const ctaAnimation = useScrollAnimation({ threshold: 0.3 });

  return (
    <section className="relative py-24 md:py-40">
      <div className="container mx-auto px-4">
        <div 
          ref={ctaAnimation.ref}
          className={`max-w-5xl mx-auto transition-all duration-1000 ${
            ctaAnimation.isVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-20 scale-95'
          }`}
        >
          <div className="relative p-12 md:p-20 backdrop-blur-sm bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-orange-500/10 rounded-[2.5rem] border border-orange-500/20 overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />

            <div className="relative z-10 text-center">
              <div className="flex justify-center items-center mb-8 md:mb-10">
                <div className="scale-90 md:scale-100">
                  <Animated420Logo />
                </div>
              </div>

              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-8 text-white leading-tight">
                Готов выпустить свой трек?
              </h2>
              <p className="text-lg md:text-2xl text-gray-300 mb-10 md:mb-12 max-w-3xl mx-auto font-light leading-relaxed">
                Присоединяйся к{" "}
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold">
                  420
                </span>{" "}
                и начни зарабатывать на своей музыке уже сегодня
              </p>
              <Button
                onClick={() => navigate("/app")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-yellow-500 via-orange-500 to-amber-500 hover:shadow-2xl hover:shadow-orange-500/40 text-black font-bold text-lg md:text-xl px-12 md:px-16 py-6 md:py-8 border-0 group/btn transition-all duration-300 rounded-full"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Начать прямо сейчас
                  <Icon
                    name="ArrowRight"
                    className="w-5 h-5 md:w-6 md:h-6 group-hover/btn:translate-x-1 transition-transform"
                  />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
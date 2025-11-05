import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import { useNavigate } from "react-router-dom";
import Animated420Logo from "@/components/Animated420Logo";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 md:p-16 backdrop-blur-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-3xl border border-yellow-500/30 overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-orange-500/10 to-amber-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />

            <div className="relative z-10 text-center">
              <div className="flex justify-center items-center mb-6 md:mb-8">
                <div className="scale-75 md:scale-100">
                  <Animated420Logo />
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 text-white leading-tight">
                Готов выпустить свой трек?
              </h2>
              <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto">
                Присоединяйся к{" "}
                <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-semibold">
                  420 Records
                </span>{" "}
                и начни зарабатывать на своей музыке уже сегодня
              </p>
              <Button
                onClick={() => navigate("/app")}
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-yellow-600 via-orange-600 to-amber-600 hover:shadow-2xl hover:shadow-yellow-500/50 text-black font-bold text-base md:text-lg px-8 md:px-12 py-5 md:py-7 border-0 group/btn transition-all duration-500"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Начать прямо сейчас
                  <Icon
                    name="Sparkles"
                    className="w-4 h-4 md:w-5 md:h-5 group-hover/btn:rotate-12 group-hover/btn:scale-110 transition-transform"
                  />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import Icon from "@/components/ui/icon";

export default function FooterSection() {
  return (
    <footer className="relative py-12 md:py-16 border-t border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 md:gap-12 mb-8 md:mb-12">
            <div className="md:col-span-2">
              <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
                420
              </h3>
              <p className="text-sm md:text-base text-gray-400 mb-4 md:mb-6 max-w-md">
                Независимый музыкальный лейбл, помогающий артистам достигать
                успеха
              </p>
              <div className="flex gap-3 md:gap-4">
                {[
                  { icon: "Instagram", label: "Instagram" },
                  { icon: "MessageCircle", label: "Telegram" },
                  { icon: "Music", label: "VK" },
                ].map((social) => (
                  <button
                    key={social.label}
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 hover:bg-yellow-500/20 border border-white/10 hover:border-yellow-500/50 flex items-center justify-center transition-all duration-300 group"
                  >
                    <Icon
                      name={social.icon}
                      className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-yellow-500 transition-colors"
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-white">
                Сервисы
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                {["Дистрибуция", "Промо", "Аналитика", "Поддержка"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="hover:text-yellow-500 transition-colors inline-flex items-center gap-1 group"
                      >
                        <Icon
                          name="ChevronRight"
                          className="w-3 h-3 opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all"
                        />
                        <span>{item}</span>
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-sm md:text-base font-semibold mb-3 md:mb-4 text-white">
                Контакты
              </h4>
              <ul className="space-y-2 text-xs md:text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                  <a href="mailto:label420.inbox@yandex.ru" className="hover:text-yellow-500 transition-colors">
                    label420.inbox@yandex.ru
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <Icon
                    name="MessageCircle"
                    className="w-3 h-3 md:w-4 md:h-4 text-yellow-500"
                  />
                  <a href="https://t.me/label420inbox" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-500 transition-colors">
                    @label420inbox
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-500">
            <p>© 2025 420. Все права защищены</p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-6">
              <a
                href="/terms"
                className="hover:text-yellow-500 transition-colors"
              >
                Публичная оферта
              </a>
              <a
                href="/privacy"
                className="hover:text-yellow-500 transition-colors"
              >
                Политика конфиденциальности
              </a>
              <a
                href="/marketing"
                className="hover:text-yellow-500 transition-colors"
              >
                Согласие на рекламу
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
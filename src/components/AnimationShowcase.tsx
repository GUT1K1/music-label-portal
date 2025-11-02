export default function AnimationShowcase() {
  const variants = [
    {
      id: 1,
      name: "Жидкое золото",
      font: "font-black",
      gradient: "from-yellow-300 via-amber-400 via-orange-500 via-yellow-400 to-amber-300",
      animation: "animate-liquid-gold",
      size: "text-7xl"
    },
    {
      id: 2,
      name: "Электрическое сияние",
      font: "font-black",
      gradient: "from-amber-200 via-yellow-400 via-orange-400 via-amber-500 to-yellow-200",
      animation: "animate-electric",
      size: "text-7xl"
    },
    {
      id: 3,
      name: "Волна света",
      font: "font-extrabold italic",
      gradient: "from-yellow-400 via-orange-500 via-amber-400 to-yellow-400",
      animation: "animate-wave-light",
      size: "text-7xl"
    },
    {
      id: 4,
      name: "Огненный взрыв",
      font: "font-black",
      gradient: "from-orange-400 via-red-500 via-yellow-500 via-orange-400 to-red-500",
      animation: "animate-fire-burst",
      size: "text-7xl"
    },
    {
      id: 5,
      name: "Неоновый пульс",
      font: "font-bold tracking-wider",
      gradient: "from-yellow-300 via-lime-400 via-yellow-400 to-amber-400",
      animation: "animate-neon-pulse",
      size: "text-7xl"
    },
    {
      id: 6,
      name: "Плазменный поток",
      font: "font-black",
      gradient: "from-purple-400 via-pink-500 via-orange-400 via-yellow-500 to-purple-400",
      animation: "animate-plasma",
      size: "text-7xl"
    },
    {
      id: 7,
      name: "Солнечная корона",
      font: "font-black tracking-tight",
      gradient: "from-amber-300 via-orange-400 via-yellow-500 via-amber-400 to-orange-300",
      animation: "animate-solar",
      size: "text-7xl"
    },
    {
      id: 8,
      name: "Голографик",
      font: "font-bold",
      gradient: "from-cyan-300 via-blue-400 via-purple-400 via-pink-400 via-yellow-400 to-cyan-300",
      animation: "animate-holographic",
      size: "text-7xl"
    },
    {
      id: 9,
      name: "Магма",
      font: "font-black",
      gradient: "from-red-600 via-orange-500 via-yellow-400 via-orange-500 to-red-600",
      animation: "animate-magma",
      size: "text-7xl"
    },
    {
      id: 10,
      name: "Хром + золото",
      font: "font-black tracking-tighter",
      gradient: "from-gray-300 via-yellow-200 via-amber-300 via-gray-200 via-yellow-300 to-gray-300",
      animation: "animate-chrome-gold",
      size: "text-7xl"
    }
  ];

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-4 text-amber-400">
        Выбери анимацию
      </h1>
      <p className="text-center text-gray-400 mb-12">Кликни на номер варианта чтобы выбрать</p>
      
      <div className="space-y-16">
        {variants.map((variant) => (
          <div 
            key={variant.id}
            className="border border-amber-900/30 rounded-2xl p-8 bg-gradient-to-b from-amber-950/20 to-transparent hover:border-amber-600/50 transition-all cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(variant.id.toString());
              alert(`Вариант ${variant.id} "${variant.name}" скопирован! Напиши мне номер в чат.`);
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-amber-500">
                #{variant.id} — {variant.name}
              </h2>
              <button className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded-lg transition-colors">
                Выбрать
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center min-h-[300px] bg-black/40 rounded-xl p-8">
              <div className={`${variant.size} ${variant.font} leading-tight text-center`}>
                <div className="mb-2">
                  <span 
                    className={`inline-block bg-gradient-to-r ${variant.gradient} bg-clip-text text-transparent ${variant.animation}`}
                    style={{ paddingBottom: '1.5rem' }}
                  >
                    Выпускай
                  </span>
                </div>
                
                <div className="mb-2">
                  <span 
                    className={`inline-block bg-gradient-to-r ${variant.gradient} bg-clip-text text-transparent ${variant.animation}`}
                    style={{ animationDelay: '0.3s', paddingBottom: '1.5rem' }}
                  >
                    музыку
                  </span>
                </div>
                
                <div>
                  <span 
                    className={`inline-block bg-gradient-to-r ${variant.gradient} bg-clip-text text-transparent ${variant.animation}`}
                    style={{ animationDelay: '0.6s', paddingBottom: '1.5rem' }}
                  >
                    на всех площадках
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

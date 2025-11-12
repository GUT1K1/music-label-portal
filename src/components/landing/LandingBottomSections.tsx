import Icon from "@/components/ui/icon";
import BlogCarousel from "./BlogCarousel";
import { useState, useRef } from "react";

interface LandingBottomSectionsProps {
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function LandingBottomSections({ 
  handleMouseMove, 
  handleMouseLeave
}: LandingBottomSectionsProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);



  const allPlatforms = [
    { name: "Spotify", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512"><path fill="#1DB954" d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/></svg>`, size: 70 },
    { name: "Apple Music", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><path fill="#FA243C" d="M37 4H13C8.582 4 5 7.582 5 12v26c0 4.418 3.582 8 8 8h24c4.418 0 8-3.582 8-8V12c0-4.418-3.582-8-8-8zm-5.701 30.826c-1.801.836-4.801-.115-4.801-2.834V19.25c0-1.535.902-2.033 1.699-2.045 1.402-.021 2.151.67 3.602 1.17l8.8 3.051c1.098.375 1.402.977 1.402 2.096v11.836c0 2.594-2.699 3.52-4.301 2.795-1.398-.635-2.199-2.117-2.199-3.654 0-1.42.898-2.553 2.199-3.195 1-.491 2.1-.459 2.699-.176V21.65l-8.3-2.873v13.459c0 2.627-2.801 3.549-4.401 2.787-1.398-.666-2.199-2.148-2.199-3.654 0-1.42.898-2.553 2.199-3.195 1-.491 2.1-.459 2.699-.176v-9.742c0-1.387.754-2.227 1.902-2.396.656-.098 1.398.031 2.199.354l10.602 3.67c.598.208.699.531.699 1.068v.011z"/></svg>`, size: 65 },
    { name: "Яндекс.Музыка", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="#FFCC00" width="50" height="50" rx="8"/><path fill="#000" d="M31 13h-6c-4 0-7 2.5-7 7v10c0 4.5 3 7 7 7h.5v-6H25c-1.7 0-2.5-1-2.5-2.5v-9c0-1.5.8-2.5 2.5-2.5h6V13z"/></svg>`, size: 65 },
    { name: "YouTube Music", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="#FF0000" d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm115.494 263.295l-163.494 96.496c-7.639 4.512-17.494-.814-17.494-9.449V154.657c0-8.635 9.855-13.961 17.494-9.449l163.494 96.496c7.639 4.512 7.639 14.384 0 18.896z"/></svg>`, size: 70 },
    { name: "VK Музыка", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect fill="#1976D2" width="48" height="48" rx="8"/><path fill="#fff" d="M34.9 15.2c.2-.6 0-1-.9-1h-3c-.8 0-1.2.4-1.4 1 0 0-1.6 3.8-3.9 6.3-.7.7-1.1.9-1.5.9-.2 0-.5-.2-.5-.9v-6.1c0-.8-.2-1.2-1-1.2h-4.7c-.5 0-.8.3-.8.7 0 .8 1.2.9 1.3 3v4.5c0 1-.2 1.2-.6 1.2-1.1 0-3.8-3.9-5.4-8.3-.3-.9-.6-1.2-1.4-1.2h-3c-.9 0-1.1.4-1.1 1 0 .9 1.1 4.9 5 10.3 2.6 3.6 6.3 5.6 9.6 5.6 2 0 2.2-.5 2.2-1.3v-3c0-.9.2-1.1.9-1.1.5 0 1.4.3 3.5 2.3 2.4 2.4 2.8 3.5 4.2 3.5h3c.9 0 1.3-.5 1.1-1.4-.3-.9-1.3-2.3-2.7-3.9-.7-.9-1.9-1.9-2.2-2.4-.5-.6-.4-.9 0-1.5 0 0 3.8-5.3 4.2-7.1z"/></svg>`, size: 65 },
    { name: "Deezer", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="#FF0092" width="50" height="50" rx="8"/><g fill="#fff"><rect x="8" y="28" width="8" height="4"/><rect x="8" y="34" width="8" height="4"/><rect x="18" y="22" width="8" height="4"/><rect x="18" y="28" width="8" height="4"/><rect x="18" y="34" width="8" height="4"/><rect x="28" y="16" width="8" height="4"/><rect x="28" y="22" width="8" height="4"/><rect x="28" y="28" width="8" height="4"/><rect x="28" y="34" width="8" height="4"/></g></svg>`, size: 65 },
    { name: "SoundCloud", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="#FF5500" width="50" height="50" rx="8"/><path fill="#fff" d="M10 27h1v3h-1v-3zm2-2h1v5h-1v-5zm2-1h1v6h-1v-6zm2 1h1v5h-1v-5zm2-3h1v8h-1v-8zm2 2h1v6h-1v-6zm2-1h1v7h-1v-7zm2 0h1v7h-1v-7zm3-3c-3.3 0-6 2.7-6 6s2.7 6 6 6h9c2.2 0 4-1.8 4-4 0-1.9-1.4-3.5-3.2-3.9-.3-2.3-2.3-4.1-4.8-4.1-1.3 0-2.5.5-3.4 1.4-.8-.9-2-1.4-3.2-1.4z"/></svg>`, size: 75 },
    { name: "Amazon Music", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="#00A8E1" width="50" height="50" rx="8"/><path fill="#fff" d="M35.5 32c-.3 0-.5-.1-.7-.3-2.8-2.5-3.3-3.7-4.8-6.1-.1-.2-.3-.3-.5-.3-3.2 0-5.5-2.5-5.5-5.8 0-3.2 2.5-5.8 5.8-5.8s5.8 2.5 5.8 5.8c0 2.3-1.2 4.3-3 5.3.9 1.5 1.8 2.8 3.5 4.3.3.3.4.6.2 1-.2.6-.5.9-.8.9zm-5.3-16.5c-2.3 0-4.2 1.9-4.2 4.2s1.9 4.2 4.2 4.2 4.2-1.9 4.2-4.2-1.9-4.2-4.2-4.2zm-15.7 17c-1.7 0-3-.8-3-2.5 0-1.8 1.5-2.5 3.5-2.8 1.5-.3 3.5-.5 5-.8v.5c0 2.8-1.2 5.5-5.5 5.5zm6.7-13.8c0-1.8-.3-3.5-1.5-4.8-1-.9-2.5-1.3-3.8-1.3-2.8 0-5 1.2-5 4.5 0 .5.3.8.8.8h1c.5 0 .8-.3.8-.8.2-1 1-1.5 2-1.5.5 0 1.2.2 1.5.7.5.5.5 1.2.5 1.8v1c-1.8.3-4.2.5-6 1-2 .5-4.2 1.7-4.2 4.3 0 2.8 1.8 4.2 4.2 4.2 2 0 3-.5 4.5-2 .5.8.7 1.2 1.2 1.7.3.2.7.2 1 0 .8-.7 2.3-2 3.2-2.7.3-.3.3-.7 0-1-.7-.7-1.2-1.3-1.2-2.5v-3.4z"/></svg>`, size: 70 },
    { name: "Tidal", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="#000" width="50" height="50" rx="8"/><path fill="#fff" d="M25 16l-6 6 6 6 6-6-6-6zm0 12l-6 6 6 6 6-6-6-6zm-12-6l-6 6 6 6 6-6-6-6zm24 0l-6 6 6 6 6-6-6-6z"/></svg>`, size: 60 },
    { name: "Pandora", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="#005483" width="50" height="50" rx="8"/><path fill="#fff" d="M18 12h5c5.5 0 10 4.5 10 10s-4.5 10-10 10h-2v6h-3V12zm3 17h2c4.4 0 8-3.6 8-8s-3.6-8-8-8h-2v16z"/></svg>`, size: 65 },
    { name: "Shazam", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><linearGradient id="shazam" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#0088FF"/><stop offset="100%" style="stop-color:#00D4FF"/></linearGradient></defs><rect fill="url(#shazam)" width="50" height="50" rx="12"/><path fill="#fff" d="M30 14c1.7 0 3 1.3 3 3v8.5c0 .8-.7 1.5-1.5 1.5s-1.5-.7-1.5-1.5V17c0-.6-.4-1-1-1h-8.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5H30zm-10 22c-1.7 0-3-1.3-3-3v-8.5c0-.8.7-1.5 1.5-1.5s1.5.7 1.5 1.5V33c0 .6.4 1 1 1h8.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5H20z"/></svg>`, size: 65 },
    { name: "TikTok", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="#000" width="50" height="50" rx="8"/><path fill="#25F4EE" d="M34 18.5c-2.5 0-4.5-2-4.5-4.5h-3.5v16c0 2.2-1.8 4-4 4s-4-1.8-4-4 1.8-4 4-4c.4 0 .8.1 1.2.2v-3.6c-.4 0-.8-.1-1.2-.1-4.1 0-7.5 3.4-7.5 7.5S18 38 22 38s7.5-3.4 7.5-7.5V20c1.6 1.1 3.5 1.8 5.5 1.8v-3.5c-1.7.1-3.1-.8-4-2.1-.9-1.3-.9-2.8 0-4.1.9-1.3 2.3-2.1 4-2.1V6.5c-3.3 0-6 2.7-6 6 0 .8.2 1.5.5 2.2.4.8 1 1.5 1.8 2 1.5 1 3.4 1.3 5.2.8z"/><path fill="#FE2C55" d="M34 15v3.5c-2 0-3.9-.7-5.5-1.8v10.8c0 4.1-3.4 7.5-7.5 7.5s-7.5-3.4-7.5-7.5 3.4-7.5 7.5-7.5c.4 0 .8 0 1.2.1v3.6c-.4-.1-.8-.2-1.2-.2-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4V10h3.5c0 2.5 2 4.5 4.5 4.5v3.5c-1.8.5-3.7.2-5.2-.8-.8-.5-1.4-1.2-1.8-2-.3-.7-.5-1.4-.5-2.2 0-3.3 2.7-6 6-6v3.5z"/></svg>`, size: 65 },
    { name: "Instagram", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><linearGradient id="ig" x1="0%" y1="100%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#FFDC80"/><stop offset="25%" style="stop-color:#FCAF45"/><stop offset="50%" style="stop-color:#F77737"/><stop offset="75%" style="stop-color:#F56040"/><stop offset="100%" style="stop-color:#FD1D1D"/></linearGradient></defs><rect fill="url(#ig)" width="50" height="50" rx="12"/><path fill="#fff" d="M25 16c-2.4 0-2.7 0-3.7.1-.9 0-1.6.2-2.1.5-.6.2-1 .5-1.5 1s-.8.9-1 1.5c-.3.5-.5 1.2-.5 2.1-.1 1-.1 1.3-.1 3.7s0 2.7.1 3.7c0 .9.2 1.6.5 2.1.2.6.5 1 1 1.5s.9.8 1.5 1c.5.3 1.2.5 2.1.5 1 .1 1.3.1 3.7.1s2.7 0 3.7-.1c.9 0 1.6-.2 2.1-.5.6-.2 1-.5 1.5-1s.8-.9 1-1.5c.3-.5.5-1.2.5-2.1.1-1 .1-1.3.1-3.7s0-2.7-.1-3.7c0-.9-.2-1.6-.5-2.1-.2-.6-.5-1-1-1.5s-.9-.8-1.5-1c-.5-.3-1.2-.5-2.1-.5-1-.1-1.3-.1-3.7-.1zm0 1.6c2.4 0 2.6 0 3.6.1.9 0 1.3.2 1.6.3.4.2.7.3 1 .6.3.3.5.6.6 1 .1.3.3.8.3 1.6.1 1 .1 1.3.1 3.6s0 2.6-.1 3.6c0 .9-.2 1.3-.3 1.6-.2.4-.3.7-.6 1-.3.3-.6.5-1 .6-.3.1-.8.3-1.6.3-1 .1-1.3.1-3.6.1s-2.6 0-3.6-.1c-.9 0-1.3-.2-1.6-.3-.4-.2-.7-.3-1-.6-.3-.3-.5-.6-.6-1-.1-.3-.3-.8-.3-1.6-.1-1-.1-1.3-.1-3.6s0-2.6.1-3.6c0-.9.2-1.3.3-1.6.2-.4.3-.7.6-1 .3-.3.6-.5 1-.6.3-.1.8-.3 1.6-.3 1-.1 1.3-.1 3.6-.1zM25 21c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4-1.8-4-4-4zm0 6.6c-1.4 0-2.6-1.2-2.6-2.6s1.2-2.6 2.6-2.6 2.6 1.2 2.6 2.6-1.2 2.6-2.6 2.6zm5.1-6.8c0 .5-.4.9-.9.9s-.9-.4-.9-.9.4-.9.9-.9.9.4.9.9z"/></svg>`, size: 65 },
    { name: "Napster", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><rect fill="#000" width="50" height="50" rx="8"/><circle fill="#00D1FF" cx="17" cy="20" r="4"/><circle fill="#FF006E" cx="33" cy="20" r="4"/><path fill="#fff" d="M14 27c0-3 2-5 5-5h12c3 0 5 2 5 5v6H14v-6z"/></svg>`, size: 60 },
    { name: "Anghami", svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50"><defs><linearGradient id="ang" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#9B1C8E"/><stop offset="100%" style="stop-color:#5E1F8B"/></linearGradient></defs><rect fill="url(#ang)" width="50" height="50" rx="12"/><path fill="#fff" d="M25 12l8 8v13l-8 5-8-5V20l8-8zm0 3l-5 5v10l5 3 5-3V20l-5-5z"/></svg>`, size: 65 },
  ];

  const platforms1 = allPlatforms.slice(0, 6);
  const platforms2 = allPlatforms.slice(6, 11);
  const platforms3 = allPlatforms.slice(11, 16);

  const faqs = [
    {
      q: "Сколько стоит выпуск релиза?",
      a: "Выпуск релиза бесплатный. Мы зарабатываем небольшой процент с твоих роялти — ты платишь, только когда зарабатываешь."
    },
    {
      q: "Как быстро выйдет моя музыка?",
      a: "После загрузки трека модерация занимает 1-2 дня. Затем релиз появляется на всех площадках в течение 3-5 дней."
    },
    {
      q: "Могу ли я удалить свою музыку?",
      a: "Да, в любой момент ты можешь удалить релиз со всех платформ. Все права принадлежат тебе, ты полностью контролируешь свой контент."
    },
    {
      q: "Когда я получу деньги?",
      a: "Музыкальные платформы передают данные о прослушиваниях с задержкой 1-3 месяца. Мы делаем выплаты 2 раза в месяц после получения данных."
    },
  ];

  return (
    <>
      <section id="platforms" className="py-32 px-6 lg:px-12 relative scroll-animate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-400/30 rounded-full mb-6">
              <span className="text-purple-300 font-bold text-sm uppercase tracking-wider">Везде где ты слушаешь</span>
            </div>
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6">
              <span className="bg-gradient-to-r from-purple-200 via-pink-400 to-purple-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">170+ музыкальных платформ</span>
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Твоя музыка будет доступна миллионам слушателей по всему миру
            </p>
          </div>
          
          <div className="relative space-y-6 py-4">
            <div className="overflow-hidden px-4">
              <div className="flex gap-8 py-6 animate-scroll-right">
                {[...platforms1, ...platforms1, ...platforms1, ...platforms1].map((platform, i) => (
                  <div
                    key={i}
                    className="group flex-shrink-0 relative select-none"
                    style={{ width: `${platform.size}px`, height: `${platform.size}px` }}
                  >
                    <div 
                      className="w-full h-full group-hover:scale-125 transition-all duration-500 drop-shadow-2xl group-hover:drop-shadow-[0_0_35px_rgba(255,255,255,0.6)]" 
                      dangerouslySetInnerHTML={{ __html: platform.svg }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden px-4">
              <div className="flex gap-8 py-6 animate-scroll-left">
                {[...platforms2, ...platforms2, ...platforms2, ...platforms2].map((platform, i) => (
                  <div
                    key={i}
                    className="group flex-shrink-0 relative select-none"
                    style={{ width: `${platform.size}px`, height: `${platform.size}px` }}
                  >
                    <div 
                      className="w-full h-full group-hover:scale-125 transition-all duration-500 drop-shadow-2xl group-hover:drop-shadow-[0_0_35px_rgba(255,255,255,0.6)]" 
                      dangerouslySetInnerHTML={{ __html: platform.svg }}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="overflow-hidden px-4">
              <div className="flex gap-8 py-6 animate-scroll-right">
                {[...platforms3, ...platforms3, ...platforms3, ...platforms3].map((platform, i) => (
                  <div
                    key={i}
                    className="group flex-shrink-0 relative select-none"
                    style={{ width: `${platform.size}px`, height: `${platform.size}px` }}
                  >
                    <div 
                      className="w-full h-full group-hover:scale-125 transition-all duration-500 drop-shadow-2xl group-hover:drop-shadow-[0_0_35px_rgba(255,255,255,0.6)]" 
                      dangerouslySetInnerHTML={{ __html: platform.svg }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-400/20 rounded-full">
              <Icon name="Plus" size={16} className="text-purple-400" />
              <span className="text-gray-400 text-sm font-semibold">+ 158 музыкальных сервисов по всему миру</span>
            </div>
          </div>
        </div>
      </section>

      <BlogCarousel />

      <section id="faq" className="py-32 px-6 lg:px-12 relative scroll-animate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-gold-500/10 to-orange-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '6s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-orange-500/10 to-gold-500/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s', animationDelay: '2s' }} />
        </div>
        
        <div className="absolute top-20 left-10 w-32 h-32 border-4 border-gold-400/10 rounded-[32px] rotate-12 animate-spin" style={{ animationDuration: '20s' }} />
        <div className="absolute bottom-20 right-20 w-24 h-24 border-4 border-orange-400/10 rounded-full animate-spin" style={{ animationDuration: '15s' }} />
        
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-24 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold-500/20 rounded-full blur-3xl" />
            
            <div className="inline-block px-8 py-3 bg-gradient-to-r from-gold-500/30 to-orange-500/30 border-2 border-gold-400/40 rounded-full mb-8 shadow-2xl shadow-gold-500/20 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold-400/20 to-orange-400/20 rounded-full blur-xl" />
              <span className="text-gold-200 font-black text-sm uppercase tracking-wider relative z-10">Ответы на вопросы</span>
            </div>
            
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 relative">
              <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%] drop-shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                Популярные вопросы
              </span>
            </h2>
            
            <div className="h-1 w-40 mx-auto bg-gradient-to-r from-transparent via-gold-400 to-transparent rounded-full" />
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="group relative"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                  transform: 'perspective(2000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
                  transition: 'transform 0.3s ease-out'
                }}
              >
                <div className={`absolute -inset-1 bg-gradient-to-r from-gold-600/40 via-orange-600/40 to-gold-600/40 rounded-[28px] blur-xl opacity-0 transition-all duration-700 ${openIndex === i ? 'opacity-100 animate-gradient-x' : ''}`} />
                
                <div className={`relative bg-black/70 backdrop-blur-xl border-2 rounded-3xl transition-all duration-500 overflow-hidden ${openIndex === i ? 'border-gold-500/80 shadow-2xl shadow-gold-500/30 -translate-y-2' : 'border-gold-500/30 group-hover:border-gold-500/50 group-hover:-translate-y-1'}`}>
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-gold-500/20 to-transparent rounded-full blur-3xl opacity-0 transition-opacity duration-700 ${openIndex === i ? 'opacity-100' : ''}`} />
                  <div className={`absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-orange-500/20 to-transparent rounded-full blur-3xl opacity-opacity-0 transition-opacity duration-700 ${openIndex === i ? 'opacity-100' : ''}`} />
                  
                  <div className={`absolute top-8 right-8 w-32 h-32 border-2 border-gold-400/20 rounded-[24px] rotate-12 transition-all duration-700 ${openIndex === i ? 'scale-150' : 'group-hover:rotate-45'}`} />
                  <div className={`absolute bottom-8 left-8 w-24 h-24 border-2 border-orange-400/20 rounded-full -rotate-12 transition-all duration-700 ${openIndex === i ? 'scale-150' : 'group-hover:-rotate-45'}`} />
                  
                  <button 
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className="w-full p-10 flex items-center justify-between cursor-pointer group/button text-left"
                  >
                    <span className="flex items-center gap-5 flex-1 pr-4">
                      <div className="relative flex-shrink-0">
                        <div className={`absolute inset-0 bg-gradient-to-br from-gold-500 to-orange-500 rounded-2xl blur-lg opacity-60 transition-all duration-500 ${openIndex === i ? 'scale-125' : ''}`} />
                        <div className={`relative w-16 h-16 bg-gradient-to-br from-gold-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/50 transition-all duration-500 ${openIndex === i ? 'scale-125' : 'group-hover:scale-110 group-hover:rotate-12'}`}>
                          <span className="text-black font-black text-2xl">{i + 1}</span>
                        </div>
                      </div>
                      
                      <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${openIndex === i ? 'text-gold-100' : 'text-white group-hover:text-gold-200'}`}>
                        {faq.q}
                      </h3>
                    </span>
                    
                    <div className="relative flex-shrink-0 group-hover/button:scale-110 transition-transform duration-300">
                      <div className="absolute inset-0 bg-gold-500/40 rounded-2xl blur-2xl opacity-0 group-hover/button:opacity-100 transition-opacity duration-300" />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-gold-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-gold-500/50 border-2 border-gold-300/50">
                        <Icon name="ChevronDown" size={32} className={`text-black font-bold transition-all duration-500 ${openIndex === i ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                  </button>
                  
                  {openIndex === i && (
                    <div className="px-10 pb-10 animate-fade-in-up">
                      <div className="pl-[76px] relative">
                        <div className="absolute left-8 top-0 w-0.5 h-full bg-gradient-to-b from-gold-500/50 via-gold-500/30 to-transparent rounded-full" />
                        
                        <div className="relative bg-gradient-to-br from-gold-500/10 to-orange-500/10 backdrop-blur-sm border-2 border-gold-400/30 rounded-2xl p-8 shadow-xl">
                          <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-gold-400/30 to-transparent rounded-tl-2xl" />
                          <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-orange-400/30 to-transparent rounded-br-2xl" />
                          
                          <p className="text-gray-100 leading-relaxed text-lg md:text-xl relative z-10">
                            {faq.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-500 via-orange-500 to-gold-500 transition-opacity duration-500 ${openIndex === i ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 px-6 lg:px-12 relative scroll-animate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/10 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-gold-500/20 to-orange-500/20 rounded-full blur-[120px]" />
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          <div className="absolute -top-20 left-1/4 w-32 h-32 border-4 border-gold-400/20 rounded-full" />
          <div className="absolute -bottom-20 right-1/4 w-24 h-24 border-4 border-orange-400/20 rounded-full" />
          
          <div className="mb-12">
            <div className="inline-block px-6 py-2 bg-gradient-to-r from-gold-500/30 to-orange-500/30 border-2 border-gold-400/50 rounded-full mb-8 shadow-2xl shadow-gold-500/20">
              <span className="text-gold-200 font-black text-sm uppercase tracking-wider">Начни сейчас</span>
            </div>
          </div>
          
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-8">
            <span className="bg-gradient-to-r from-white via-gold-200 to-white bg-clip-text text-transparent">
              Начни зарабатывать
            </span>
            <br />
            <span className="bg-gradient-to-r from-gold-200 via-gold-400 to-gold-200 bg-clip-text text-transparent animate-shimmer bg-[length:200%_100%]">
              на музыке
            </span>
          </h2>
          
          <p className="text-gray-300 text-2xl mb-16 max-w-3xl mx-auto leading-relaxed">
            Загрузи первый трек и выведи своё творчество на новый уровень
          </p>
          
          <div className="relative inline-block">
            <div className="absolute -inset-2 bg-gradient-to-r from-gold-600 via-orange-600 to-gold-600 rounded-2xl blur-2xl opacity-70 animate-pulse" />
            
            <a
              href="/app"
              className="relative group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-gold-500 via-orange-500 to-gold-500 rounded-2xl font-black text-2xl text-black shadow-2xl hover:shadow-gold-500/50 transition-all duration-500 hover:scale-105 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-gold-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <span className="relative z-10">Загрузить трек</span>
              <Icon name="ArrowRight" size={28} className="relative z-10 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>
          
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-base">
            {[
              { icon: "Check", text: "Без скрытых комиссий" },
              { icon: "Check", text: "Быстрая модерация" },
              { icon: "Check", text: "Поддержка 24/7" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 group cursor-pointer">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-500 to-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon name={item.icon as any} size={20} className="text-black font-bold" />
                </div>
                <span className="text-gray-300 font-semibold group-hover:text-white transition-colors">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative py-20 px-6 lg:px-12 border-t border-gold-500/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
            <div>
              <div className="text-5xl font-black mb-6 bg-gradient-to-br from-yellow-300 via-gold-400 to-orange-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(234,179,8,0.4)]">
                420
              </div>
              <p className="text-gray-400 text-base leading-relaxed">Дистрибуция музыки на 170+ платформ. Зарабатывай на своём творчестве, сохраняя все права.</p>
            </div>
            
            <div>
              <h3 className="text-white font-black mb-6 text-sm uppercase tracking-wider">Навигация</h3>
              <div className="flex flex-col gap-4">
                {[
                  { href: "#features", text: "Возможности" },
                  { href: "#platforms", text: "Платформы" },
                  { href: "#faq", text: "Вопросы" }
                ].map((link, i) => (
                  <a key={i} href={link.href} className="group flex items-center gap-3 text-gray-400 hover:text-gold-300 transition-colors">
                    <div className="w-6 h-6 bg-gold-500/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Icon name="ChevronRight" size={14} className="text-gold-400" />
                    </div>
                    <span className="font-semibold">{link.text}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-black mb-6 text-sm uppercase tracking-wider">Контакты</h3>
              <div className="flex flex-col gap-4">
                <a href="mailto:support@420music.ru" className="group flex items-center gap-3 text-gray-400 hover:text-gold-300 transition-colors">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="Mail" size={18} className="text-gold-400" />
                  </div>
                  <span className="font-semibold">GUT1K@MAIL.RU</span>
                </a>
                <a href="https://t.me/music420support" className="group flex items-center gap-3 text-gray-400 hover:text-gold-300 transition-colors">
                  <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon name="MessageCircle" size={18} className="text-gold-400" />
                  </div>
                  <span className="font-semibold">Telegram</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-10 border-t border-gold-500/20">
            <p className="text-center text-gray-500 text-sm">© 2025 420.РФ Все права защищены.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
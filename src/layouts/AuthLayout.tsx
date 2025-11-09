import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(234,179,8,0.1),transparent_50%)]" />
      
      <div className="w-full max-w-md px-4 relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-yellow-500/20">
            <span className="text-3xl font-bold text-white">420</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            420 Music
          </h1>
          <p className="text-gray-400">Музыкальный клуб • Битмаркетплейс</p>
        </div>

        {children}

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2025 420 Music. Все права защищены
        </p>
      </div>
    </div>
  );
}

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  private errorResetTimer?: NodeJS.Timeout;

  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Проверяем если это ошибка загрузки модуля (частая при hot reload)
    const isChunkLoadError = error.message.includes('Failed to fetch') || 
                             error.message.includes('dynamically imported module') ||
                             error.message.includes('Importing a module script failed');
    
    // В development режиме или при ошибке загрузки - автосброс через 1 секунду
    if (import.meta.env.DEV || isChunkLoadError) {
      this.errorResetTimer = setTimeout(() => {
        console.log('ErrorBoundary: Auto-resetting error state');
        this.setState({ hasError: false, error: null });
        window.location.reload();
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.errorResetTimer) {
      clearTimeout(this.errorResetTimer);
    }
  }

  render() {
    if (this.state.hasError) {
      // В DEV режиме показываем только загрузку, т.к. будет автосброс
      if (import.meta.env.DEV) {
        return (
          <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gold-400 mx-auto mb-4"></div>
              <p className="text-gray-400">Перезагрузка...</p>
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
          <div className="text-center max-w-lg">
            <h1 className="text-6xl font-black mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Упс!
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Что-то пошло не так. Попробуй обновить страницу.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-black font-bold rounded-xl hover:scale-105 transition-transform"
            >
              Обновить страницу
            </button>
            {this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-300">
                  Технические детали
                </summary>
                <pre className="mt-4 text-xs text-gray-600 bg-gray-900 p-4 rounded overflow-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
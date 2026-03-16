import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl shadow-slate-200 border border-slate-100 text-center space-y-6">
            <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-2xl font-bold">!</span>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900 leading-tight">Beklenmedik bir hata oluştu</h2>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">Veriler yüklenirken veya işlenirken bir sorun oluştu. Bu durum genellikle zayıf internet bağlantısından veya geçici bir sunucu hatasından kaynaklanır.</p>
            </div>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-primary-600/20 hover:bg-primary-700 transition-all"
              >
                Dashboard'a Dön
              </button>
              <button 
                onClick={() => this.setState({ hasError: false })}
                className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                Yeniden Dene
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

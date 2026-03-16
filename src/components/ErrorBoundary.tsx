import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Eyvah, bir şeyler ters gitti!</h2>
          <p className="text-slate-500 max-w-md mb-8">
            Uygulama beklenmedik bir hata ile karşılaştı. Sayfayı yenilemeyi deneyebilir veya ana sayfaya dönebilirsiniz.
          </p>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
              className="gap-2"
            >
              <RotateCcw size={18} /> Yenile
            </Button>
            <Button 
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard'a Dön
            </Button>
          </div>
          {/* @ts-ignore */}
          {import.meta.env.DEV && (
            <pre className="mt-8 p-4 bg-slate-100 rounded-xl text-left text-xs text-rose-600 overflow-auto max-w-2xl">
              {this.state.error?.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

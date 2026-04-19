/**
 * Error Boundary Component
 * Catches and displays errors gracefully
 */

'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-red-200 p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Oeps! Er ging iets mis
            </h2>
            <p className="text-gray-600 mb-6">
              Er is een onverwachte fout opgetreden. Probeer de pagina te vernieuwen.
            </p>
            {this.state.error && (
              <div className="bg-red-50 rounded-lg p-3 mb-6 text-left">
                <p className="text-sm text-red-800 font-mono">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Pagina vernieuwen
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Error fallback for specific sections
export function SectionErrorFallback({ 
  title = 'Fout bij laden',
  message = 'Kon de gegevens niet laden. Probeer het opnieuw.',
  onRetry 
}: { 
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-center">
      <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
      <h3 className="font-semibold text-red-900 mb-1">{title}</h3>
      <p className="text-sm text-red-700 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-1" />
          Opnieuw proberen
        </Button>
      )}
    </div>
  );
}

// Empty state component
export function EmptyState({
  icon: Icon,
  title,
  description,
  action
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 max-w-xs mx-auto">{description}</p>
      {action}
    </div>
  );
}

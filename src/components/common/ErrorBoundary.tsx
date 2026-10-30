import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Compass, RefreshCw, ArrowLeft } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CivicLens Uncaught Exception:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8F8F5] text-[#253342]">
          <Card className="max-w-md w-full p-8 text-center space-y-6 soft-card-elevated">
            <div className="w-14 h-14 rounded-2xl bg-[#294563] text-white mx-auto flex items-center justify-center shadow-soft">
              <Compass className="w-7 h-7 text-[#8EA8C2]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold font-heading text-[#294563]">
                Something went wrong
              </h1>
              <p className="text-xs text-[#687887] leading-relaxed">
                An unexpected interface error occurred. We have safely isolated the process to protect your session.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="primary"
                onClick={this.handleReset}
                className="w-full"
                leftIcon={<RefreshCw className="w-4 h-4" />}
              >
                Reload CivicLens AI
              </Button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="text-xs font-semibold text-[#7189A4] hover:text-[#294563] py-2 inline-flex items-center justify-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to previous screen</span>
              </button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}


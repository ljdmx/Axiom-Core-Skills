// TEMPLATE_META:START
/*
@template-id: error-boundary
@version: 1.0.0
@description: React Error Boundary for graceful crash handling
@dependencies: react
@customization-points: COMPONENT_NAME
@framework: Frontend
*/
// TEMPLATE_META:END

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 text-red-800 rounded-lg border border-red-200">
                    <h2 className="text-lg font-bold">Something went wrong.</h2>
                    <p className="text-sm">Please refresh the page or try again later.</p>
                </div>
            );
        }

        return this.props.children;
    }
}

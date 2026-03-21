import React, { useRef, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

/**
 * WebGLBridge
 * 
 * A sovereign component wrapper connecting `frontend-core` React applications
 * securely to `threejs-core` Canvas renders. Ensures React states do not 
 * trigger costly 3D canvas re-renders, while maintaining Z-index spatial context.
 */

interface WebGLBridgeProps {
  canvasComponent: React.ComponentType<any>;
  canvasProps?: Record<string, any>;
  fallback?: React.ReactNode;
  zIndex?: number;
}

const DefaultFallback = () => (
  <div 
    style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.02)'
    }}
  >
    <span style={{ opacity: 0.5, fontVariantNumeric: 'tabular-nums' }}>Initializing 3D Context...</span>
  </div>
);

const ErrorFallback = () => (
  <div 
    style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      border: '1px solid rgba(255,0,0,0.2)'
    }}
  >
    <span style={{ color: '#ff4444' }}>WebGL Context Failed (XR Fallback required)</span>
  </div>
);

export const WebGLBridge: React.FC<WebGLBridgeProps> = ({ 
  canvasComponent: CanvasRender, 
  canvasProps = {},
  fallback = <DefaultFallback />,
  zIndex = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div 
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: zIndex,
        pointerEvents: 'none' // Let CSS handle interaction layers
      }}
    >
      {/* 
        We use pointer-events: auto on the inner container only if interaction is requested,
        allowing overlay UI (z-index > 0) to intercept clicks properly.
      */}
      <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={fallback}>
            <CanvasRender {...canvasProps} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default WebGLBridge;

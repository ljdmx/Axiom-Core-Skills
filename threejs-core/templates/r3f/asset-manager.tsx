import React, { Suspense } from 'react';
import { useGLTF, Html } from '@react-three/drei';

/**
 * AssetManager
 * Guarantees zero-error initialization by intercepting model load failures 
 * and preventing Canvas crashes via ErrorBoundary and Suspense layers.
 */

// Centralized preload config
export const preloadModels = (paths: string[]) => {
  paths.forEach(path => useGLTF.preload(path));
};

function LoadingFallback() {
  return (
    <Html center>
      <div style={{ color: '#fff', fontSize: '14px', fontFamily: 'monospace' }}>
        Initializing Soul Architecture...
      </div>
    </Html>
  );
}

class AssetErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ff4444" wireframe />
          <Html center>
            <div style={{ color: '#ff4444' }}>Asset Failed</div>
          </Html>
        </mesh>
      );
    }
    return this.props.children;
  }
}

export function AssetManager({ children }) {
  return (
    <AssetErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </AssetErrorBoundary>
  );
}

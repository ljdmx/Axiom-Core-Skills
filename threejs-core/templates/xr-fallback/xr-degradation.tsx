import React from 'react';

/**
 * XRDegradationFallback
 * 
 * Provides an immediate, clean CSS-based fallback when WebGL/WebGPU fails to 
 * initialize on constrained mobile devices or unsupported browsers. Adheres 
 * strictly to the Graceful Degradation Protocol.
 */

interface XRDegradationProps {
  posterUrl?: string;
  videoUrl?: string;
  fallbackMessage?: string;
}

export const XRDegradationFallback: React.FC<XRDegradationProps> = ({ 
  posterUrl, 
  videoUrl,
  fallbackMessage = "Interactive 3D experience requires a modern browser. Playing video fallback."
}) => {
  return (
    <div 
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor: '#0A0A0A',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'sans-serif'
      }}
    >
      {videoUrl ? (
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          poster={posterUrl}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.8
          }}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : posterUrl ? (
        <img 
          src={posterUrl} 
          alt="3D Fallback" 
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.8
          }} 
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ opacity: 0.6 }}>{fallbackMessage}</p>
        </div>
      )}
      
      {/* Subtle overlay indicating degraded mode */}
      <div 
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          padding: '8px 12px',
          backgroundColor: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(8px)',
          borderRadius: '4px',
          fontSize: '12px',
          letterSpacing: '0.05em',
          opacity: 0.7
        }}
      >
        LITE MODE
      </div>
    </div>
  );
};

export default XRDegradationFallback;

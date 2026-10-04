import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('🚨 HackConnect Error Boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          background: '#090d16',
          color: '#f8fafc',
          fontFamily: 'Inter, system-ui, sans-serif',
          padding: '2rem',
          gap: '1.5rem'
        }}>
          <div style={{ fontSize: '3rem' }}>⚡</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444', margin: 0 }}>
            HackConnect Runtime Error
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', textAlign: 'center', maxWidth: '500px', lineHeight: '1.6' }}>
            An unexpected error occurred during rendering. Check the browser console (F12) for full details.
          </p>
          <pre style={{
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '0.75rem',
            color: '#f87171',
            maxWidth: '600px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {this.state.error?.message || 'Unknown error'}
            {'\n\n'}
            {this.state.error?.stack?.split('\n').slice(0, 8).join('\n')}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '0.625rem 1.5rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

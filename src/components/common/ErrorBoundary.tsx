import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Typography, Button, Container, Paper } from '@mui/material';
import { ErrorOutlined } from '@mui/icons-material';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error inside ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
          <Paper elevation={4} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <ErrorOutlined color="error" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {this.state.error?.message || 'An unexpected runtime error has occurred in the application.'}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleReset}
              fullWidth
            >
              Reload Application
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

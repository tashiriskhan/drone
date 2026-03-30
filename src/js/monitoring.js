// Sentry Error Monitoring
// Add to your main.js or individual HTML pages

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

if (SENTRY_DSN) {
    // In production, you would use @sentry/browser
    // import * as Sentry from '@sentry/browser';
    //
    // Sentry.init({
    //     dsn: SENTRY_DSN,
    //     environment: import.meta.env.MODE,
    //     integrations: [
    //         new Sentry.BrowserTracing(),
    //         new Sentry.Replay()
    //     ],
    //     tracesSampleRate: 0.1,
    //     replaysSessionSampleRate: 0.1,
    //     replaysOnErrorSampleRate: 1.0
    // });

    // Global error handler
    window.addEventListener('error', (event) => {
        console.error('Global error:', event.error);
        // Sentry.captureException(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled rejection:', event.reason);
        // Sentry.captureException(event.reason);
    });

    console.log('Sentry error monitoring initialized');
}

// Performance monitoring
if (import.meta.env.PROD) {
    window.addEventListener('load', () => {
        if ('performance' in window) {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.startTime, 'ms');
        }
    });
}

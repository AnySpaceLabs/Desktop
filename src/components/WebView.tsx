import React, { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Loader2, AlertCircle, RefreshCw, Globe, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define WebviewElement type for Electron's webview
interface WebviewElement extends HTMLElement {
  src: string;
  allowpopups: string;
  addEventListener: (event: string, callback: (...args: any[]) => void) => void;
  removeEventListener: (event: string, callback: (...args: any[]) => void) => void;
  reload: () => void;
  goBack: () => void;
  goForward: () => void;
  canGoBack: () => boolean;
  canGoForward: () => boolean;
  executeJavaScript: (code: string) => Promise<any>;
  getURL: () => string;
}

interface WebViewProps {
  url: string;
  className?: string;
  isLoading?: boolean;
  onLoadingChange?: (isLoading: boolean) => void;
  onURLChange?: (newUrl: string) => void;
  onTitleChange?: (newTitle: string) => void;
  onFaviconChange?: (faviconUrl: string) => void;
}

// Define error types and messages
const ERROR_MESSAGES: Record<number, string> = {
  '-1': 'The webpage failed to load',
  '-2': 'The connection timed out',
  '-3': 'The webpage was interrupted while loading',
  '-6': 'The connection was refused',
  '-7': 'The server could not be found',
  '-21': 'Network access is disabled',
  '-105': 'The webpage could not be found',
  '-106': 'The Internet connection appears to be offline',
  '-118': 'The connection timed out',
  '-130': 'Proxy connection failed',
  '-137': 'The SSL certificate is invalid',
  '-201': 'The server refused to connect',
  '-202': 'The server took too long to respond',
  '-203': 'The connection was reset',
  '-501': 'The webpage is not secure',
};

const getErrorMessage = (code: number, description: string): string => {
  return ERROR_MESSAGES[code] || description || 'An error occurred while loading the webpage';
};

const getSuggestion = (code: number): string => {
  switch (code) {
    case -105:
    case -7:
      return "Check if the web address is correct";
    case -106:
      return "Check your Internet connection";
    case -2:
    case -118:
    case -202:
      return "The server is taking too long to respond";
    case -6:
    case -201:
      return "The server actively refused to connect";
    case -137:
      return "There's a problem with the website's security certificate";
    case -130:
      return "Check your proxy settings";
    case -21:
      return "Network access is currently disabled";
    case -501:
      return "The connection is not secure";
    default:
      return "Try refreshing the page or check your connection";
  }
};

const WebView: React.FC<WebViewProps> = ({
  url,
  className,
  isLoading: externalIsLoading,
  onLoadingChange,
  onURLChange,
  onTitleChange,
  onFaviconChange
}) => {
  const [isLoading, setIsLoading] = useState(externalIsLoading || false);
  const [isElectron, setIsElectron] = useState(false);
  const [error, setError] = useState<{
    type: string;
    code: number;
    description: string;
    url: string;
  } | null>(null);
  const webviewRef = useRef<WebviewElement | null>(null);
  const navigationTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Check if running in Electron
  useEffect(() => {
    const api = window.electronAPI;
    if (typeof window !== 'undefined' && api) {
      setIsElectron(true);

      // Listen for errors from the main process
      const handleMainError = (event: any, errorData: any) => {
        setIsLoading(false);
        onLoadingChange?.(false);
        setError(errorData);
      };

      const handleWebviewError = (event: any, errorData: any) => {
        setIsLoading(false);
        onLoadingChange?.(false);
        setError(errorData);
      };

      api.on('main:error', handleMainError);
      api.on('webview:error', handleWebviewError);

      return () => {
        // Clean up error listeners
        api.send('removeListener', 'main:error');
        api.send('removeListener', 'webview:error');
      };
    }
  }, [onLoadingChange]);
  
  // Handle loading state changes
  useEffect(() => {
    if (externalIsLoading !== undefined && externalIsLoading !== isLoading) {
      setIsLoading(externalIsLoading);
    }
  }, [externalIsLoading]);
  
  // Update loading state and notify parent
  const updateLoadingState = (loading: boolean) => {
    setIsLoading(loading);
    if (onLoadingChange) {
      onLoadingChange(loading);
    }
  };
  
  // Handle URL changes with timeout
  useEffect(() => {
    if (!url || !isElectron || !webviewRef.current) return;
    
    // Clear any existing navigation timeout
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }

    // Only update if URL has changed
    if (webviewRef.current.src !== url) {
      webviewRef.current.src = url;
      setIsLoading(true);
      onLoadingChange?.(true);
      setError(null);

      // Set a navigation timeout
      navigationTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          setError({
            type: 'timeout',
            code: -2,
            description: 'Navigation timeout',
            url
          });
          setIsLoading(false);
          onLoadingChange?.(false);
        }
      }, 30000); // 30 second timeout
    }

    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current);
      }
    };
  }, [url, isElectron, isLoading, onLoadingChange]);

  // Handle loading success
  const handleLoadSuccess = useCallback(() => {
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current);
    }
    setError(null);
    setIsLoading(false);
    onLoadingChange?.(false);
  }, [onLoadingChange]);

  // Handle favicon changes with fallback
  const handleFaviconChange = useCallback((e: any) => {
    if (!e.favicons || e.favicons.length === 0) return;

    // Try to load the favicon
    const testImage = new Image();
    testImage.onload = () => {
      onFaviconChange?.(e.favicons[0]);
    };
    testImage.onerror = () => {
      // If favicon fails to load, try the root domain favicon
      try {
        const url = new URL(e.favicons[0]);
        const rootFavicon = `${url.protocol}//${url.hostname}/favicon.ico`;
        onFaviconChange?.(rootFavicon);
      } catch {
        // If URL parsing fails, don't update the favicon
      }
    };
    testImage.src = e.favicons[0];
  }, [onFaviconChange]);

  // Set up webview event listeners
  useEffect(() => {
    if (!isElectron || !webviewRef.current) return;
    
    const webview = webviewRef.current;
    
    const handleStartLoading = () => {
      setIsLoading(true);
      onLoadingChange?.(true);
      setError(null);
    };
    
    const handleStopLoading = () => {
      handleLoadSuccess();
    };

    const handleEnterFullScreen = (e: any) => {
      e.preventDefault();
      // Prevent fullscreen
      if (webview.executeJavaScript) {
        webview.executeJavaScript(`
          document.exitFullscreen().catch(() => {});
          document.webkitExitFullscreen?.().catch(() => {});
        `).catch(() => {});
      }
    };

    const handleURLChange = () => {
      const currentURL = webview.getURL();
      onURLChange?.(currentURL);
    };

    const handleTitleChange = (e: any) => {
      onTitleChange?.(e.title);
    };

    const handleNavigation = () => {
      handleURLChange();
    };
    
    // Add event listeners
    webview.addEventListener('did-start-loading', handleStartLoading);
    webview.addEventListener('did-stop-loading', handleStopLoading);
    webview.addEventListener('enter-html-full-screen', handleEnterFullScreen);
    webview.addEventListener('enter-full-screen', handleEnterFullScreen);
    webview.addEventListener('did-navigate', handleNavigation);
    webview.addEventListener('did-navigate-in-page', handleNavigation);
    webview.addEventListener('page-title-updated', handleTitleChange);
    webview.addEventListener('page-favicon-updated', handleFaviconChange);
    webview.addEventListener('did-finish-load', handleLoadSuccess);
    
    // Clean up
    return () => {
      webview.removeEventListener('did-start-loading', handleStartLoading);
      webview.removeEventListener('did-stop-loading', handleStopLoading);
      webview.removeEventListener('enter-html-full-screen', handleEnterFullScreen);
      webview.removeEventListener('enter-full-screen', handleEnterFullScreen);
      webview.removeEventListener('did-navigate', handleNavigation);
      webview.removeEventListener('did-navigate-in-page', handleNavigation);
      webview.removeEventListener('page-title-updated', handleTitleChange);
      webview.removeEventListener('page-favicon-updated', handleFaviconChange);
      webview.removeEventListener('did-finish-load', handleLoadSuccess);
    };
  }, [isElectron, handleLoadSuccess, onLoadingChange]);
  
  if (!isElectron) {
    return (
      <div className={cn("w-full h-full flex flex-col items-center justify-center bg-white dark:bg-[#202124]", className)}>
        <div className="p-8 rounded-lg bg-gray-100 dark:bg-gray-800 max-w-md text-center">
          <h3 className="text-lg font-medium mb-2">Webview Not Available</h3>
          <p className="text-gray-600 dark:text-gray-400">
            This feature requires the Electron environment to display web content.
            In a browser environment, this would show an iframe or alternative content.
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={cn("relative w-full h-full", className)}>
      {/* Error message with retry button */}
      {error && (
        <div className="absolute inset-0 bg-white dark:bg-[#202124] flex items-center justify-center z-10">
          <div className="max-w-md w-full mx-auto p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Webpage not available
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                {getErrorMessage(error.code, error.description)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 break-all">
                {error.url}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
                {getSuggestion(error.code)}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-600 mt-2">
                Error {error.code}: {error.description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button
                onClick={() => {
                  setError(null);
                  if (webviewRef.current) {
                    setIsLoading(true);
                    onLoadingChange?.(true);
                    webviewRef.current.reload();
                  }
                }}
                className="w-full flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => {
                    setError(null);
                    onURLChange?.('');
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </Button>

                <Button
                  variant="outline"
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={() => {
                    // For invalid URLs, search the domain part only
                    let searchTerm = error.url;
                    try {
                      const url = new URL(error.url);
                      searchTerm = url.hostname;
                    } catch {
                      // If URL parsing fails, use the full string
                    }
                    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
                    if (webviewRef.current) {
                      setError(null);
                      setIsLoading(true);
                      onLoadingChange?.(true);
                      webviewRef.current.src = searchUrl;
                    }
                  }}
                >
                  <Globe className="w-4 h-4" />
                  Search on Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Electron webview */}
      <webview
        ref={webviewRef as React.RefObject<HTMLElement>}
        src={url}
        className="w-full h-full"
        style={{ 
          display: 'inline-flex', 
          position: 'absolute',
          inset: 0,
          height: '100%',
          width: '100%'
        }}
        data-allowpopups={true}
        allowFullScreen={false}
        webpreferences="contextIsolation=yes, nodeIntegration=no, sandbox=no, javascript=yes, images=yes, textAreasAreResizable=no, webgl=yes, plugins=no, fullscreen=no"
        partition="persist:main"
        useragent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
      />
    </div>
  );
};

export default WebView; 
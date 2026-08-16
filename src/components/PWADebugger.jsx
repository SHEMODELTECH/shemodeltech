// src/components/PWADebugger.jsx - Comprehensive PWA debugging component
import React, { useState, useEffect } from 'react';
import { usePWA } from '../hooks/usePWA';

const PWADebugger = () => {
  const { isInstallable, isInstalled, isOnline, updateAvailable, installing } = usePWA();
  const [debugInfo, setDebugInfo] = useState({});
  const [manifestData, setManifestData] = useState(null);
  const [swStatus, setSWStatus] = useState('checking...');
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    const gatherDebugInfo = async () => {
      // Basic PWA checks
      const info = {
        // Hook states
        hookStates: {
          isInstallable,
          isInstalled,
          isOnline,
          updateAvailable,
          installing
        },
        
        // Environment checks
        environment: {
          protocol: window.location.protocol,
          host: window.location.host,
          isLocalhost: window.location.hostname === 'localhost',
          isHTTPS: window.location.protocol === 'https:',
          userAgent: navigator.userAgent.slice(0, 100) + '...'
        },
        
        // PWA capability checks
        capabilities: {
          hasServiceWorker: 'serviceWorker' in navigator,
          hasNotifications: 'Notification' in window,
          hasBeforeInstallPrompt: 'onbeforeinstallprompt' in window,
          isStandalone: window.matchMedia('(display-mode: standalone)').matches,
          navigatorStandalone: window.navigator.standalone,
          hasManifest: !!document.querySelector('link[rel="manifest"]')
        },
        
        // Manifest checks
        manifest: {
          link: document.querySelector('link[rel="manifest"]')?.href,
          exists: null,
          valid: null,
          data: null
        },
        
        // Service Worker checks
        serviceWorker: {
          registered: null,
          active: null,
          waiting: null,
          controller: null,
          scriptURL: null
        },
        
        // Install criteria
        installCriteria: {
          hasManifest: false,
          hasServiceWorker: false,
          hasIcons: false,
          hasStartUrl: false,
          hasName: false,
          hasDisplay: false,
          isSecure: false
        }
      };

      // Check manifest
      try {
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
          const response = await fetch(manifestLink.href);
          if (response.ok) {
            const manifest = await response.json();
            info.manifest.exists = true;
            info.manifest.valid = true;
            info.manifest.data = manifest;
            setManifestData(manifest);
            
            // Check install criteria from manifest
            info.installCriteria.hasManifest = true;
            info.installCriteria.hasName = !!(manifest.name || manifest.short_name);
            info.installCriteria.hasStartUrl = !!manifest.start_url;
            info.installCriteria.hasDisplay = !!manifest.display;
            info.installCriteria.hasIcons = !!(manifest.icons && manifest.icons.length > 0);
          } else {
            info.manifest.exists = false;
            info.manifest.valid = false;
          }
        } else {
          info.manifest.exists = false;
        }
      } catch (error) {
        info.manifest.error = error.message;
      }

      // Check Service Worker
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            info.serviceWorker.registered = true;
            info.serviceWorker.active = !!registration.active;
            info.serviceWorker.waiting = !!registration.waiting;
            info.serviceWorker.scriptURL = registration.active?.scriptURL;
            info.installCriteria.hasServiceWorker = true;
            setSWStatus('registered');
          } else {
            info.serviceWorker.registered = false;
            setSWStatus('not registered');
          }
          
          info.serviceWorker.controller = !!navigator.serviceWorker.controller;
        } catch (error) {
          info.serviceWorker.error = error.message;
          setSWStatus('error');
        }
      }

      // Security check
      info.installCriteria.isSecure = info.environment.isHTTPS || info.environment.isLocalhost;

      setDebugInfo(info);
    };

    gatherDebugInfo();
  }, [isInstallable, isInstalled, isOnline, updateAvailable, installing]);

  const handleForceInstallCheck = () => {
    // Try to manually trigger beforeinstallprompt
    window.dispatchEvent(new Event('beforeinstallprompt'));
  };

  const handleClearData = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (let registration of registrations) {
        await registration.unregister();
      }
    }
    
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map(name => caches.delete(name)));
    }
    
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const getInstallabilityIssues = () => {
    const issues = [];
    const criteria = debugInfo.installCriteria;
    
    if (!criteria?.hasManifest) issues.push('❌ Manifest file missing or invalid');
    if (!criteria?.hasServiceWorker) issues.push('❌ Service Worker not registered');
    if (!criteria?.hasName) issues.push('❌ App name missing in manifest');
    if (!criteria?.hasStartUrl) issues.push('❌ Start URL missing in manifest');
    if (!criteria?.hasDisplay) issues.push('❌ Display mode missing in manifest');
    if (!criteria?.hasIcons) issues.push('❌ Icons missing in manifest');
    if (!criteria?.isSecure) issues.push('❌ App must be served over HTTPS');
    
    if (debugInfo.capabilities?.isStandalone) {
      issues.push('ℹ️ App appears to be already installed/standalone');
    }
    
    if (!debugInfo.capabilities?.hasBeforeInstallPrompt) {
      issues.push('⚠️ Browser may not support beforeinstallprompt event');
    }
    
    return issues;
  };

  const installabilityIssues = getInstallabilityIssues();

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/95 text-orange-400 p-2 sm:p-3 rounded-lg z-50 border border-orange-400 hover:bg-orange-400/10 transition-colors"
        aria-label="Open PWA debugger"
      >
        <span className="text-sm sm:text-base">🔍</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-3 sm:bottom-4 right-3 sm:right-4 left-3 sm:left-auto bg-black/95 text-white p-3 sm:p-4 rounded-lg w-auto sm:max-w-lg max-h-[60vh] sm:max-h-96 overflow-auto text-xs z-50 border border-orange-400 font-mono shadow-2xl">
      <div className="flex justify-between items-start sm:items-center mb-3 gap-2">
        <h3 className="text-orange-400 font-bold text-xs sm:text-sm flex-shrink-0">🔍 PWA Debug</h3>
        <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
          <button 
            onClick={handleForceInstallCheck}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-2 py-1 rounded text-[10px] sm:text-xs whitespace-nowrap transition-colors"
          >
            Force Check
          </button>
          <button 
            onClick={handleClearData}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 px-2 py-1 rounded text-[10px] sm:text-xs whitespace-nowrap transition-colors"
          >
            Reset PWA
          </button>
          <button 
            onClick={() => setIsMinimized(true)}
            className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 px-2 py-1 rounded text-[10px] sm:text-xs transition-colors"
            aria-label="Minimize debugger"
          >
            −
          </button>
        </div>
      </div>

      {/* PWA Status */}
      <div className="mb-2 sm:mb-3 p-2 bg-gray-800 rounded">
        <h4 className="text-orange-500 font-semibold mb-1 text-[10px] sm:text-xs">📱 PWA Status</h4>
        <div className="grid grid-cols-2 gap-1 text-[10px] sm:text-xs">
          <span className={isInstallable ? 'text-blue-400' : 'text-red-400'}>
            Installable: {isInstallable ? '✅' : '❌'}
          </span>
          <span className={isInstalled ? 'text-blue-400' : 'text-gray-400'}>
            Installed: {isInstalled ? '✅' : '❌'}
          </span>
          <span className={isOnline ? 'text-blue-400' : 'text-red-400'}>
            Online: {isOnline ? '✅' : '❌'}
          </span>
          <span className={installing ? 'text-orange-500' : 'text-gray-400'}>
            Installing: {installing ? '⏳' : '❌'}
          </span>
        </div>
      </div>

      {/* Installability Issues */}
      {installabilityIssues.length > 0 && (
        <div className="mb-2 sm:mb-3 p-2 bg-red-900/30 rounded">
          <h4 className="text-red-400 font-semibold mb-1 text-[10px] sm:text-xs">⚠️ Issues Found</h4>
          <div className="space-y-0.5 max-h-32 overflow-y-auto">
            {installabilityIssues.map((issue, index) => (
              <div key={index} className="text-[10px] sm:text-xs">{issue}</div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Checks */}
      <div className="mb-2 sm:mb-3 p-2 bg-gray-800 rounded">
        <h4 className="text-blue-400 font-semibold mb-1 text-[10px] sm:text-xs">🔧 Quick Checks</h4>
        <div className="space-y-0.5 text-[10px] sm:text-xs">
          <div>HTTPS: {debugInfo.environment?.isHTTPS ? '✅' : '❌'}</div>
          <div>Manifest: {debugInfo.capabilities?.hasManifest ? '✅' : '❌'}</div>
          <div className="truncate">Service Worker: {swStatus} {debugInfo.capabilities?.hasServiceWorker ? '✅' : '❌'}</div>
          <div>Standalone: {debugInfo.capabilities?.isStandalone ? '✅' : '❌'}</div>
        </div>
      </div>

      {/* Detailed Debug Info */}
      <details className="mb-2">
        <summary className="cursor-pointer text-orange-400 font-semibold text-[10px] sm:text-xs hover:text-orange-400">
          🔍 Detailed Debug Info
        </summary>
        <pre className="mt-2 text-[9px] sm:text-xs bg-gray-900 p-2 rounded overflow-auto max-h-32 sm:max-h-40 whitespace-pre-wrap break-words">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      </details>

      {/* Manifest Data */}
      {manifestData && (
        <details className="mb-2">
          <summary className="cursor-pointer text-orange-400 font-semibold text-[10px] sm:text-xs hover:text-orange-400">
            📄 Manifest Data
          </summary>
          <pre className="mt-2 text-[9px] sm:text-xs bg-gray-900 p-2 rounded overflow-auto max-h-32 sm:max-h-40 whitespace-pre-wrap break-words">
            {JSON.stringify(manifestData, null, 2)}
          </pre>
        </details>
      )}

      {/* Instructions */}
      <div className="text-[10px] sm:text-xs text-gray-400 mt-2 pt-2 border-t border-gray-700 leading-relaxed">
        💡 If install button not showing, check the issues above. Most common: missing manifest, not HTTPS, or already installed.
      </div>
    </div>
  );
};

export default PWADebugger;

import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { ChevronDown, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { logger } from '@/lib/logger';
import { useNetwork } from '@/contexts/NetworkContext';
import type { NetworkInfo } from '@/lib/api/types';

export type { NetworkInfo };

export interface NetworkSwitcherProps {
  className?: string;
  onNetworkChange?: (network: NetworkInfo) => void;
}

export function NetworkSwitcher({ className = '', onNetworkChange }: NetworkSwitcherProps) {
  const queryClient = useQueryClient();
  const { network: contextNetwork, setNetwork: setContextNetwork } = useNetwork();
  const [currentNetwork, setCurrentNetwork] = useState<NetworkInfo | null>(contextNetwork);
  const [availableNetworks, setAvailableNetworks] = useState<NetworkInfo[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [pendingNetwork, setPendingNetwork] = useState<NetworkInfo | null>(null);

  // Keep local display state aligned with shared network context
  useEffect(() => {
    if (contextNetwork) {
      setCurrentNetwork(contextNetwork);
    }
  }, [contextNetwork]);

  // Fetch current network info and available networks
  useEffect(() => {
    const fetchNetworkInfo = async () => {
      try {
        setLoading(true);
        
        // Fetch current network
        const currentResponse = await fetch('/api/network/info');
        if (currentResponse.ok) {
          const current = await currentResponse.json();
          setCurrentNetwork(current);
          setContextNetwork(current);
        }

        // Fetch available networks
        const availableResponse = await fetch('/api/network/available');
        if (availableResponse.ok) {
          const available = await availableResponse.json();
          setAvailableNetworks(available);
        }
      } catch (err) {
        setError('Failed to load network information');
        logger.error('Network info fetch error:', err as string);
      } finally {
        setLoading(false);
      }
    };

    fetchNetworkInfo();
  }, [setContextNetwork]);

  const handleNetworkSelect = (network: NetworkInfo) => {
    if (network.network === currentNetwork?.network) {
      setIsOpen(false);
      return;
    }

    setPendingNetwork(network);
    setShowWarning(true);
    setIsOpen(false);
  };

  const confirmNetworkSwitch = async () => {
    if (!pendingNetwork) return;

    try {
      const response = await fetch('/api/network/switch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          network: pendingNetwork.network,
        }),
      });

      if (response.ok) {
        const result = await response.json();

        // Show message about server restart requirement
        alert(result.message);

        // Clear stale React Query cache so data refetches for the new network
        queryClient.clear();

        // Update local + shared context so explorer links / badges stay consistent
        setCurrentNetwork(pendingNetwork);
        setContextNetwork(pendingNetwork);
        onNetworkChange?.(pendingNetwork);
      } else {
        throw new Error('Failed to switch network');
      }
    } catch (err) {
      setError('Failed to switch network');
      logger.error('Network switch error:', err);
    } finally {
      setShowWarning(false);
      setPendingNetwork(null);
    }
  };

  const cancelNetworkSwitch = () => {
    setShowWarning(false);
    setPendingNetwork(null);
  };

  if (loading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse" />
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    );
  }

  if (error || !currentNetwork) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <WifiOff className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-500">Network Error</span>
      </div>
    );
  }

  return (
    <>
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-border bg-card hover:bg-muted transition-colors"
          aria-label={`Network: ${currentNetwork.display_name}. Click to switch.`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: currentNetwork.color }}
          />
          <span className="text-sm font-medium text-foreground">
            {currentNetwork.display_name}
          </span>
          <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-50" role="listbox" aria-label="Available networks">
            <div className="p-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                Available Networks
              </div>
              {availableNetworks.map((network) => (
                <button
                  key={network.network}
                  onClick={() => handleNetworkSelect(network)}
                  role="option"
                  aria-selected={network.network === currentNetwork.network}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-left hover:bg-muted transition-colors ${
                    network.network === currentNetwork.network
                      ? 'bg-accent/10 border border-accent/30'
                      : ''
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: network.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">
                      {network.display_name}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {network.horizon_url}
                    </div>
                  </div>
                  {network.network === currentNetwork.network && (
                    <Wifi className="w-4 h-4 text-green-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
            <div className="border-t border-border p-3">
              <div className="text-xs text-muted-foreground">
                <div className="flex items-center space-x-1 mb-1">
                  <span className="font-medium">Current:</span>
                  <span>{currentNetwork.display_name}</span>
                </div>
                <div className="text-xs opacity-75">
                  Switching networks will require a server restart
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Network Switch Warning Modal */}
      {showWarning && pendingNetwork && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            className="bg-card border border-border rounded-xl p-6 max-w-md w-full mx-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="network-switch-title"
          >
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-500" aria-hidden="true" />
              <h3 id="network-switch-title" className="text-lg font-semibold text-foreground">
                Switch Network
              </h3>
            </div>
            <div className="mb-6">
              <p className="text-muted-foreground mb-4">
                You are about to switch from{' '}
                <span className="font-medium text-foreground">{currentNetwork.display_name}</span> to{' '}
                <span className="font-medium text-foreground">{pendingNetwork.display_name}</span>.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3">
                <div className="text-sm text-amber-400">
                  <strong>Warning:</strong> This will switch all data and connections to the{' '}
                  {pendingNetwork.is_testnet ? 'testnet' : 'mainnet'}. The server will need to restart.
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={cancelNetworkSwitch}
                className="flex-1 px-4 py-2 text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                aria-label="Cancel network switch"
              >
                Cancel
              </button>
              <button
                onClick={confirmNetworkSwitch}
                className="flex-1 px-4 py-2 text-white bg-accent rounded-lg hover:bg-accent/80 transition-colors"
                aria-label={`Confirm switch to ${pendingNetwork.display_name}`}
              >
                Switch Network
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
'use client';

import { useSyncExternalStore } from 'react';

// Store for tracking mount state to avoid hydration issues
// This is used to ensure animations only play after hydration
let isMounted = false;
const listeners = new Set<() => void>();

// Set mounted state on client
if (typeof window !== 'undefined') {
  // Run after hydration
  requestAnimationFrame(() => {
    isMounted = true;
    listeners.forEach(l => l());
  });
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return isMounted;
}

function getServerSnapshot() {
  return false;
}

/**
 * Hook to track if component has mounted on client
 * Uses useSyncExternalStore to avoid React linter warnings
 * about calling setState in useEffect
 */
export function useMounted(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

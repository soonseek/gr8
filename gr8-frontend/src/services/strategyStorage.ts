/**
 * Strategy Storage Service
 * 
 * Manages strategy persistence using localStorage
 * Provides save, load, list, and delete operations
 */

import type { BaseNode } from '@/types/nodes';
import type { Edge } from '@xyflow/react';

/**
 * Strategy metadata stored in localStorage
 */
export interface StrategyMetadata {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  nodeCount: number;
  edgeCount: number;
}

/**
 * Complete strategy data structure
 */
export interface Strategy {
  metadata: StrategyMetadata;
  nodes: BaseNode[];
  edges: Edge[];
}

const STORAGE_PREFIX = 'gr8-strategy-';
const METADATA_KEY = 'gr8-strategies-metadata';

/**
 * Generate unique strategy ID
 */
function generateStrategyId(): string {
  return `strategy-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Save strategy to localStorage
 * 
 * @param name - Strategy name
 * @param nodes - Node array
 * @param edges - Edge array
 * @param description - Optional description
 * @param existingId - Optional existing ID for update
 * @returns Strategy metadata
 */
export function saveStrategy(
  name: string,
  nodes: BaseNode[],
  edges: Edge[],
  description?: string,
  existingId?: string
): StrategyMetadata {
  const id = existingId || generateStrategyId();
  const now = new Date().toISOString();

  const metadata: StrategyMetadata = {
    id,
    name,
    description,
    createdAt: existingId ? getStrategy(existingId)?.metadata.createdAt || now : now,
    updatedAt: now,
    nodeCount: nodes.length,
    edgeCount: edges.length,
  };

  const strategy: Strategy = {
    metadata,
    nodes,
    edges,
  };

  // Save strategy data
  localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(strategy));

  // Update metadata index
  const allMetadata = getAllMetadata();
  const existingIndex = allMetadata.findIndex((m) => m.id === id);
  if (existingIndex >= 0) {
    allMetadata[existingIndex] = metadata;
  } else {
    allMetadata.push(metadata);
  }
  localStorage.setItem(METADATA_KEY, JSON.stringify(allMetadata));

  return metadata;
}

/**
 * Load strategy from localStorage
 * 
 * @param id - Strategy ID
 * @returns Strategy data or null if not found
 */
export function loadStrategy(id: string): Strategy | null {
  const data = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
  if (!data) return null;

  try {
    return JSON.parse(data) as Strategy;
  } catch (error) {
    console.error('Failed to parse strategy:', error);
    return null;
  }
}

/**
 * Get strategy (alias for loadStrategy)
 */
export function getStrategy(id: string): Strategy | null {
  return loadStrategy(id);
}

/**
 * List all strategies
 * 
 * @returns Array of strategy metadata
 */
export function listStrategies(): StrategyMetadata[] {
  return getAllMetadata().sort((a, b) => 
    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

/**
 * Delete strategy
 * 
 * @param id - Strategy ID
 * @returns true if deleted, false if not found
 */
export function deleteStrategy(id: string): boolean {
  const exists = localStorage.getItem(`${STORAGE_PREFIX}${id}`) !== null;
  if (!exists) return false;

  // Delete strategy data
  localStorage.removeItem(`${STORAGE_PREFIX}${id}`);

  // Update metadata index
  const allMetadata = getAllMetadata();
  const filtered = allMetadata.filter((m) => m.id !== id);
  localStorage.setItem(METADATA_KEY, JSON.stringify(filtered));

  return true;
}

/**
 * Get all metadata from index
 */
function getAllMetadata(): StrategyMetadata[] {
  const data = localStorage.getItem(METADATA_KEY);
  if (!data) return [];

  try {
    return JSON.parse(data) as StrategyMetadata[];
  } catch (error) {
    console.error('Failed to parse metadata:', error);
    return [];
  }
}

/**
 * Clear all strategies (use with caution!)
 */
export function clearAllStrategies(): void {
  const allMetadata = getAllMetadata();
  allMetadata.forEach((m) => {
    localStorage.removeItem(`${STORAGE_PREFIX}${m.id}`);
  });
  localStorage.removeItem(METADATA_KEY);
}

/**
 * Check localStorage availability and quota
 * 
 * @returns Storage info
 */
export function getStorageInfo(): {
  available: boolean;
  used: number;
  quota: number;
  strategyCount: number;
} {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);

    // Estimate used space
    let used = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        used += key.length + (value?.length || 0);
      }
    }

    return {
      available: true,
      used,
      quota: 5 * 1024 * 1024, // 5MB typical limit
      strategyCount: getAllMetadata().length,
    };
  } catch (error) {
    return {
      available: false,
      used: 0,
      quota: 0,
      strategyCount: 0,
    };
  }
}

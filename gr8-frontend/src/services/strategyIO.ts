/**
 * Strategy Import/Export Service
 * 
 * Handles JSON import/export with validation using Zod
 */

import { z } from 'zod';
import type { BaseNode } from '@/types/nodes';
import type { Edge } from '@xyflow/react';
import type { Strategy, StrategyMetadata } from './strategyStorage';

/**
 * Zod schema for strategy validation
 */
const NodeSchema = z.object({
  id: z.string(),
  type: z.string(),
  category: z.string().optional(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  data: z.object({
    label: z.string(),
    config: z.record(z.any()),
  }),
});

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().optional().nullable(),
  targetHandle: z.string().optional().nullable(),
});

const StrategyMetadataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  nodeCount: z.number(),
  edgeCount: z.number(),
});

const StrategySchema = z.object({
  metadata: StrategyMetadataSchema,
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

/**
 * Export strategy to JSON file
 * 
 * @param strategy - Strategy data
 * @param filename - Optional custom filename
 */
export function exportStrategyJSON(strategy: Strategy, filename?: string): void {
  const json = JSON.stringify(strategy, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename || `${strategy.metadata.name}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate and parse imported JSON
 * 
 * @param json - JSON string
 * @returns Parsed and validated strategy or error
 */
export function validateStrategyJSON(json: string): {
  success: boolean;
  data?: Strategy;
  error?: string;
} {
  try {
    const parsed = JSON.parse(json);
    const validated = StrategySchema.parse(parsed);

    return {
      success: true,
      data: validated as Strategy,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `유효하지 않은 전략 파일입니다: ${error.errors[0]?.message}`,
      };
    }
    return {
      success: false,
      error: '전략 파일을 파싱할 수 없습니다',
    };
  }
}

/**
 * Import strategy from JSON file
 * 
 * @param file - File object
 * @returns Promise with parsed strategy or error
 */
export async function importStrategyJSON(file: File): Promise<{
  success: boolean;
  data?: Strategy;
  error?: string;
}> {
  try {
    const text = await file.text();
    return validateStrategyJSON(text);
  } catch (error) {
    return {
      success: false,
      error: '파일을 읽을 수 없습니다',
    };
  }
}

/**
 * Export current nodes and edges to JSON
 * 
 * @param name - Strategy name
 * @param nodes - Node array
 * @param edges - Edge array
 * @param description - Optional description
 */
export function exportCurrentStrategy(
  name: string,
  nodes: BaseNode[],
  edges: Edge[],
  description?: string
): void {
  const now = new Date().toISOString();
  
  const strategy: Strategy = {
    metadata: {
      id: `export-${Date.now()}`,
      name,
      description,
      createdAt: now,
      updatedAt: now,
      nodeCount: nodes.length,
      edgeCount: edges.length,
    },
    nodes,
    edges,
  };

  exportStrategyJSON(strategy);
}

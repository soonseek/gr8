/**
 * Editor State Management with Zustand
 * Manages nodes, edges, and selection state for the strategy editor
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  Edge,
  Connection,
  EdgeChange,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Viewport,
} from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import type { BaseNode } from '@/types/nodes';
import { NodeType } from '@/types/nodes';
import { createNode } from '@/utils/nodeFactory';

/**
 * Editor State Interface
 */
interface EditorState {
  // State
  nodes: BaseNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedNodeIds: string[]; // 다중 선택을 위한 배열
  viewport: Viewport;

  // Actions
  setNodes: (nodes: BaseNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (type: NodeType, position: { x: number; y: number }, config?: Record<string, any>) => void;
  addNodeDirectly: (node: BaseNode) => void;
  updateNode: (id: string, data: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  deleteNodes: (ids: string[]) => void; // 다중 삭제
  setSelectedNodeId: (id: string | null) => void;
  setSelectedNodeIds: (ids: string[]) => void; // 다중 선택 설정

  // React Flow Handlers
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
}

/**
 * Editor Store with Immer middleware for immutable updates
 */
export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    // Initial State
    nodes: [],
    edges: [],
    selectedNodeId: null,
    selectedNodeIds: [],
    viewport: { x: 0, y: 0, zoom: 1 },

    // Actions
    setNodes: (nodes) =>
      set((state) => {
        state.nodes = nodes;
      }),

    setEdges: (edges) =>
      set((state) => {
        state.edges = edges;
      }),

    addNode: (type, position, config) =>
      set((state) => {
        const newNode = createNode(type, position, config);
        state.nodes.push(newNode);
      }),

    addNodeDirectly: (node) =>
      set((state) => {
        state.nodes.push(node);
      }),

    updateNode: (id, data) =>
      set((state) => {
        const node = state.nodes.find((n) => n.id === id);
        if (node && typeof node.data === 'object' && node.data !== null) {
          Object.assign(node.data, data);
        }
      }),

    deleteNode: (id) =>
      set((state) => {
        state.nodes = state.nodes.filter((n) => n.id !== id);
        // Also remove connected edges
        state.edges = state.edges.filter((e) => e.source !== id && e.target !== id);
      }),

    deleteNodes: (ids) =>
      set((state) => {
        const idSet = new Set(ids);
        state.nodes = state.nodes.filter((n) => !idSet.has(n.id));
        // Remove connected edges
        state.edges = state.edges.filter((e) => !idSet.has(e.source) && !idSet.has(e.target));
      }),

    setSelectedNodeId: (id) =>
      set((state) => {
        state.selectedNodeId = id;
      }),

    setSelectedNodeIds: (ids) =>
      set((state) => {
        state.selectedNodeIds = ids;
        // selectedNodeId도 업데이트 (단일 선택 호환)
        state.selectedNodeId = ids.length === 1 ? ids[0] : null;
      }),

    // React Flow Handlers
    onNodesChange: (changes: NodeChange[]) =>
      set((state) => {
        state.nodes = applyNodeChanges(changes, state.nodes) as BaseNode[];
      }),

    onEdgesChange: (changes: EdgeChange[]) =>
      set((state) => {
        state.edges = applyEdgeChanges(changes, state.edges);
      }),

    onConnect: (connection: Connection) =>
      set((state) => {
        state.edges = addEdge(connection, state.edges);
      }),
  }))
);

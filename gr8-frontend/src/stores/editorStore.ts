/**
 * Editor State Management with Zustand
 * Manages nodes, edges, and selection state for the strategy editor
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
  Node,
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

/**
 * Editor State Interface
 */
interface EditorState {
  // State
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  viewport: Viewport;

  // Actions
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Record<string, unknown>) => void;
  deleteNode: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;

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

    addNode: (node) =>
      set((state) => {
        state.nodes.push(node);
      }),

    updateNode: (id, data) =>
      set((state) => {
        const node = state.nodes.find((n) => n.id === id);
        if (node && typeof node.data === 'object' && node.data !== null) {
          node.data = { ...node.data, ...data } as Record<string, unknown>;
        }
      }),

    deleteNode: (id) =>
      set((state) => {
        state.nodes = state.nodes.filter((n) => n.id !== id);
        // Also remove connected edges
        state.edges = state.edges.filter((e) => e.source !== id && e.target !== id);
      }),

    setSelectedNodeId: (id) =>
      set((state) => {
        state.selectedNodeId = id;
      }),

    // React Flow Handlers
    onNodesChange: (changes: NodeChange[]) =>
      set((state) => {
        state.nodes = applyNodeChanges(changes, state.nodes);
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

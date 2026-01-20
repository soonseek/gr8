/**
 * StrategyEditor - Main Node-Edge Editor Component
 * Powered by @xyflow/react (React Flow v12)
 *
 * Layout Structure (Desktop):
 * ┌────────────────────────────────────────────────────┐
 * │                    Toolbar (60px)                  │
 * ├──────┬───────────────────────────────────┬─────────┤
 * │      │                                   │         │
 * │ Node │                                   │Properties│
 * │Palette│       Canvas (ReactFlow)          │  Panel  │
 * │(250px)│                                   │ (300px) │
 * │      │                                   │         │
 * ├──────┴───────────────────────────────────┴─────────┤
 * │                  StatusBar (40px)                  │
 * └────────────────────────────────────────────────────┘
 *
 * Layout Structure (Mobile):
 * ┌────────────────────┐
 * │    Toolbar (60px)  │
 * ├────────────────────┤
 * │                    │
 * │   Canvas (100%)    │
 * │                    │
 * ├────────────────────┤
 * │  StatusBar (40px)  │
 * └────────────────────┘
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type ReactFlowInstance,
  type Node as ReactFlowNode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEditorStore } from '@/stores/editorStore';
import { Toolbar } from './Toolbar';
import { NodePalette } from './NodePalette';
import { PropertiesPanel } from './PropertiesPanel';
import { StatusBar } from './StatusBar';
import { nodeTypes } from './nodeTypes';


/**
 * StrategyEditor Component
 * Provides a visual node-based editor for creating trading strategies
 */
export function StrategyEditor() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    selectedNodeId,
    selectedNodeIds,
    setSelectedNodeId,
    setSelectedNodeIds,
    deleteNode,
    deleteNodes,
  } = useEditorStore();

  const navigate = useNavigate();
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  /**
   * Handle node selection changes (supports multi-selection with Shift+click)
   */
  const onSelectionChange = useCallback(
    ({ nodes: selectedNodes }: { nodes: ReactFlowNode[] }) => {
      const selectedIds = selectedNodes.map((n) => n.id);
      setSelectedNodeIds(selectedIds);
    },
    [setSelectedNodeIds]
  );

  /**
   * Handle drag over canvas
   */
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  /**
   * Handle drop on canvas - create new node
   */
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type || !reactFlowInstance) return;

      // Calculate position
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      // Create new node using nodeFactory (via store)
      const nodeType = type as any; // TypeScript workaround
      addNode(nodeType, position);
    },
    [reactFlowInstance, addNode]
  );

  /**
   * Handle keyboard shortcuts
   * - Delete/Backspace: Remove selected nodes (supports multi-selection)
   * - ESC: Exit to workspace
   */
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Delete/Backspace: Remove selected nodes (single or multi)
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodeIds.length > 0) {
          deleteNodes(selectedNodeIds);
          setSelectedNodeIds([]);
        } else if (selectedNodeId) {
          deleteNode(selectedNodeId);
          setSelectedNodeId(null);
        }
      }

      // ESC: Exit to workspace
      if (event.key === 'Escape') {
        // TODO: Show unsaved changes warning (Story 3.10)
        navigate('/workspace');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, selectedNodeIds, deleteNode, deleteNodes, setSelectedNodeId, setSelectedNodeIds, navigate]);

  /**
   * Detect mobile screen size
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-screen h-screen bg-[#0a0a0a] flex flex-col">
      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Node Palette - Hidden on mobile */}
        <div className={`${isMobile ? 'hidden' : 'block'} w-[250px]`}>
          <NodePalette />
        </div>

        {/* Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onSelectionChange={onSelectionChange}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            minZoom={0.1}
            maxZoom={2}
            zoomOnScroll
            panOnScroll
            selectionOnDrag
            className="bg-[#0a0a0a]"
          >
            {/* Background with dotted grid pattern */}
            <Background color="#1a1a1a" gap={20} className="bg-[#0a0a0a]" />

            {/* Controls: Zoom in/out, fit view */}
            <Controls className="bg-[#1a1a1a] border border-gray-700" />

            {/* Miniimap: Shows overview of the entire flow */}
            <MiniMap
              className="bg-[#1a1a1a]"
              nodeColor="#1a1a1a"
              maskColor="rgba(0, 0, 0, 0.6)"
            />
          </ReactFlow>
        </div>

        {/* Properties Panel - Hidden on mobile */}
        <div className={`${isMobile ? 'hidden' : 'block'} w-[300px]`}>
          <PropertiesPanel />
        </div>
      </div>

      {/* StatusBar */}
      <StatusBar />
    </div>
  );
}

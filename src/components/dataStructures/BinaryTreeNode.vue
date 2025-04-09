<template>
  <div 
    class="tree-node"
    :class="{
      'node-current': currentNode === node,
      'node-inserted': isInserting,
      'node-deleted': isDeleting,
      'node-searched': isSearching && searchNode === node,
      'node-status': node.status
    }"
    :style="getNodeStyle(node, level)"
  >
    <div class="node-content">
      <div class="node-value">{{ node.value }}</div>
      <div class="node-pointers">
        <div class="pointer left" v-if="node.left">↙</div>
        <div class="pointer right" v-if="node.right">↘</div>
      </div>
    </div>
    <div class="node-connections">
      <div class="connection left" v-if="node.left">
        <div class="connection-line"></div>
        <BinaryTreeNode 
          :node="node.left"
          :currentNode="currentNode"
          :isInserting="isInserting"
          :isDeleting="isDeleting"
          :isSearching="isSearching"
          :searchNode="searchNode"
          :level="level + 1"
        />
      </div>
      <div class="connection right" v-if="node.right">
        <div class="connection-line"></div>
        <BinaryTreeNode 
          :node="node.right"
          :currentNode="currentNode"
          :isInserting="isInserting"
          :isDeleting="isDeleting"
          :isSearching="isSearching"
          :searchNode="searchNode"
          :level="level + 1"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { BinaryTreeNode as TreeNode } from '@/store';

interface Props {
  node: TreeNode;
  currentNode: TreeNode | null;
  isInserting: boolean;
  isDeleting: boolean;
  isSearching: boolean;
  searchNode: TreeNode | null;
  level: number;
}

const props = defineProps<Props>();

const getNodeStyle = (node: TreeNode, level: number) => {
  // Calculate horizontal position based on tree structure
  const maxNodesAtLevel = Math.pow(2, level);
  const nodeIndex = getNodeIndex(node, level);
  const spacing = 120; // Base spacing between nodes
  const horizontalPosition = (nodeIndex * 2 + 1) * spacing / maxNodesAtLevel;
  
  return {
    top: `${level * 100}px`,
    left: `${horizontalPosition}px`,
    transform: 'translateX(-50%)'
  };
};

// Helper function to calculate node index at its level
const getNodeIndex = (node: TreeNode, level: number): number => {
  if (level === 0) return 0;
  
  const parent = findParent(node);
  if (!parent) return 0;
  
  const parentIndex = getNodeIndex(parent, level - 1);
  return node === parent.left ? parentIndex * 2 : parentIndex * 2 + 1;
};

// Helper function to find parent node
const findParent = (targetNode: TreeNode): TreeNode | null => {
  const find = (current: TreeNode | null): TreeNode | null => {
    if (!current) return null;
    if (current.left === targetNode || current.right === targetNode) return current;
    return find(current.left) || find(current.right);
  };
  return find(props.node);
};
</script>

<style scoped>
.tree-node {
  position: absolute;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 2px solid #4299e1;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.dark-theme .tree-node {
  background: #2d2d2d;
  border-color: #63b3ed;
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.node-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.dark-theme .node-value {
  color: #f8f9fa;
}

.node-pointers {
  display: flex;
  gap: 8px;
}

.pointer {
  font-size: 1.2rem;
  color: #4299e1;
}

.dark-theme .pointer {
  color: #63b3ed;
}

.node-connections {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection.left {
  left: 0;
  top: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
}

.connection.right {
  right: 0;
  top: 50%;
  transform: translate(50%, -50%) rotate(30deg);
}

.connection-line {
  width: 100%;
  height: 2px;
  background: #4299e1;
  transform-origin: 0 0;
}

.dark-theme .connection-line {
  background: #63b3ed;
}

.node-current {
  background: #ebf8ff;
  border-color: #3182ce;
}

.dark-theme .node-current {
  background: #2c5282;
  border-color: #63b3ed;
}

.node-inserted {
  animation: pulse 0.5s ease-in-out;
}

.node-deleted {
  animation: fadeOut 0.5s ease-in-out;
}

.node-searched {
  background: #c6f6d5;
  border-color: #38a169;
}

.dark-theme .node-searched {
  background: #2f855a;
  border-color: #68d391;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@keyframes fadeOut {
  0% { opacity: 1; }
  100% { opacity: 0; }
}
</style> 
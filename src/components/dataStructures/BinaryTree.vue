<template>
  <div class="data-binary-tree">
    <div class="tree-layout">
      <!-- Tree Visualization -->
      <div class="tree-section">
        <div class="tree-container">
          <div class="tree-nodes">
            <div 
              v-if="store.binaryTree"
              class="tree-node"
              :class="{
                'node-current': currentNode === store.binaryTree,
                'node-inserted': isInserting,
                'node-deleted': isDeleting,
                'node-searched': isSearching && searchNode === store.binaryTree,
                'node-status': store.binaryTree.status
              }"
              :style="getNodeStyle(store.binaryTree)"
            >
              <div class="node-content">
                <div class="node-value">{{ store.binaryTree.value }}</div>
                <div class="node-pointers">
                  <div class="pointer left" v-if="store.binaryTree.left">↙</div>
                  <div class="pointer right" v-if="store.binaryTree.right">↘</div>
                </div>
              </div>
              <div class="node-connections">
                <div class="connection left" v-if="store.binaryTree.left">
                  <div class="connection-line"></div>
                  <BinaryTreeNodeComponent 
                    :node="store.binaryTree.left"
                    :currentNode="currentNode"
                    :isInserting="isInserting"
                    :isDeleting="isDeleting"
                    :isSearching="isSearching"
                    :searchNode="searchNode"
                    :level="1"
                  />
                </div>
                <div class="connection right" v-if="store.binaryTree.right">
                  <div class="connection-line"></div>
                  <BinaryTreeNodeComponent 
                    :node="store.binaryTree.right"
                    :currentNode="currentNode"
                    :isInserting="isInserting"
                    :isDeleting="isDeleting"
                    :isSearching="isSearching"
                    :searchNode="searchNode"
                    :level="1"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Tree Details -->
        <div class="tree-details">
          <div class="details-title">Binary Tree Details</div>
          <div class="details-content">
            <div class="detail-item">
              <span class="detail-label">Size:</span>
              <span class="detail-value">{{ getTreeSize() }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Root:</span>
              <span class="detail-value">{{ store.binaryTree ? store.binaryTree.value : 'null' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Height:</span>
              <span class="detail-value">{{ store.binaryTree ? store.getHeight(store.binaryTree) : 0 }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Is Empty:</span>
              <span class="detail-value">{{ !store.binaryTree ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Code Steps Visualization -->
      <div class="code-section" v-if="store.currentOperation">
        <div class="code-visualization">
          <div class="code-title">Code Steps</div>
          <div class="code-steps">
            <div 
              v-for="(step, index) in store.currentOperation.codeSteps" 
              :key="index"
              class="code-step"
              :class="{ 'highlighted': step.highlight }"
            >
              <div class="code-line">{{ step.line }}</div>
              <div class="code-explanation">{{ step.explanation }}</div>
            </div>
          </div>
        </div>
        
        <div class="operation-status" v-if="store.operationLog">
          {{ store.operationLog }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDataStructureStore, BinaryTreeNode } from '@/store';
import BinaryTreeNodeComponent from './BinaryTreeNode.vue';

const store = useDataStructureStore();
const currentNode = ref<BinaryTreeNode | null>(null);
const isInserting = ref(false);
const isDeleting = ref(false);
const isSearching = ref(false);
const searchNode = ref<BinaryTreeNode | null>(null);

// Helper function to wait with animation speed consideration
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms / store.animationSpeed));

const getTreeSize = () => {
  const countNodes = (node: BinaryTreeNode | null): number => {
    if (!node) return 0;
    return 1 + countNodes(node.left) + countNodes(node.right);
  };
  return countNodes(store.binaryTree);
};

const getNodeStyle = (node: BinaryTreeNode) => {
  return {
    top: '50px',
    left: '50%',
    transform: 'translateX(-50%)'
  };
};

const handleInsert = async () => {
  if (!store.currentOperation) return;
  
  isInserting.value = true;
  const value = store.currentOperation.value;
  
  // Highlight first code step
  store.nextStep();
  
  // Add new node to store
  store.insertToBinaryTree(value);
  
  // Wait for animation
  await wait(800);
  
  // Highlight next code step
  store.nextStep();
  
  // Wait for final animation
  await wait(500);
  
  // Reset states
  isInserting.value = false;
  
  // Complete the operation
  store.completeOperation();
};

const handleDelete = async () => {
  if (!store.binaryTree) {
    store.operationLog = 'Cannot delete from empty tree';
    store.completeOperation();
    return;
  }
  
  // Highlight first code step
  store.nextStep();
  
  isDeleting.value = true;
  
  // Wait for animation
  await wait(800);
  
  // Highlight next code step
  store.nextStep();
  
  // Remove node from store
  store.deleteFromBinaryTree(store.currentOperation?.value);
  
  // Highlight final code step
  store.nextStep();
  
  // Wait for final animation
  await wait(500);
  
  // Reset states
  isDeleting.value = false;
  
  // Complete the operation
  store.completeOperation();
};

const handleSearch = async () => {
  if (!store.currentOperation?.value) {
    store.operationLog = 'Please enter a value to search';
    store.completeOperation();
    return;
  }

  isSearching.value = true;
  const value = store.currentOperation.value;
  
  // Highlight first code step
  store.nextStep();
  
  // Perform binary tree search
  const search = async (node: BinaryTreeNode | null): Promise<BinaryTreeNode | null> => {
    if (!node) return null;
    
    currentNode.value = node;
    await wait(800);
    store.nextStep();
    
    if (node.value === value) {
      searchNode.value = node;
      return node;
    }
    
    const leftResult = await search(node.left);
    if (leftResult) return leftResult;
    
    const rightResult = await search(node.right);
    return rightResult;
  };
  
  const found = await search(store.binaryTree);
  
  // Wait for final animation
  await wait(500);
  
  // Reset states
  isSearching.value = false;
  currentNode.value = null;
  
  // Complete the operation
  store.completeOperation();
};

// Watch for operation changes
watch(() => store.currentOperation, (newOperation) => {
  if (!newOperation) return;
  
  switch (newOperation.type) {
    case 'Insert':
      handleInsert();
      break;
    case 'Delete':
      handleDelete();
      break;
    case 'Search':
      handleSearch();
      break;
  }
});
</script>

<style scoped>
.data-binary-tree {
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.tree-layout {
  display: flex;
  gap: 2rem;
  height: 100%;
}

.tree-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.tree-container {
  flex: 1;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  position: relative;
  overflow: visible;
  min-height: 600px;
  width: 100%;
}

.dark-theme .tree-container {
  background: #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.tree-nodes {
  position: relative;
  min-height: 600px;
  width: 100%;
  margin: 0 auto;
}

.tree-node {
  position: absolute;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  z-index: 1;
}

.dark-theme .tree-node {
  background: #1a1a1a;
  border-color: #4a5568;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.tree-node.node-current {
  background: #4299e1;
  border-color: #3182ce;
  color: white;
}

.tree-node.node-inserted {
  background: #48bb78;
  border-color: #38a169;
  color: white;
  animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tree-node.node-deleted {
  background: #f56565;
  border-color: #e53e3e;
  color: white;
  animation: slideOut 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.tree-node.node-searched {
  background: #9f7aea;
  border-color: #805ad5;
  color: white;
  animation: found 1.2s infinite;
}

.node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.node-value {
  font-size: 1rem;
  font-weight: 600;
}

.node-pointers {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #718096;
}

.dark-theme .node-pointers {
  color: #a0aec0;
}

.node-connections {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.connection {
  position: absolute;
  width: 50%;
  height: 50%;
}

.connection.left {
  left: -25%;
  top: 50%;
  transform: rotate(-45deg);
}

.connection.right {
  right: -25%;
  top: 50%;
  transform: rotate(45deg);
}

.connection-line {
  width: 100%;
  height: 2px;
  background: #e2e8f0;
  transform-origin: 0 0;
  transform: scaleX(0.5);
}

.dark-theme .connection-line {
  background: #4a5568;
}

.tree-details {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.dark-theme .tree-details {
  background: #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.details-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.dark-theme .details-title {
  color: #f8f9fa;
}

.details-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  color: #718096;
}

.dark-theme .detail-label {
  color: #a0aec0;
}

.detail-value {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.dark-theme .detail-value {
  color: #f8f9fa;
}

.code-section {
  width: 300px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.code-visualization {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.dark-theme .code-visualization {
  background: #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.code-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.dark-theme .code-title {
  color: #f8f9fa;
}

.code-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.code-step {
  padding: 0.5rem;
  border-radius: 6px;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.dark-theme .code-step {
  background: #1a1a1a;
}

.code-step.highlighted {
  background: #ebf8ff;
  border-left: 4px solid #4299e1;
}

.dark-theme .code-step.highlighted {
  background: #2a4365;
  border-left-color: #63b3ed;
}

.code-line {
  font-family: monospace;
  font-size: 0.875rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.dark-theme .code-line {
  color: #f8f9fa;
}

.code-explanation {
  font-size: 0.75rem;
  color: #718096;
}

.dark-theme .code-explanation {
  color: #a0aec0;
}

.operation-status {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  font-size: 0.875rem;
  color: #2c3e50;
}

.dark-theme .operation-status {
  background: #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  color: #f8f9fa;
}

@keyframes slideIn {
  from {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  to {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }
}

@keyframes found {
  0% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
}
</style>
<template>
  <div class="linked-list-visualizer">
    <div class="visualization-header">
      <h3 class="visualization-title">Linked List Visualization</h3>
      <div class="animation-controls">
        <button 
          class="control-button" 
          :class="{ 'active': isPlaying }"
          @click="togglePlay"
        >
          <span class="button-icon">{{ isPlaying ? '⏸' : '▶' }}</span>
        </button>
        <div class="speed-control">
          <span class="speed-label">Speed:</span>
          <input 
            type="range" 
            v-model="animationSpeed" 
            min="0.5" 
            max="2" 
            step="0.1"
            class="speed-slider"
          >
        </div>
      </div>
    </div>
    
    <div class="visualization-content">
      <div class="linked-list-container" v-if="!loading">
        <template v-for="(node, index) in linkedList" :key="index">
          <div class="node-wrapper">
            <div 
              class="node"
              :class="{
                'highlighted': node.highlighted,
                'inserting': node.status === 'inserting',
                'deleting': node.status === 'deleting',
                'searching': node.status === 'searching',
                'current': node.status === 'current',
                'next': node.status === 'next',
                'found': node.status === 'found',
                'moving': node.status === 'moving'
              }"
            >
              <div class="node-value">{{ node.value }}</div>
            </div>
            <div class="node-pointer" v-if="index < linkedList.length - 1">
              <div class="pointer-line"></div>
              <div class="pointer-arrow"></div>
            </div>
          </div>
        </template>
        
        <div v-if="linkedList.length === 0" class="empty-state">
          <div class="empty-icon">📋</div>
          <p class="empty-text">Empty linked list</p>
          <p class="empty-subtext">Use the control panel to add nodes</p>
        </div>
      </div>
      
      <div v-else class="loading-state">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ loadingMessage }}</p>
      </div>

      <div class="code-visualization" v-if="currentOperation">
        <div class="code-title">Code Steps</div>
        <div class="code-steps">
          <div 
            v-for="(step, index) in currentOperation.codeSteps" 
            :key="index"
            class="code-step"
            :class="{ 'highlighted': step.highlight }"
          >
            <div class="code-line">{{ step.line }}</div>
            <div class="code-explanation">{{ step.explanation }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="visualization-footer">
      <div class="status-card">
        <h4 class="status-title">Current Status</h4>
        <p class="status-text" v-if="operationLog">{{ operationLog }}</p>
        <p class="status-text" v-else>No operations performed yet</p>
      </div>
      
      <div class="details-card">
        <h4 class="details-title">List Details</h4>
        <div class="details-grid">
          <div class="detail-item">
            <span class="detail-label">Length:</span>
            <span class="detail-value">{{ linkedList.length }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Head:</span>
            <span class="detail-value">{{ linkedList.length > 0 ? linkedList[0].value : 'null' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Tail:</span>
            <span class="detail-value">{{ linkedList.length > 0 ? linkedList[linkedList.length - 1].value : 'null' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDataStructureStore } from '../../store'

const store = useDataStructureStore()
const linkedList = computed(() => store.linkedList)
const currentOperation = computed(() => store.currentOperation)
const operationLog = computed(() => store.operationLog)
const isPlaying = computed(() => store.isPlaying)
const animationSpeed = computed(() => store.animationSpeed)
const loading = ref(false)
const loadingMessage = ref('')
const isDarkMode = ref(false)

function togglePlay() {
  store.togglePlayPause()
}

// Toggle dark mode
function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  document.body.classList.toggle('dark-mode', isDarkMode.value)
}

// Watch for operations and execute animations
watch(currentOperation, async (operation) => {
  if (!operation || operation.completed) return
  
  if (operation.type.startsWith('Insert')) {
    await animateInsert(operation)
  } else if (operation.type.startsWith('Delete')) {
    await animateDelete(operation)
  } else if (operation.type === 'Search') {
    await animateSearch(operation)
  }
  
  // Mark operation as completed
  store.completeOperation()
})

const isCurrentNode = (index: number) => {
  if (!currentOperation.value) return false
  const step = currentOperation.value.codeSteps[currentOperation.value.currentStep]
  if (!step) return false

  // Logic to determine if this node is the current one being processed
  if (currentOperation.value.type === 'Search') {
    return step.line.includes('current =') && index === currentOperation.value.currentStep
  }
  if (currentOperation.value.type === 'Insert at Tail') {
    return step.line.includes('current.next =') && index === linkedList.value.length - 1
  }
  return false
}

async function animateInsert(operation: any) {
  // Reset and start code visualization
  store.resetSteps()
  
  // Determine insertion position
  let position = 0
  if (operation.type === 'Insert at Tail') {
    position = linkedList.value.length
    // Show traversal to the end
    for (let i = 0; i < position; i++) {
      if (!store.isPlaying) {
        await new Promise(resolve => {
          const unwatch = watch(() => store.isPlaying, (newVal) => {
            if (newVal) {
              unwatch()
              resolve(true)
            }
          })
        })
      }
      store.updateNodeStatus(i, 'current')
      store.nextStep()
      await wait(800 / animationSpeed.value)
      
      if (i < position - 1) {
        store.updateNodeStatus(i + 1, 'next')
        await wait(600 / animationSpeed.value)
        store.updateNodeStatus(i + 1, '')
      }
      
      store.updateNodeStatus(i, '')
    }
  } else if (operation.type === 'Insert at Index') {
    position = Math.min(operation.index, linkedList.value.length)
    
    // Show traversal to the index
    for (let i = 0; i < position; i++) {
      if (!store.isPlaying) {
        await new Promise(resolve => {
          const unwatch = watch(() => store.isPlaying, (newVal) => {
            if (newVal) {
              unwatch()
              resolve(true)
            }
          })
        })
      }
      store.updateNodeStatus(i, 'current')
      store.nextStep()
      await wait(800 / animationSpeed.value)
      
      if (i < position - 1) {
        store.updateNodeStatus(i + 1, 'next')
        await wait(600 / animationSpeed.value)
        store.updateNodeStatus(i + 1, '')
      }
      
      store.updateNodeStatus(i, '')
    }

    // Visualize the split at insertion point
    if (position < linkedList.value.length) {
      if (!store.isPlaying) {
        await new Promise(resolve => {
          const unwatch = watch(() => store.isPlaying, (newVal) => {
            if (newVal) {
              unwatch()
              resolve(true)
            }
          })
        })
      }
      // Highlight the node that will be after the new node
      store.updateNodeStatus(position, 'next')
      store.nextStep()
      await wait(800 / animationSpeed.value)
      
      // Create temporary gap by moving nodes
      const nodes = [...linkedList.value]
      const nodeToMove = nodes[position]
      nodes[position] = { ...nodeToMove, status: 'moving' }
      store.updateLinkedList(nodes)
      store.nextStep()
      await wait(600 / animationSpeed.value)
      
      // Reset node status
      store.updateNodeStatus(position, '')
    }
  }
  
  if (!store.isPlaying) {
    await new Promise(resolve => {
      const unwatch = watch(() => store.isPlaying, (newVal) => {
        if (newVal) {
          unwatch()
          resolve(true)
        }
      })
    })
  }
  
  // Create new node with 'inserting' status
  const newNode = { value: operation.value, highlighted: true, status: 'inserting' }
  
  // Insert node at appropriate position
  store.updateLinkedList([
    ...linkedList.value.slice(0, position),
    newNode,
    ...linkedList.value.slice(position)
  ])
  
  // Show the code step for inserting the new node
  store.nextStep()
  await wait(1000 / animationSpeed.value)
  
  // Update node status
  store.updateNodeStatus(position, '')
  await wait(500 / animationSpeed.value)
  
  // Remove highlight
  store.updateNodeHighlight(position, false)
  
  // Update operation log
  store.setOperationLog(`Inserted ${operation.value} at position ${position}`)
}

async function animateDelete(operation: any) {
  if (linkedList.value.length === 0) {
    store.setOperationLog('Cannot delete from empty list')
    return
  }
  
  // Reset and start code visualization
  store.resetSteps()
  
  // Determine deletion position
  let position = 0
  if (operation.type === 'Delete at Tail') {
    position = linkedList.value.length - 1
    // Show traversal to the end
    for (let i = 0; i < position; i++) {
      if (!store.isPlaying) {
        await new Promise(resolve => {
          const unwatch = watch(() => store.isPlaying, (newVal) => {
            if (newVal) {
              unwatch()
              resolve(true)
            }
          })
        })
      }
      store.updateNodeStatus(i, 'current')
      store.nextStep()
      await wait(800 / animationSpeed.value)
      
      if (i < position - 1) {
        store.updateNodeStatus(i + 1, 'next')
        await wait(600 / animationSpeed.value)
        store.updateNodeStatus(i + 1, '')
      }
      
      store.updateNodeStatus(i, '')
    }
  } else if (operation.type === 'Delete at Index') {
    position = Math.min(operation.index, linkedList.value.length - 1)
    // Show traversal to the index
    for (let i = 0; i < position; i++) {
      if (!store.isPlaying) {
        await new Promise(resolve => {
          const unwatch = watch(() => store.isPlaying, (newVal) => {
            if (newVal) {
              unwatch()
              resolve(true)
            }
          })
        })
      }
      store.updateNodeStatus(i, 'current')
      store.nextStep()
      await wait(800 / animationSpeed.value)
      
      if (i < position - 1) {
        store.updateNodeStatus(i + 1, 'next')
        await wait(600 / animationSpeed.value)
        store.updateNodeStatus(i + 1, '')
      }
      
      store.updateNodeStatus(i, '')
    }
  }
  
  if (!store.isPlaying) {
    await new Promise(resolve => {
      const unwatch = watch(() => store.isPlaying, (newVal) => {
        if (newVal) {
          unwatch()
          resolve(true)
        }
      })
    })
  }
  
  // Highlight node to be deleted
  store.updateNodeStatus(position, 'deleting')
  store.nextStep()
  await wait(1000 / animationSpeed.value)
  
  // Remove node
  const removedValue = linkedList.value[position].value
  store.updateLinkedList([
    ...linkedList.value.slice(0, position),
    ...linkedList.value.slice(position + 1)
  ])
  
  // Update operation log
  store.setOperationLog(`Deleted ${removedValue} from position ${position}`)
}

async function animateSearch(operation: any) {
  const searchValue = operation.value
  let found = false
  
  // Reset and start code visualization
  store.resetSteps()
  
  for (let i = 0; i < linkedList.value.length; i++) {
    if (!store.isPlaying) {
      await new Promise(resolve => {
        const unwatch = watch(() => store.isPlaying, (newVal) => {
          if (newVal) {
            unwatch()
            resolve(true)
          }
        })
      })
    }
    store.updateNodeStatus(i, 'current')
    store.nextStep()
    await wait(800 / animationSpeed.value)
    
    if (i < linkedList.value.length - 1) {
      store.updateNodeStatus(i + 1, 'next')
      await wait(600 / animationSpeed.value)
      store.updateNodeStatus(i + 1, '')
    }
    
    if (linkedList.value[i].value === searchValue) {
      found = true
      store.updateNodeStatus(i, 'found')
      await wait(1200 / animationSpeed.value)
      store.setOperationLog(`Found ${searchValue} at position ${i}`)
      return
    }
    
    store.updateNodeStatus(i, '')
  }
  
  if (!found) {
    store.setOperationLog(`Value ${searchValue} not found in the list`)
  }
  
  // Clear all highlights after search
  await wait(600 / animationSpeed.value)
  for (let i = 0; i < linkedList.value.length; i++) {
    store.updateNodeStatus(i, '')
  }
}

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

onMounted(() => {
  // Check system preference for dark mode
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
  isDarkMode.value = prefersDarkMode
  document.body.classList.toggle('dark-mode', prefersDarkMode)
  
  // Initialize with sample data
  setTimeout(() => {
    if (linkedList.value.length === 0) {
      store.updateLinkedList([
        { value: '10', highlighted: false, status: '' },
        { value: '20', highlighted: false, status: '' },
        { value: '30', highlighted: false, status: '' }
      ])
    }
  }, 500)
})
</script>

<style scoped>
.linked-list-visualizer {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.visualization-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.visualization-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.dark-theme .visualization-title {
  color: #f8f9fa;
}

.animation-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.control-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e2e8f0;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.dark-theme .control-button {
  background: #4a5568;
}

.control-button:hover {
  background: #cbd5e0;
}

.dark-theme .control-button:hover {
  background: #718096;
}

.control-button.active {
  background: #4299e1;
  color: white;
}

.button-icon {
  font-size: 1.25rem;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.speed-label {
  font-size: 0.875rem;
  color: #4a5568;
}

.dark-theme .speed-label {
  color: #cbd5e0;
}

.speed-slider {
  width: 100px;
  height: 4px;
  -webkit-appearance: none;
  background: #e2e8f0;
  border-radius: 2px;
  outline: none;
}

.dark-theme .speed-slider {
  background: #4a5568;
}

.speed-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: #4299e1;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s;
}

.speed-slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
}

.visualization-content {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
  position: relative;
}

.dark-theme .visualization-content {
  background: #2d2d2d;
}

.linked-list-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  overflow-x: auto;
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f8f9fa;
  min-height: 100px;
}

.dark-theme .linked-list-container {
  scrollbar-color: #4a5568 #2d2d2d;
}

.node-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  gap: 1rem;
}

.node {
  display: flex;
  align-items: center;
  background: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  justify-content: center;
}

.dark-theme .node {
  background: #1a1a1a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.node.highlighted {
  background: #ebf8ff;
  animation: highlightPulse 1s infinite;
}

.dark-theme .node.highlighted {
  background: #2a4365;
}

.node.inserting {
  background: #f0fff4;
  animation: slideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), highlightPulse 1.2s infinite;
}

.dark-theme .node.inserting {
  background: #2f855a;
}

.node.deleting {
  background: #fff5f5;
  animation: slideOut 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dark-theme .node.deleting {
  background: #c53030;
}

.node.searching {
  background: #fffaf0;
  animation: traverse 1.2s infinite;
}

.dark-theme .node.searching {
  background: #975a16;
}

.node.found {
  background: #f0fff4;
  animation: found 1.2s infinite;
}

.dark-theme .node.found {
  background: #2f855a;
}

.node.next {
  background: #e6fffa;
  animation: nextPulse 1s infinite;
}

.dark-theme .node.next {
  background: #285e61;
}

.node.moving {
  animation: moveRight 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  background: #fff5f5;
}

.dark-theme .node.moving {
  background: #c53030;
}

.node-value {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  text-align: center;
}

.dark-theme .node-value {
  color: #f8f9fa;
}

.node-pointer {
  display: flex;
  align-items: center;
  position: relative;
  width: 40px;
}

.pointer-line {
  width: 100%;
  height: 2px;
  background: #cbd5e0;
  position: relative;
  transition: all 0.3s ease;
}

.pointer-arrow {
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-left: 8px solid #cbd5e0;
  animation: arrowFlow 1.5s infinite;
}

.dark-theme .pointer-line {
  background: #4a5568;
}

.dark-theme .pointer-arrow {
  border-left-color: #4a5568;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: #a0aec0;
}

.dark-theme .empty-state {
  color: #718096;
}

.empty-icon {
  font-size: 3rem;
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-subtext {
  font-size: 0.875rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.dark-theme .loading-spinner {
  border-color: #4a5568;
  border-top-color: #63b3ed;
}

.loading-text {
  color: #4a5568;
  font-size: 0.875rem;
}

.dark-theme .loading-text {
  color: #cbd5e0;
}

.visualization-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.status-card, .details-card {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-theme .status-card,
.dark-theme .details-card {
  background: #1a1a1a;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.status-title, .details-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.dark-theme .status-title,
.dark-theme .details-title {
  color: #f8f9fa;
}

.status-text {
  font-size: 0.875rem;
  color: #4a5568;
}

.dark-theme .status-text {
  color: #cbd5e0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: #718096;
}

.dark-theme .detail-label {
  color: #a0aec0;
}

.detail-value {
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  color: #2c3e50;
  font-weight: 600;
}

.dark-theme .detail-value {
  color: #f8f9fa;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

@keyframes traverse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 8px rgba(66, 153, 225, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

@keyframes found {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.4);
  }
  50% {
    transform: scale(1.15);
    box-shadow: 0 0 0 12px rgba(72, 187, 120, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(72, 187, 120, 0);
  }
}

@keyframes slideIn {
  from {
    transform: translateX(-50px) scale(0.8);
    opacity: 0;
  }
  to {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0) scale(1);
    opacity: 1;
  }
  to {
    transform: translateX(50px) scale(0.8);
    opacity: 0;
  }
}

@keyframes highlightPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 10px rgba(66, 153, 225, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
  }
}

@keyframes arrowFlow {
  0% {
    transform: scaleX(1) translateY(-50%);
  }
  50% {
    transform: scaleX(1.3) translateY(-50%);
  }
  100% {
    transform: scaleX(1) translateY(-50%);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes nextPulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(56, 178, 172, 0.4);
  }
  50% {
    transform: scale(1.1);
    box-shadow: 0 0 0 8px rgba(56, 178, 172, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(56, 178, 172, 0);
  }
}

@keyframes moveRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(70px);
  }
}

@media (max-width: 768px) {
  .visualization-footer {
    grid-template-columns: 1fr;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}

.code-visualization {
  margin-top: 2rem;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dark-theme .code-visualization {
  background: #1a1a1a;
}

.code-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
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
  border-radius: 4px;
  transition: all 0.3s ease;
}

.code-step.highlighted {
  animation: highlightPulse 1s infinite;
  background: #ebf8ff;
}

.dark-theme .code-step.highlighted {
  background: #2a4365;
}

.code-line {
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.dark-theme .code-line {
  color: #f8f9fa;
}

.code-explanation {
  font-size: 0.75rem;
  color: #4a5568;
}

.dark-theme .code-explanation {
  color: #cbd5e0;
}

.node.current {
  animation: highlightPulse 1s infinite;
  border: 2px solid #4299e1;
}

.dark-theme .node.current {
  border-color: #63b3ed;
}
</style>
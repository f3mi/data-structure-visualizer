<template>
  <div class="control-panel">
    <div class="control-header">
      <h3 class="control-title">Controls</h3>
    </div>
    
    <div class="control-content">
      <!-- Operation Selector -->
      <div class="control-group">
        <label class="control-label">Operation</label>
        <select 
          v-model="selectedOperation" 
          class="control-select"
          @change="handleOperationChange"
        >
          <option v-if="activeDataStructure === 'Linked List'" value="Insert at Head">Insert at Head</option>
          <option v-if="activeDataStructure === 'Linked List'" value="Insert at Tail">Insert at Tail</option>
          <option v-if="activeDataStructure === 'Linked List'" value="Insert at Index">Insert at Index</option>
          <option v-if="activeDataStructure === 'Linked List'" value="Delete at Head">Delete at Head</option>
          <option v-if="activeDataStructure === 'Linked List'" value="Delete at Tail">Delete at Tail</option>
          <option v-if="activeDataStructure === 'Linked List'" value="Delete at Index">Delete at Index</option>
          <option v-if="activeDataStructure === 'Linked List'" value="Search">Search</option>
          <option v-if="activeDataStructure === 'Stack'" value="Push">Push</option>
          <option v-if="activeDataStructure === 'Stack'" value="Pop">Pop</option>
          <option v-if="activeDataStructure === 'Stack'" value="Peek">Peek</option>
          <option v-if="activeDataStructure === 'Stack'" value="Search">Search</option>
          <option v-if="activeDataStructure === 'Queue'" value="Enqueue">Enqueue</option>
          <option v-if="activeDataStructure === 'Queue'" value="Dequeue">Dequeue</option>
          <option v-if="activeDataStructure === 'Queue'" value="Peek">Peek</option>
          <option v-if="activeDataStructure === 'Queue'" value="Search">Search</option>
          <option v-if="activeDataStructure === 'Binary Tree'" value="Insert">Insert</option>
          <option v-if="activeDataStructure === 'Binary Tree'" value="Delete">Delete</option>
          <option v-if="activeDataStructure === 'Binary Tree'" value="Search">Search</option>
        </select>
      </div>
      
      <!-- Value Input -->
      <div class="control-group" v-if="showValueInput">
        <label class="control-label">Value</label>
        <input 
          type="number" 
          v-model="operationValue" 
          class="control-input"
          :placeholder="getValuePlaceholder"
        >
      </div>

      <!-- Index Input -->
      <div class="control-group" v-if="operationRequiresIndex">
        <label class="control-label">Index</label>
        <input 
          type="number" 
          v-model="operationIndex" 
          class="control-input"
          placeholder="Enter index"
          min="0"
        >
      </div>
      
      <!-- Execute Button -->
      <button 
        @click="executeOperation" 
        class="execute-button"
        :disabled="!selectedOperation || (showValueInput && !operationValue)"
      >
        <span class="button-text">Execute</span>
        <span class="button-icon">→</span>
      </button>
      
      <!-- Animation Controls -->
      <div class="control-group">
        <div class="speed-control">
          <label class="control-label">Animation Speed</label>
          <span class="speed-value">{{ animationSpeed }}/5</span>
        </div>
        <input 
          type="range" 
          v-model="animationSpeed" 
          min="1" 
          max="5" 
          step="1"
          class="speed-slider"
        >
        <div class="speed-labels">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>
      
      <div class="control-buttons">
        <button 
          @click="togglePlayPause" 
          class="control-button"
          :class="{ 'active': isPlaying }"
        >
          <span class="button-icon">
            {{ isPlaying ? '⏸' : '▶' }}
          </span>
          <span class="button-text">{{ isPlaying ? 'Pause' : 'Play' }}</span>
        </button>
        <button 
          @click="reset" 
          class="control-button"
        >
          <span class="button-icon">↺</span>
          <span class="button-text">Reset</span>
        </button>
      </div>
      
      <!-- Operation Log -->
      <div class="operation-log" v-if="operationLog">
        <div class="log-header">Last Operation</div>
        <div class="log-content">{{ operationLog }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { useDataStructureStore } from '../store';

const store = useDataStructureStore();
const activeDataStructure = computed(() => store.activeDataStructure);
const isPlaying = computed(() => store.isPlaying);
const operationLog = computed(() => store.operationLog);

const selectedOperation = ref('');
const operationValue = ref<number | null>(null);
const operationIndex = ref(0);
const animationSpeed = ref(1);

// Operations available for each data structure
const operationsMap = {
  'Linked List': ['Insert at Head', 'Insert at Tail', 'Insert at Index', 'Delete at Head', 'Delete at Tail', 'Delete at Index', 'Search'],
  'Stack': ['Push', 'Pop', 'Peek', 'Search'],
  'Queue': ['Enqueue', 'Dequeue', 'Peek'],
  'Binary Tree': ['Insert', 'Delete', 'Search'],
  'Heap': ['Insert', 'Extract Min/Max', 'Heapify'],
  'Graph': ['Add Vertex', 'Add Edge', 'Remove Vertex', 'Remove Edge', 'BFS', 'DFS']
};

const availableOperations = computed(() => {
  return operationsMap[activeDataStructure.value as keyof typeof operationsMap] || [];
});

const showValueInput = computed(() => {
  return (
    selectedOperation.value === 'Insert at Head' ||
    selectedOperation.value === 'Insert at Tail' ||
    selectedOperation.value === 'Insert at Index' ||
    selectedOperation.value === 'Push' ||
    selectedOperation.value === 'Enqueue' ||
    selectedOperation.value === 'Search' ||
    selectedOperation.value === 'Insert' ||
    selectedOperation.value === 'Delete'
  );
});

const operationRequiresIndex = computed(() => {
  return ['Insert at Index', 'Delete at Index'].includes(selectedOperation.value);
});

watch(activeDataStructure, () => {
  selectedOperation.value = availableOperations.value[0] || '';
  operationValue.value = null;
  operationIndex.value = 0;
});

watch(animationSpeed, (newSpeed) => {
  store.setAnimationSpeed(newSpeed);
});

function handleOperationChange() {
  operationValue.value = null;
}

function executeOperation() {
  if (!selectedOperation.value) return;

  if (showValueInput.value && operationValue.value === null) {
    alert('Please enter a value');
    return;
  }

  store.setOperation(
    selectedOperation.value,
    operationValue.value,
    operationIndex.value
  );
  
  // Clear inputs after operation
  if (showValueInput.value) {
    operationValue.value = null;
  }
  if (operationRequiresIndex.value) {
    operationIndex.value = 0;
  }
}

function togglePlayPause() {
  store.togglePlayPause();
}

function reset() {
  store.reset();
}

const getValuePlaceholder = computed(() => {
  if (selectedOperation.value === 'Search') {
    return 'Enter value to search';
  }
  if (selectedOperation.value === 'Insert') {
    return 'Enter value to insert';
  }
  if (selectedOperation.value === 'Delete') {
    return 'Enter value to delete';
  }
  return 'Enter value';
});
</script>

<style scoped>
.control-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dark-theme .control-panel {
  background: #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.control-header {
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
}

.dark-theme .control-header {
  border-bottom-color: #4a5568;
}

.control-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
}

.dark-theme .control-title {
  color: #f8f9fa;
}

.control-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.dark-theme .control-label {
  color: #cbd5e0;
}

.control-select {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #2c3e50;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.dark-theme .control-select {
  background: #1a1a1a;
  border-color: #4a5568;
  color: #f8f9fa;
}

.control-select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.control-select.has-value {
  border-color: #4299e1;
}

.control-input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  color: #2c3e50;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.dark-theme .control-input {
  background: #1a1a1a;
  border-color: #4a5568;
  color: #f8f9fa;
}

.control-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.execute-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #4299e1;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.execute-button:hover {
  background: #3182ce;
}

.execute-button:disabled {
  background: #cbd5e0;
  cursor: not-allowed;
}

.dark-theme .execute-button:disabled {
  background: #4a5568;
}

.button-text {
  flex: 1;
  text-align: center;
}

.button-icon {
  font-size: 1.25rem;
}

.speed-control {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.speed-value {
  font-family: 'Fira Code', monospace;
  font-size: 0.875rem;
  color: #4299e1;
}

.speed-slider {
  width: 100%;
  height: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: #e2e8f0;
  border-radius: 2px;
  outline: none;
  margin: 0.5rem 0;
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

.speed-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #718096;
}

.dark-theme .speed-labels {
  color: #a0aec0;
}

.control-buttons {
  display: flex;
  gap: 1rem;
}

.control-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: #e2e8f0;
  color: #4a5568;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.dark-theme .control-button {
  background: #4a5568;
  color: #cbd5e0;
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

.operation-log {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  margin-top: 1rem;
}

.dark-theme .operation-log {
  background: #1a1a1a;
}

.log-header {
  font-size: 0.875rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.dark-theme .log-header {
  color: #f8f9fa;
}

.log-content {
  font-size: 0.875rem;
  color: #4a5568;
  line-height: 1.5;
}

.dark-theme .log-content {
  color: #cbd5e0;
}

@media (max-width: 768px) {
  .control-buttons {
    flex-direction: column;
  }
}
</style>
<template>
  <div class="control-panel h-full">
    <div class="control-panel-header">
      <h3 class="text-lg font-semibold">Controls</h3>
    </div>
    
    <div class="control-panel-content">
      <!-- Operation Selector -->
      <div class="form-group">
        <label class="form-label">Operation</label>
        <select v-model="selectedOperation" class="form-select">
          <option v-for="op in availableOperations" :key="op" :value="op">{{ op }}</option>
        </select>
      </div>
      
      <!-- Value Input -->
      <div class="form-group" v-if="operationRequiresValue">
        <label class="form-label">Value</label>
        <input type="text" v-model="operationValue" class="form-input" placeholder="Enter value">
      </div>

      <!-- Index Input for specific operations -->
      <div class="form-group" v-if="operationRequiresIndex">
        <label class="form-label">Index</label>
        <input type="number" v-model="operationIndex" class="form-input" placeholder="Enter index" min="0">
      </div>
      
      <!-- Execute Button -->
      <button 
        @click="executeOperation" 
        class="btn btn-primary btn-full mb-6"
      >
        Execute
      </button>
      
      <!-- Animation Controls -->
      <div class="form-group">
        <div class="flex justify-between items-center mb-2">
          <label class="form-label mb-0">Animation Speed</label>
          <span class="text-sm font-mono">{{ speed }}/10</span>
        </div>
        <input 
          type="range" 
          v-model="speed" 
          min="1" 
          max="10" 
          class="range-slider-input"
        >
        <div class="range-slider-labels">
          <span>Slow</span>
          <span>Fast</span>
        </div>
      </div>
      
      <div class="flex gap-3 mt-4">
        <button 
          @click="togglePlayPause" 
          class="btn btn-secondary flex-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
            <path v-if="!isPlaying" d="M5 3l14 9-14 9V3z"></path>
            <path v-else d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path>
          </svg>
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        <button 
          @click="reset" 
          class="btn btn-secondary flex-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
            <path d="M3 2v6h6"></path>
            <path d="M3 13a9 9 0 1 0 3-7.7L3 8"></path>
          </svg>
          Reset
        </button>
      </div>
      
      <!-- Operation Log -->
      <div class="mt-6 p-3 bg-gray-50 border border-gray-100 rounded text-sm" v-if="operationLog">
        <div class="font-medium mb-1">Last Operation:</div>
        <div class="text-gray-600">{{ operationLog }}</div>
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
const operationValue = ref('');
const operationIndex = ref(0);
const speed = ref(5);

// Operations available for each data structure
const operationsMap = {
  'Linked List': ['Insert at Head', 'Insert at Tail', 'Insert at Index', 'Delete at Head', 'Delete at Tail', 'Delete at Index', 'Search'],
  'Stack': ['Push', 'Pop', 'Peek'],
  'Queue': ['Enqueue', 'Dequeue', 'Peek'],
  'Binary Tree': ['Insert', 'Delete', 'Search', 'In-order Traversal', 'Pre-order Traversal', 'Post-order Traversal'],
  'Heap': ['Insert', 'Extract Min/Max', 'Heapify'],
  'Graph': ['Add Vertex', 'Add Edge', 'Remove Vertex', 'Remove Edge', 'BFS', 'DFS']
};

const availableOperations = computed(() => {
  return operationsMap[activeDataStructure.value as keyof typeof operationsMap] || [];
});

const operationRequiresValue = computed(() => {
  const noValueOperations = ['Delete at Head', 'Delete at Tail', 'Pop', 'Dequeue', 'Peek', 'Extract Min/Max', 'In-order Traversal', 'Pre-order Traversal', 'Post-order Traversal', 'BFS', 'DFS'];
  return !noValueOperations.includes(selectedOperation.value);
});

const operationRequiresIndex = computed(() => {
  return ['Insert at Index', 'Delete at Index'].includes(selectedOperation.value);
});

watch(activeDataStructure, () => {
  selectedOperation.value = availableOperations.value[0] || '';
  operationValue.value = '';
  operationIndex.value = 0;
});

watch(speed, (newSpeed) => {
  store.setAnimationSpeed(newSpeed);
});

function executeOperation() {
  store.executeOperation({
    type: selectedOperation.value,
    value: operationValue.value,
    index: operationIndex.value
  });
  
  // Clear inputs after operation
  if (operationRequiresValue.value) {
    operationValue.value = '';
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
</script>
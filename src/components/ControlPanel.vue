<template>
  <div class="bg-gray-100 rounded-lg p-4">
    <h3 class="text-lg font-semibold mb-4 text-gray-800">Controls</h3>
    
    <!-- Operation Selector -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Operation</label>
      <select v-model="selectedOperation" class="w-full p-2 border rounded">
        <option v-for="op in availableOperations" :key="op" :value="op">{{ op }}</option>
      </select>
    </div>
    
    <!-- Value Input -->
    <div class="mb-4" v-if="operationRequiresValue">
      <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
      <input type="text" v-model="operationValue" class="w-full p-2 border rounded" placeholder="Enter value">
    </div>

    <!-- Index Input for specific operations -->
    <div class="mb-4" v-if="operationRequiresIndex">
      <label class="block text-sm font-medium text-gray-700 mb-1">Index</label>
      <input type="number" v-model="operationIndex" class="w-full p-2 border rounded" placeholder="Enter index" min="0">
    </div>
    
    <!-- Execute Button -->
    <button 
      @click="executeOperation" 
      class="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors mb-6"
    >
      Execute
    </button>
    
    <!-- Animation Controls -->
    <div class="mb-4">
      <label class="block text-sm font-medium text-gray-700 mb-1">Animation Speed</label>
      <input type="range" v-model="speed" min="1" max="10" class="w-full">
      <div class="flex justify-between text-xs text-gray-500">
        <span>Slow</span>
        <span>Fast</span>
      </div>
    </div>
    
    <div class="flex space-x-2">
      <button 
        @click="togglePlayPause" 
        class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
      >
        {{ isPlaying ? 'Pause' : 'Play' }}
      </button>
      <button 
        @click="reset" 
        class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors"
      >
        Reset
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDataStructureStore } from '../store'

const store = useDataStructureStore()
const activeDataStructure = computed(() => store.activeDataStructure)
const isPlaying = computed(() => store.isPlaying)

const selectedOperation = ref('')
const operationValue = ref('')
const operationIndex = ref(0)
const speed = ref(5)

// Operations available for each data structure
const operationsMap = {
  'Linked List': ['Insert at Head', 'Insert at Tail', 'Insert at Index', 'Delete at Head', 'Delete at Tail', 'Delete at Index', 'Search'],
  'Stack': ['Push', 'Pop', 'Peek'],
  'Queue': ['Enqueue', 'Dequeue', 'Peek'],
  'Binary Tree': ['Insert', 'Delete', 'Search', 'In-order Traversal', 'Pre-order Traversal', 'Post-order Traversal'],
  'Heap': ['Insert', 'Extract Min/Max', 'Heapify'],
  'Graph': ['Add Vertex', 'Add Edge', 'Remove Vertex', 'Remove Edge', 'BFS', 'DFS']
}

const availableOperations = computed(() => {
  return operationsMap[activeDataStructure.value as keyof typeof operationsMap] || []
})

const operationRequiresValue = computed(() => {
  const noValueOperations = ['Delete at Head', 'Delete at Tail', 'Pop', 'Dequeue', 'Peek', 'Extract Min/Max', 'In-order Traversal', 'Pre-order Traversal', 'Post-order Traversal', 'BFS', 'DFS']
  return !noValueOperations.includes(selectedOperation.value)
})

const operationRequiresIndex = computed(() => {
  return ['Insert at Index', 'Delete at Index'].includes(selectedOperation.value)
})

watch(activeDataStructure, () => {
  selectedOperation.value = availableOperations.value[0] || ''
  operationValue.value = ''
  operationIndex.value = 0
})

watch(speed, (newSpeed) => {
  store.setAnimationSpeed(newSpeed)
})

function executeOperation() {
  store.executeOperation({
    type: selectedOperation.value,
    value: operationValue.value,
    index: operationIndex.value
  })
  
  // Clear inputs after operation
  if (operationRequiresValue.value) {
    operationValue.value = ''
  }
  if (operationRequiresIndex.value) {
    operationIndex.value = 0
  }
}

function togglePlayPause() {
  store.togglePlayPause()
}

function reset() {
  store.reset()
}
</script>
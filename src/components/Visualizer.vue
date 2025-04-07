<template>
  <div class="bg-gray-100 rounded-lg h-full flex flex-col">
    <component 
      :is="activeVisualizerComponent" 
      :animationSpeed="animationSpeed"
      :isPlaying="isPlaying"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDataStructureStore } from '../store'
import LinkedList from './dataStructures/LinkedList.vue'
import Stack from './dataStructures/Stack.vue'
import Queue from './dataStructures/Queue.vue'
import BinaryTree from './dataStructures/BinaryTree.vue'
import Heap from './dataStructures/Heap.vue'
import Graph from './dataStructures/Graph.vue'

const store = useDataStructureStore()
const activeDataStructure = computed(() => store.activeDataStructure)
const animationSpeed = computed(() => store.animationSpeed)
const isPlaying = computed(() => store.isPlaying)

const componentsMap = {
  'Linked List': LinkedList,
  'Stack': Stack,
  'Queue': Queue,
  'Binary Tree': BinaryTree,
  'Heap': Heap,
  'Graph': Graph
}

const activeVisualizerComponent = computed(() => {
  return componentsMap[activeDataStructure.value as keyof typeof componentsMap]
})
</script>
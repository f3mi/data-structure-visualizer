<template>
  <nav class="bg-indigo-600 text-white shadow-md">
    <div class="container mx-auto px-4 py-3">
      <div class="flex justify-between items-center">
        <div class="text-xl font-bold">Data Structure Visualizer</div>
        <div class="hidden md:flex space-x-4">
          <button 
            v-for="structure in dataStructures" 
            :key="structure"
            @click="selectDataStructure(structure)"
            :class="[
              'px-3 py-2 rounded transition-colors',
              structure === activeDataStructure 
                ? 'bg-white text-indigo-600 font-medium' 
                : 'hover:bg-indigo-500'
            ]"
          >
            {{ structure }}
          </button>
        </div>
        
        <!-- Mobile menu button -->
        <div class="md:hidden">
          <button @click="toggleMobileMenu" class="p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile menu -->
      <div v-if="mobileMenuOpen" class="md:hidden mt-2 pb-2">
        <button 
          v-for="structure in dataStructures" 
          :key="structure"
          @click="selectDataStructure(structure); mobileMenuOpen = false"
          :class="[
            'block w-full text-left px-3 py-2 rounded my-1 transition-colors',
            structure === activeDataStructure 
              ? 'bg-white text-indigo-600 font-medium' 
              : 'hover:bg-indigo-500'
          ]"
        >
          {{ structure }}
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataStructureStore } from '../store'

const dataStructures = [
  'Linked List',
  'Stack',
  'Queue',
  'Binary Tree',
  'Heap',
  'Graph'
]

const store = useDataStructureStore()
const activeDataStructure = computed(() => store.activeDataStructure)
const mobileMenuOpen = ref(false)

function selectDataStructure(structure: string) {
  store.setActiveDataStructure(structure)
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}
</script>
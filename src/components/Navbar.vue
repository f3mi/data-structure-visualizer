<template>
  <nav class="navbar">
    <div class="container navbar-container">
      <div class="navbar-brand">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <span>Data Structure Visualizer</span>
      </div>
      
      <div class="navbar-links">
        <button 
          v-for="structure in dataStructures" 
          :key="structure"
          @click="selectDataStructure(structure)"
          class="navbar-link"
          :class="{ 'active': structure === activeDataStructure }"
        >
          {{ structure }}
        </button>
        
        <!-- <div class="flex items-center ml-4">
          <span class="text-sm mr-2">Theme</span>
          <div 
            class="theme-toggle" 
            :class="{ 'active': isDarkMode }"
            @click="toggleDarkMode"
          ></div>
        </div> -->
      </div>
      
      <!-- Mobile menu button -->
      <button @click="toggleMobileMenu" class="mobile-menu-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path v-if="!mobileMenuOpen" d="M3 12h18M3 6h18M3 18h18"></path>
          <path v-else d="M18 6L6 18M6 6l12 12"></path>
        </svg>
      </button>
    </div>
    
    <!-- Mobile menu -->
    <div v-if="mobileMenuOpen" class="mobile-menu">
      <button 
        v-for="structure in dataStructures" 
        :key="structure"
        @click="selectDataStructure(structure); mobileMenuOpen = false"
        class="mobile-menu-link"
        :class="{ 'active': structure === activeDataStructure }"
      >
        {{ structure }}
      </button>
      
      <div class="flex justify-between items-center p-3 mt-2">
        <span class="text-sm">Dark Mode</span>
        <div 
          class="theme-toggle" 
          :class="{ 'active': isDarkMode }"
          @click="toggleDarkMode"
        ></div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useDataStructureStore } from '../store';

const dataStructures = [
  'Linked List',
  'Stack',
  'Queue',
  'Binary Tree',
  'Heap',
  'Graph'
];

const store = useDataStructureStore();
const activeDataStructure = computed(() => store.activeDataStructure);
const mobileMenuOpen = ref(false);
const isDarkMode = ref(false);

function selectDataStructure(structure: string) {
  store.setActiveDataStructure(structure);
}

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  const event = new CustomEvent('toggle-dark-mode', { detail: isDarkMode.value });
  window.dispatchEvent(event);
}

// Listen for dark mode changes from other components
window.addEventListener('dark-mode-changed', (event: any) => {
  isDarkMode.value = event.detail;
});
</script>
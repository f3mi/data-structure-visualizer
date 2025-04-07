<template>
  <div class="min-h-screen bg-gray-50 flex flex-col" :class="{ 'dark-theme': isDarkMode }">
    <Navbar @toggle-dark-mode="toggleDarkMode" :isDarkMode="isDarkMode" />
    <main class="container mx-auto px-4 py-8 flex-grow">
      <div class="card p-6">
        <div class="mb-6">
          <div class="flex justify-between items-center">
            <div>
              <h2 class="text-2xl font-bold text-gray-800">{{ activeDataStructure }}</h2>
              <p class="text-gray-600">{{ dataStructureDescriptions[activeDataStructure] }}</p>
            </div>
            <div class="flex items-center space-x-2">
              <span class="text-sm text-gray-500">Theme</span>
              <div 
                class="dark-mode-toggle" 
                :class="{ 'active': isDarkMode }"
                @click="toggleDarkMode"
              ></div>
            </div>
          </div>
        </div>
        
        <div class="flex gap-6 flex-col lg:flex-row">
          <div class="lg:w-3/4">
            <Visualizer />
          </div>
          <div class="lg:w-1/4">
            <ControlPanel />
          </div>
        </div>
      </div>
      
      <!-- Info section -->
      <div class="mt-8 card p-6">
        <h3 class="text-xl font-semibold mb-3">About {{ activeDataStructure }}</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 class="font-medium text-lg mb-2">Time Complexity</h4>
            <div class="space-y-2">
              <div v-for="(complexity, operation) in timeComplexity[activeDataStructure]" :key="operation" 
                   class="flex justify-between items-center p-2 bg-gray-100 rounded">
                <span>{{ operation }}</span>
                <span class="font-mono text-primary-dark">{{ complexity }}</span>
              </div>
            </div>
          </div>
          <div>
            <h4 class="font-medium text-lg mb-2">Common Uses</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li v-for="(use, index) in commonUses[activeDataStructure]" :key="index">
                {{ use }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
    <footer class="footer text-center py-4">
      <div class="container mx-auto px-4">
        <p>Data Structure Visualizer | Built with Vue.js & TypeScript</p>
        <div class="flex justify-center space-x-4 mt-2">
          <a href="#" class="text-gray-300 hover:text-white transition-colors">GitHub</a>
          <a href="#" class="text-gray-300 hover:text-white transition-colors">Portfolio</a>
          <a href="#" class="text-gray-300 hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Navbar from './components/Navbar.vue'
import Visualizer from './components/Visualizer.vue'
import ControlPanel from './components/ControlPanel.vue'
import { useDataStructureStore } from './store'

const store = useDataStructureStore()
const activeDataStructure = computed(() => store.activeDataStructure)
const isDarkMode = ref(false)

const dataStructureDescriptions:{ [key: string]: string; } = {
  'Linked List': 'A linear collection of elements where each element points to the next one. Useful for dynamic memory allocation and for implementing stacks and queues.',
  'Stack': 'A LIFO (Last In First Out) data structure supporting push and pop operations. Used in function calls, undo mechanisms, and expression evaluation.',
  'Queue': 'A FIFO (First In First Out) data structure supporting enqueue and dequeue operations. Used in scheduling, BFS algorithms, and message processing.',
  'Binary Tree': 'A hierarchical structure where each node has at most two children. Forms the basis for efficient search and sort operations.',
  'Heap': 'A specialized tree-based data structure that satisfies the heap property. Used in priority queues, scheduling, and selection algorithms.',
  'Graph': 'A non-linear structure consisting of vertices and edges connecting these vertices. Used to represent networks, maps, and relationship data.'
}

const timeComplexity: Record<string, any>= {
  'Linked List': {
    'Access': 'O(n)',
    'Search': 'O(n)',
    'Insertion': 'O(1)',
    'Deletion': 'O(1)'
  },
  'Stack': {
    'Access': 'O(n)',
    'Search': 'O(n)',
    'Push': 'O(1)',
    'Pop': 'O(1)'
  },
  'Queue': {
    'Access': 'O(n)',
    'Search': 'O(n)',
    'Enqueue': 'O(1)',
    'Dequeue': 'O(1)'
  },
  'Binary Tree': {
    'Access': 'O(log n)',
    'Search': 'O(log n)',
    'Insertion': 'O(log n)',
    'Deletion': 'O(log n)'
  },
  'Heap': {
    'Access Max/Min': 'O(1)',
    'Search': 'O(n)',
    'Insertion': 'O(log n)',
    'Delete Max/Min': 'O(log n)'
  },
  'Graph': {
    'Access': 'O(1)',
    'Search (BFS/DFS)': 'O(V + E)',
    'Add Vertex': 'O(1)',
    'Add Edge': 'O(1)'
  }
}

const commonUses: { [key: string]: string[]; } = {
  'Linked List': [
    'Implementing dynamic memory allocation',
    'Creating other data structures like stacks and queues',
    'Navigation systems with next/previous functionality',
    'Music/video playlists'
  ],
  'Stack': [
    'Function call management (call stack)',
    'Expression evaluation and syntax parsing',
    'Undo mechanisms in applications',
    'Backtracking algorithms'
  ],
  'Queue': [
    'Task scheduling in operating systems',
    'Print job management',
    'Breadth-first search algorithms',
    'Handling asynchronous data transfers'
  ],
  'Binary Tree': [
    'Efficient search operations',
    'Priority queues',
    'Expression parsing',
    'Huffman coding for data compression'
  ],
  'Heap': [
    'Priority queues implementation',
    'Heap sort algorithm',
    'Finding kth smallest/largest element',
    'Graph algorithms like Dijkstra\'s and Prim\'s'
  ],
  'Graph': [
    'Social networks modeling',
    'Routing algorithms in networks',
    'Map/GPS navigation systems',
    'Dependency resolution in build systems'
  ]
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark-mode')
  } else {
    document.documentElement.classList.remove('dark-mode')
  }
}
</script>


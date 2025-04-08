<template>
  <div class="app-container" :class="{ 'dark-theme': isDarkMode }">
    <Navbar @toggle-dark-mode="toggleDarkMode" :isDarkMode="isDarkMode" />
    <main class="main-content">
      <div class="visualization-container">
        <div class="header-section">
          <div class="title-section">
            <h1 class="main-title">{{ activeDataStructure }}</h1>
            <p class="description">{{ dataStructureDescriptions[activeDataStructure] }}</p>
          </div>
          <div class="theme-control">
            <span class="theme-label">Theme</span>
            <div 
              class="theme-toggle" 
              :class="{ 'active': isDarkMode }"
              @click="toggleDarkMode"
            >
              <div class="toggle-handle"></div>
            </div>
          </div>
        </div>
        
        <div class="content-grid">
          <div class="visualizer-section">
            <Visualizer />
          </div>
          <div class="control-section">
            <ControlPanel />
          </div>
        </div>
      </div>
      
      <div class="info-section">
        <h2 class="section-title">About {{ activeDataStructure }}</h2>
        <div class="info-grid">
          <div class="complexity-card">
            <h3 class="card-title">Time Complexity</h3>
            <div class="complexity-list">
              <div v-for="(complexity, operation) in timeComplexity[activeDataStructure]" :key="operation" 
                   class="complexity-item">
                <span class="operation">{{ operation }}</span>
                <span class="notation">{{ complexity }}</span>
              </div>
            </div>
          </div>
          <div class="uses-card">
            <h3 class="card-title">Common Uses</h3>
            <ul class="uses-list">
              <li v-for="(use, index) in commonUses[activeDataStructure]" :key="index">
                {{ use }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
    <footer class="app-footer">
      <div class="footer-content">
        <p class="footer-text">Data Structure Visualizer | Built with Vue.js & TypeScript</p>
        <div class="footer-links">
          <a href="#" class="footer-link">GitHub</a>
          <a href="#" class="footer-link">Portfolio</a>
          <a href="#" class="footer-link">Contact</a>
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

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f8f9fa;
  color: #2c3e50;
  transition: background-color 0.3s, color 0.3s;
}

.dark-theme {
  background-color: #1a1a1a;
  color: #f8f9fa;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.visualization-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  margin-bottom: 2rem;
}

.dark-theme .visualization-container {
  background: #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.title-section {
  flex: 1;
}

.main-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.dark-theme .main-title {
  color: #f8f9fa;
}

.description {
  font-size: 1rem;
  color: #666;
  max-width: 600px;
}

.dark-theme .description {
  color: #aaa;
}

.theme-control {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.theme-label {
  font-size: 0.875rem;
  color: #666;
}

.dark-theme .theme-label {
  color: #aaa;
}

.theme-toggle {
  width: 40px;
  height: 20px;
  background-color: #e2e8f0;
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s;
}

.dark-theme .theme-toggle {
  background-color: #4a5568;
}

.theme-toggle.active {
  background-color: #4299e1;
}

.toggle-handle {
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
}

.theme-toggle.active .toggle-handle {
  transform: translateX(20px);
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
}

.visualizer-section {
  min-height: 400px;
}

.control-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.dark-theme .control-section {
  background: #2d2d2d;
}

.info-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.dark-theme .info-section {
  background: #2d2d2d;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.dark-theme .section-title {
  color: #f8f9fa;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.complexity-card, .uses-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.dark-theme .complexity-card,
.dark-theme .uses-card {
  background: #1a1a1a;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.dark-theme .card-title {
  color: #f8f9fa;
}

.complexity-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.complexity-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
}

.dark-theme .complexity-item {
  background: #2d2d2d;
}

.operation {
  color: #4a5568;
}

.dark-theme .operation {
  color: #cbd5e0;
}

.notation {
  font-family: 'Fira Code', monospace;
  color: #4299e1;
  font-weight: 600;
}

.uses-list {
  list-style-type: disc;
  padding-left: 1.5rem;
  color: #4a5568;
}

.dark-theme .uses-list {
  color: #cbd5e0;
}

.uses-list li {
  margin-bottom: 0.5rem;
}

.app-footer {
  background: #2d2d2d;
  color: #f8f9fa;
  padding: 2rem 0;
  margin-top: 4rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  text-align: center;
}

.footer-text {
  margin-bottom: 1rem;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.footer-link {
  color: #cbd5e0;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-link:hover {
  color: #f8f9fa;
}

@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    gap: 1rem;
  }
  
  .theme-control {
    align-self: flex-end;
  }
}
</style>


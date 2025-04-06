<template>
  <div class="visualizer-container">
    <div class="visualizer-header">
      <h3 class="card-title">Linked List Visualization</h3>
      <div class="theme-toggle" :class="{ active: isDarkMode }" @click="toggleDarkMode"></div>
    </div>
    
    <div class="visualizer-content">
      <div class="flex flex-col items-center w-full">
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p class="mt-2 text-muted-foreground">{{ loadingMessage }}</p>
        </div>
        
        <div v-else class="w-full">
          <div class="linked-list-container" v-if="linkedList.length > 0">
            <div 
              v-for="(node, index) in linkedList" 
              :key="index" 
              class="node"
            >
              <div 
                class="node-content"
                :class="{
                  'highlighted': node.highlighted,
                  'inserting': node.status === 'inserting',
                  'deleting': node.status === 'deleting',
                  'searching': node.status === 'searching'
                }"
              >
                {{ node.value }}
              </div>
              
              <div v-if="index < linkedList.length - 1" class="node-pointer">
                <div class="pointer-line"></div>
                <div class="pointer-arrow"></div>
              </div>
            </div>
          </div>
          
          <div v-else class="text-center py-12 text-muted-foreground">
            Empty linked list. Use the control panel to add nodes.
          </div>
          
          <div class="mt-6 text-sm text-muted-foreground text-center" v-if="operationLog">
            Last operation: {{ operationLog }}
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

async function animateInsert(operation: any) {
  loading.value = true
  loadingMessage.value = `Inserting ${operation.value}...`
  
  // Determine insertion position
  let position = 0
  if (operation.type === 'Insert at Tail') {
    position = linkedList.value.length
  } else if (operation.type === 'Insert at Index') {
    position = Math.min(operation.index, linkedList.value.length)
  }
  
  await wait(500 / animationSpeed.value)
  loading.value = false
  
  // Create new node with 'inserting' status
  const newNode = { value: operation.value, highlighted: true, status: 'inserting' }
  
  // Insert node at appropriate position
  store.updateLinkedList([
    ...linkedList.value.slice(0, position),
    newNode,
    ...linkedList.value.slice(position)
  ])
  
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
  
  // Determine deletion position
  let position = 0
  if (operation.type === 'Delete at Tail') {
    position = linkedList.value.length - 1
  } else if (operation.type === 'Delete at Index') {
    position = Math.min(operation.index, linkedList.value.length - 1)
  }
  
  // Highlight node to be deleted
  store.updateNodeHighlight(position, true)
  store.updateNodeStatus(position, 'deleting')
  
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
  
  for (let i = 0; i < linkedList.value.length; i++) {
    // Highlight current node being searched
    store.updateNodeHighlight(i, true)
    store.updateNodeStatus(i, 'searching')
    
    await wait(500 / animationSpeed.value)
    
    // Check if value is found
    if (linkedList.value[i].value === searchValue) {
      found = true
      await wait(1000 / animationSpeed.value)
      store.setOperationLog(`Found ${searchValue} at position ${i}`)
    } else {
      // Remove highlight if not found
      store.updateNodeStatus(i, '')
      store.updateNodeHighlight(i, false)
      await wait(300 / animationSpeed.value)
    }
    
    if (found) break
  }
  
  if (!found) {
    store.setOperationLog(`Value ${searchValue} not found in the list`)
  }
  
  // Clear all highlights after search
  await wait(500 / animationSpeed.value)
  for (let i = 0; i < linkedList.value.length; i++) {
    store.updateNodeStatus(i, '')
    store.updateNodeHighlight(i, false)
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
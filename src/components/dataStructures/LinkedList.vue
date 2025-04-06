<template>
  <div class="flex flex-col items-center">
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
      <p class="mt-2 text-gray-600">{{ loadingMessage }}</p>
    </div>
    
    <div v-else>
      <div class="flex items-center justify-center flex-wrap" v-if="linkedList.length > 0">
        <div 
          v-for="(node, index) in linkedList" 
          :key="index" 
          class="flex items-center"
        >
          <div 
            class="flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300"
            :class="[
              node.highlighted ? 'bg-yellow-200 border-yellow-500' : 'bg-white border-indigo-500',
              node.status === 'inserting' ? 'animate-bounce bg-green-100 border-green-500' : '',
              node.status === 'deleting' ? 'animate-pulse bg-red-100 border-red-500' : '',
              node.status === 'searching' ? 'animate-pulse bg-blue-100 border-blue-500' : ''
            ]"
          >
            {{ node.value }}
          </div>
          
          <div v-if="index < linkedList.length - 1" class="flex items-center mx-2">
            <div class="w-6 h-0.5 bg-indigo-500"></div>
            <div class="w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-indigo-500"></div>
          </div>
        </div>
      </div>
      
      <div v-else class="text-center py-12 text-gray-500">
        Empty linked list. Use the control panel to add nodes.
      </div>
      
      <div class="mt-6 text-sm text-gray-500" v-if="operationLog">
        Last operation: {{ operationLog }}
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
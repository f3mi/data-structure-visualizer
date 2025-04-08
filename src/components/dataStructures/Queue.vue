<template>
  <div class="data-queue">
    <div class="queue-container">
      <div class="queue-elements">
        <div
          v-for="(element, index) in store.queue"
          :key="index"
          class="queue-element"
          :class="{
            'element-current': currentIndex === index,
            'element-enqueued': isEnqueuing && index === store.queue.length - 1,
            'element-dequeued': isDequeuing && index === 0,
            'element-peeked': isPeeking && index === 0,
            'element-searched': isSearching && searchIndex === index,
            'element-status': element.status
          }"
          :style="{ 'z-index': store.queue.length - index }"
        >
          <div class="element-value">{{ element.value }}</div>
        </div>
      </div>
      <div class="queue-pointers">
        <div class="queue-pointer front">Front</div>
        <div class="queue-pointer rear">Rear</div>
      </div>
    </div>
    
    <!-- Code Steps Visualization -->
    <div class="code-visualization" v-if="store.currentOperation">
      <div class="code-title">Code Steps</div>
      <div class="code-steps">
        <div 
          v-for="(step, index) in store.currentOperation.codeSteps" 
          :key="index"
          class="code-step"
          :class="{ 'highlighted': step.highlight }"
        >
          <div class="code-line">{{ step.line }}</div>
          <div class="code-explanation">{{ step.explanation }}</div>
        </div>
      </div>
    </div>
    
    <div class="operation-status" v-if="store.operationLog">
      {{ store.operationLog }}
    </div>
    
    <!-- Queue Details -->
    <div class="queue-details">
      <div class="details-title">Queue Details</div>
      <div class="details-content">
        <div class="detail-item">
          <span class="detail-label">Size:</span>
          <span class="detail-value">{{ store.queue.length }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Front Element:</span>
          <span class="detail-value">{{ store.queue.length > 0 ? store.queue[0].value : 'null' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Rear Element:</span>
          <span class="detail-value">{{ store.queue.length > 0 ? store.queue[store.queue.length - 1].value : 'null' }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Is Empty:</span>
          <span class="detail-value">{{ store.queue.length === 0 ? 'Yes' : 'No' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDataStructureStore } from '@/store';

const store = useDataStructureStore();
const currentIndex = ref(-1);
const isEnqueuing = ref(false);
const isDequeuing = ref(false);
const isPeeking = ref(false);
const isSearching = ref(false);
const searchIndex = ref(-1);

// Helper function to wait with animation speed consideration
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms / store.animationSpeed));

const handleEnqueue = async () => {
  if (!store.currentOperation) return;
  
  isEnqueuing.value = true;
  const value = store.currentOperation.value || 0;
  
  // Highlight first code step
  store.nextStep();
  
  // Add new element to store
  store.pushToQueue(value);
  currentIndex.value = store.queue.length - 1;
  
  // Wait for animation
  await wait(800);
  
  // Highlight next code step
  store.nextStep();
  
  // Wait for final animation
  await wait(500);
  
  // Reset states
  isEnqueuing.value = false;
  currentIndex.value = -1;
  
  // Complete the operation
  store.completeOperation();
};

const handleDequeue = async () => {
  if (store.queue.length === 0) {
    store.operationLog = 'Cannot dequeue from empty queue';
    store.completeOperation();
    return;
  }
  
  // Highlight first code step
  store.nextStep();
  
  isDequeuing.value = true;
  currentIndex.value = 0;
  
  // Wait for animation
  await wait(800);
  
  // Highlight next code step
  store.nextStep();
  
  // Remove element from store
  store.dequeueFromQueue();
  
  // Highlight final code step
  store.nextStep();
  
  // Wait for final animation
  await wait(500);
  
  // Reset states
  isDequeuing.value = false;
  currentIndex.value = -1;
  
  // Complete the operation
  store.completeOperation();
};

const handlePeek = async () => {
  if (store.queue.length === 0) {
    store.operationLog = 'Queue is empty';
    store.completeOperation();
    return;
  }

  // Highlight first code step
  store.nextStep();
  
  isPeeking.value = true;
  currentIndex.value = 0;
  
  // Peek at the front element
  store.peekQueue();
  
  // Wait for animation
  await wait(800);
  
  // Highlight next code step
  store.nextStep();
  
  // Wait for final animation
  await wait(500);
  
  // Reset states
  isPeeking.value = false;
  currentIndex.value = -1;
  
  // Complete the operation
  store.completeOperation();
};

const handleSearch = async () => {
  if (!store.currentOperation?.value) {
    store.operationLog = 'Please enter a value to search';
    store.completeOperation();
    return;
  }

  isSearching.value = true;
  const value = store.currentOperation.value.toString();
  
  // Highlight first code step (start from front)
  store.nextStep();
  
  // Traverse and search the queue
  let found = false;
  for (let i = 0; i < store.queue.length; i++) {
    currentIndex.value = i;
    
    // Wait between checking elements
    await wait(800);
    
    // Highlight the traversal step
    store.nextStep();
    
    // Check if current value matches target
    if (store.queue[i].value === value) {
      searchIndex.value = i;
      found = true;
      
      // Highlight the found step
      store.nextStep();
      
      // Wait to show the found element
      await wait(1000);
      break;
    }
    
    // Move to next element if not found
    await wait(500);
  }
  
  // If not found, highlight the return null step
  if (!found) {
    store.nextStep();
    await wait(500);
  }
  
  // Search for the value
  store.searchQueue(value);
  
  // Reset states
  isSearching.value = false;
  currentIndex.value = -1;
  searchIndex.value = -1;
  
  // Complete the operation
  store.completeOperation();
};

const resetQueue = () => {
  store.resetQueue();
  currentIndex.value = -1;
  isEnqueuing.value = false;
  isDequeuing.value = false;
  isPeeking.value = false;
  isSearching.value = false;
  searchIndex.value = -1;
};

// Watch for operation changes
watch(
  () => store.currentOperation,
  (newOperation) => {
    if (!newOperation) return;

    // Reset steps for code visualization
    store.resetSteps();

    switch (newOperation.type) {
      case 'Enqueue':
        handleEnqueue();
        break;
      case 'Dequeue':
        handleDequeue();
        break;
      case 'Peek':
        handlePeek();
        break;
      case 'Search':
        handleSearch();
        break;
    }
  },
  { immediate: true }
);

// Watch for reset
watch(
  () => store.shouldReset,
  (newValue) => {
    if (newValue) {
      resetQueue();
      store.setReset(false);
    }
  }
);
</script>

<style scoped>
.data-queue {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 400px;
}

.queue-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
  margin-bottom: 2rem;
}

.queue-elements {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  min-height: 100px;
  padding: 1rem;
  background-color: var(--color-background-mute);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow-x: auto;
  max-width: 100%;
}

.queue-element {
  background-color: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  min-width: 80px;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
}

.element-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
}

.queue-pointers {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 1rem;
}

.queue-pointer {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  padding: 0.5rem 1rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Animation classes */
.element-current {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.element-current .element-value {
  color: white;
}

.element-enqueued {
  animation: enqueueAnimation 0.8s ease;
}

.element-dequeued {
  animation: dequeueAnimation 0.8s ease;
}

.element-peeked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.05);
  animation: peekAnimation 0.8s ease;
}

.element-peeked .element-value {
  color: white;
}

.element-searched {
  background-color: var(--color-success);
  border-color: var(--color-success);
  transform: scale(1.05);
  animation: searchAnimation 0.8s ease;
}

.element-searched .element-value {
  color: white;
}

@keyframes enqueueAnimation {
  0% {
    transform: translateX(100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes dequeueAnimation {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes peekAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.05);
  }
}

@keyframes searchAnimation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1.05);
  }
}

/* Code visualization styles */
.code-visualization {
  margin-top: 1.5rem;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.code-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.code-steps {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.code-step {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.code-step.highlighted {
  background-color: var(--color-primary-light);
}

.code-line {
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  color: var(--color-text);
}

.code-explanation {
  font-size: 0.8rem;
  color: var(--color-text-soft);
}

/* Queue details styles */
.queue-details {
  margin-top: 1.5rem;
  width: 100%;
  max-width: 500px;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-label {
  font-weight: 500;
  color: var(--color-text-soft);
}

.detail-value {
  font-family: 'Fira Code', monospace;
  color: var(--color-primary);
}

.operation-status {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 0.9rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Dark mode support */
:root.dark .queue-elements {
  background-color: var(--color-background-soft);
}

:root.dark .queue-element {
  background-color: var(--color-background-mute);
  border-color: var(--color-border-dark);
}

:root.dark .element-current {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

:root.dark .queue-pointer {
  background-color: var(--color-background-mute);
}

:root.dark .code-visualization,
:root.dark .queue-details,
:root.dark .operation-status {
  background-color: var(--color-background-mute);
}

:root.dark .code-step.highlighted {
  background-color: var(--color-primary-dark);
}

:root.dark .code-line {
  color: var(--color-text-light);
}

:root.dark .code-explanation,
:root.dark .detail-label {
  color: var(--color-text);
}

:root.dark .detail-value {
  color: var(--color-primary-light);
}
</style>
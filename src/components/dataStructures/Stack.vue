<template>
  <div class="data-stack">
    <div class="stack-container">
      <div class="stack-elements">
        <div
          v-for="(element, index) in [...store.stack].reverse()"
          :key="index"
          class="stack-element"
          :class="{
            'element-current': currentIndex === store.stack.length - 1 - index,
            'element-pushed': isPushing && index === 0,
            'element-popped': isPopping && index === 0,
            'element-peeked': isPeeking && index === 0,
            'element-searched': isSearching && searchIndex === store.stack.length - 1 - index,
            'element-status': element.status
          }"
          :style="{ 'z-index': index }"
        >
          <div class="element-value">{{ element.value }}</div>
        </div>
      </div>
      <div class="stack-pointer">Top</div>
    </div>
    <div class="operation-status" v-if="store.operationLog">
      {{ store.operationLog }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDataStructureStore } from '@/store';

const store = useDataStructureStore();
const currentIndex = ref(-1);
const isPushing = ref(false);
const isPopping = ref(false);
const isPeeking = ref(false);
const isSearching = ref(false);
const searchIndex = ref(-1);

// Helper function to wait with animation speed consideration
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms / store.animationSpeed));

const handlePush = async () => {
  if (!store.currentOperation) return;
  
  isPushing.value = true;
  const value = store.currentOperation.value || 0;
  
  // Highlight first code step
  store.nextStep();
  
  // Add new element to store
  store.pushToStack(value);
  currentIndex.value = store.stack.length - 1;
  
  // Wait for animation
  await wait(800);
  
  // Highlight next code step
  store.nextStep();
  
  // Wait for final animation
  await wait(500);
  
  // Reset states
  isPushing.value = false;
  currentIndex.value = -1;
  
  // Complete the operation
  store.completeOperation();
};

const handlePop = async () => {
  if (store.stack.length === 0) {
    store.operationLog = 'Cannot pop from empty stack';
    store.completeOperation();
    return;
  }
  
  // Highlight first code step
  store.nextStep();
  
  isPopping.value = true;
  currentIndex.value = store.stack.length - 1;
  
  // Wait for animation
  await wait(800);
  
  // Highlight next code step
  store.nextStep();
  
  // Remove element from store
  store.popFromStack();
  
  // Highlight final code step
  store.nextStep();
  
  // Wait for final animation
  await wait(500);
  
  // Reset states
  isPopping.value = false;
  currentIndex.value = -1;
  
  // Complete the operation
  store.completeOperation();
};

const handlePeek = async () => {
  if (store.stack.length === 0) {
    store.operationLog = 'Stack is empty';
    store.completeOperation();
    return;
  }

  // Highlight first code step
  store.nextStep();
  
  isPeeking.value = true;
  currentIndex.value = store.stack.length - 1;
  
  // Peek at the top element
  store.peekStack();
  
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
  
  // Highlight first code step (start from top)
  store.nextStep();
  
  // Traverse and search the stack
  let found = false;
  for (let i = store.stack.length - 1; i >= 0; i--) {
    currentIndex.value = i;
    
    // Wait between checking elements
    await wait(800);
    
    // Highlight the traversal step
    store.nextStep();
    
    // Check if current value matches target
    if (store.stack[i].value === value) {
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
  store.searchStack(value);
  
  // Reset states
  isSearching.value = false;
  currentIndex.value = -1;
  searchIndex.value = -1;
  
  // Complete the operation
  store.completeOperation();
};

const resetStack = () => {
  store.resetStack();
  currentIndex.value = -1;
  isPushing.value = false;
  isPopping.value = false;
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
      case 'Push':
        handlePush();
        break;
      case 'Pop':
        handlePop();
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
      resetStack();
      store.setReset(false);
    }
  }
);
</script>

<style scoped>
.data-stack {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 400px;
}

.stack-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.stack-elements {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 300px;
  width: 200px;
  padding: 1rem;
  background-color: var(--color-background-mute);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.stack-element {
  background-color: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  width: 100%;
  text-align: center;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: relative;
  margin-bottom: -20px;
}

.stack-element:first-child {
  margin-bottom: 0;
}

.element-value {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-text);
}

.stack-pointer {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  margin-top: 0.5rem;
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

.element-pushed {
  animation: pushAnimation 0.8s ease;
}

.element-popped {
  animation: popAnimation 0.8s ease;
}

.element-peeked {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.05);
  animation: peekAnimation 0.8s ease;
}

.element-searched {
  background-color: var(--color-success);
  border-color: var(--color-success);
  transform: scale(1.05);
  animation: searchAnimation 0.8s ease;
}

@keyframes pushAnimation {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes popAnimation {
  0% {
    transform: translateY(0);
    opacity: 1;
  }
  100% {
    transform: translateY(-100%);
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

/* Dark mode support */
:root.dark .stack-elements {
  background-color: var(--color-background-soft);
}

:root.dark .stack-element {
  background-color: var(--color-background-mute);
  border-color: var(--color-border-dark);
}

:root.dark .element-current {
  background-color: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

:root.dark .stack-pointer {
  background-color: var(--color-background-mute);
}

.element-status {
  transition: all 0.3s ease;
}

:root.dark .operation-status {
  background-color: var(--color-background-mute);
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
</style>

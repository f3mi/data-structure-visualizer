<template>
  <div class="data-stack">
    <div class="stack-layout">
      <!-- Stack Visualization -->
      <div class="stack-section">
        <div class="stack-container">
          <div class="stack-pointer">Top</div>
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
           <div class="stack-pointer">Bottom</div>
        </div>
        
        <!-- Stack Details -->
        <div class="stack-details">
          <div class="details-title">Stack Details</div>
          <div class="details-content">
            <div class="detail-item">
              <span class="detail-label">Size:</span>
              <span class="detail-value">{{ store.stack.length }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Top Element:</span>
              <span class="detail-value">{{ store.stack.length > 0 ? store.stack[store.stack.length - 1].value : 'null' }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Is Empty:</span>
              <span class="detail-value">{{ store.stack.length === 0 ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Code Steps Visualization -->
      <div class="code-section" v-if="store.currentOperation">
        <div class="code-visualization">
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
      </div>
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
  const result = store.searchStack(value);
  
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
  width: 100%;
}

.stack-layout {
  display: flex;
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
  align-items: flex-start;
}

.stack-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 300px;
}

.code-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 300px;
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
  gap: 0.5rem;
  min-height: 300px;
  padding: 1rem;
  background-color: var(--color-background-mute);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  width: 100%;
}

.stack-element {
  background-color: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  min-width: 150px;
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

.stack-pointer {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  padding: 0.5rem 1rem;
  background-color: var(--color-background-soft);
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: -0.5rem;
}

/* Animation classes */
.element-current {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.05);
  box-shadow: 0 0 15px rgba(66, 153, 225, 0.5);
  animation: currentPulse 1.5s infinite;
}

.element-current .element-value {
  color: white;
  font-weight: 700;
}

.element-pushed {
  animation: pushAnimation 0.8s ease;
  background-color: var(--color-success);
  border-color: var(--color-success);
  box-shadow: 0 0 15px rgba(72, 187, 120, 0.5);
}

.element-pushed .element-value {
  color: white;
  font-weight: 700;
}

.element-popped {
  animation: popAnimation 0.8s ease;
  background-color: var(--color-danger);
  border-color: var(--color-danger);
  box-shadow: 0 0 15px rgba(245, 101, 101, 0.5);
}

.element-popped .element-value {
  color: white;
  font-weight: 700;
}

.element-peeked {
  background-color: var(--color-warning);
  border-color: var(--color-warning);
  transform: scale(1.05);
  animation: peekAnimation 0.8s ease, peekPulse 1.5s infinite;
  box-shadow: 0 0 15px rgba(246, 173, 85, 0.5);
}

.element-peeked .element-value {
  color: white;
  font-weight: 700;
}

.element-searched {
  background-color: var(--color-success);
  border-color: var(--color-success);
  transform: scale(1.05);
  animation: searchAnimation 0.8s ease, foundPulse 1.5s infinite;
  box-shadow: 0 0 15px rgba(72, 187, 120, 0.5);
}

.element-searched .element-value {
  color: white;
  font-weight: 700;
}

@keyframes currentPulse {
  0% {
    box-shadow: 0 0 15px rgba(66, 153, 225, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(66, 153, 225, 0.8);
  }
  100% {
    box-shadow: 0 0 15px rgba(66, 153, 225, 0.5);
  }
}

@keyframes peekPulse {
  0% {
    box-shadow: 0 0 15px rgba(246, 173, 85, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(246, 173, 85, 0.8);
  }
  100% {
    box-shadow: 0 0 15px rgba(246, 173, 85, 0.5);
  }
}

@keyframes foundPulse {
  0% {
    box-shadow: 0 0 15px rgba(72, 187, 120, 0.5);
  }
  50% {
    box-shadow: 0 0 25px rgba(72, 187, 120, 0.8);
  }
  100% {
    box-shadow: 0 0 15px rgba(72, 187, 120, 0.5);
  }
}

@keyframes pushAnimation {
  0% {
    transform: translateY(-100%) scale(1.1);
    opacity: 0;
    box-shadow: 0 0 30px rgba(72, 187, 120, 0.8);
  }
  100% {
    transform: translateY(0) scale(1.05);
    opacity: 1;
    box-shadow: 0 0 15px rgba(72, 187, 120, 0.5);
  }
}

@keyframes popAnimation {
  0% {
    transform: translateY(0) scale(1.05);
    opacity: 1;
    box-shadow: 0 0 15px rgba(245, 101, 101, 0.5);
  }
  100% {
    transform: translateY(-100%) scale(1.1);
    opacity: 0;
    box-shadow: 0 0 30px rgba(245, 101, 101, 0.8);
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
  width: 100%;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.code-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.code-steps {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.code-step {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  background-color: var(--color-background-mute);
}

.code-step.highlighted {
  background-color: var(--color-primary-light);
  box-shadow: 0 0 10px rgba(66, 153, 225, 0.2);
}

.code-line {
  font-family: 'Fira Code', monospace;
  font-size: 0.95rem;
  color: var(--color-text);
  font-weight: 500;
}

.code-explanation {
  font-size: 0.9rem;
  color: var(--color-text-soft);
  line-height: 1.4;
}

.operation-status {
  padding: 0.75rem 1rem;
  background-color: var(--color-background-soft);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.95rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Stack details styles */
.stack-details {
  width: 100%;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.details-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.details-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background-mute);
  border-radius: 4px;
}

.detail-label {
  font-weight: 500;
  color: var(--color-text-soft);
}

.detail-value {
  font-family: 'Fira Code', monospace;
  color: var(--color-primary);
  font-weight: 600;
}

/* Responsive design */
@media (max-width: 768px) {
  .stack-layout {
    flex-direction: column;
  }
  
  .stack-section,
  .code-section {
    width: 100%;
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

:root.dark .code-visualization,
:root.dark .stack-details,
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


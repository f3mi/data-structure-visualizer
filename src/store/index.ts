import { defineStore } from "pinia";
import { createPinia } from "pinia";

interface Node {
  value: string;
  highlighted: boolean;
  status: string; // '', 'inserting', 'deleting', 'searching'
}

interface CodeStep {
  line: string;
  explanation: string;
  highlight: boolean;
}

interface Operation {
  type: string;
  value?: any;
  index?: number;
  completed: boolean;
  currentStep: number;
  codeSteps: CodeStep[];
}

export const useDataStructureStore = defineStore("dataStructure", {
  state: () => ({
    activeDataStructure: "Linked List",
    linkedList: [] as Node[],
    stack: [] as Node[],
    queue: [] as Node[],
    binaryTree: [] as any[],
    heap: [] as any[],
    graph: { nodes: [], edges: [] } as any,
    currentOperation: null as Operation | null,
    operationLog: "",
    animationSpeed: 1,
    isPlaying: true,
    currentStep: 0,
    codeSteps: [] as CodeStep[],
    shouldReset: false,
  }),

  actions: {
    setActiveDataStructure(structure: string) {
      this.activeDataStructure = structure;
      this.operationLog = "";
    },

    updateLinkedList(newList: Node[]) {
      this.linkedList = newList;
    },

    updateNodeHighlight(index: number, highlighted: boolean) {
      if (index >= 0 && index < this.linkedList.length) {
        this.linkedList[index].highlighted = highlighted;
      }
    },

    updateNodeStatus(index: number, status: string) {
      if (index >= 0 && index < this.linkedList.length) {
        this.linkedList[index].status = status;
      }
    },

    setOperationLog(log: string) {
      this.operationLog = log;
    },

    setOperation(type: string, value?: any, index?: number) {
      const steps = this.getCodeSteps(type, value, index);
      this.currentOperation = {
        type,
        value,
        index,
        completed: false,
        currentStep: 0,
        codeSteps: steps,
      };
      this.currentStep = 0;
      this.codeSteps = steps;
    },

    getCodeSteps(type: string, value?: any, index?: number): CodeStep[] {
      switch (type) {
        case "Insert at Head":
          return [
            {
              line: "newNode = Node(value)",
              explanation: "Create new node",
              highlight: false,
            },
            {
              line: "newNode.next = head",
              explanation: "Point new node to current head",
              highlight: false,
            },
            {
              line: "head = newNode",
              explanation: "Update head pointer",
              highlight: false,
            },
          ];
        case "Insert at Tail":
          return [
            {
              line: "newNode = Node(value)",
              explanation: "Create new node",
              highlight: false,
            },
            {
              line: "if head is null:",
              explanation: "Check if list is empty",
              highlight: false,
            },
            {
              line: "    head = newNode",
              explanation: "Set head to new node",
              highlight: false,
            },
            {
              line: "else:",
              explanation: "List not empty",
              highlight: false,
            },
            {
              line: "    current = head",
              explanation: "Start from head",
              highlight: false,
            },
            {
              line: "    while current.next:",
              explanation: "Traverse to last node",
              highlight: false,
            },
            {
              line: "        current = current.next",
              explanation: "Move to next node",
              highlight: false,
            },
            {
              line: "    current.next = newNode",
              explanation: "Link last node to new node",
              highlight: false,
            },
          ];
        case "Delete at Head":
          return [
            {
              line: "if head is null:",
              explanation: "Check if list is empty",
              highlight: false,
            },
            {
              line: "    return null",
              explanation: "Nothing to delete",
              highlight: false,
            },
            {
              line: "temp = head",
              explanation: "Store current head",
              highlight: false,
            },
            {
              line: "head = head.next",
              explanation: "Update head pointer",
              highlight: false,
            },
            {
              line: "return temp.value",
              explanation: "Return deleted value",
              highlight: false,
            },
          ];
        case "Delete at Tail":
          return [
            {
              line: "current = head",
              explanation: "Start from head",
              highlight: false,
            },
            {
              line: "while current.next.next:",
              explanation: "Traverse to second last node",
              highlight: false,
            },
            {
              line: "    current = current.next",
              explanation: "Move to next node",
              highlight: false,
            },
            {
              line: "temp = current.next",
              explanation: "Store last node",
              highlight: false,
            },
            {
              line: "current.next = null",
              explanation: "Remove last node",
              highlight: false,
            },
          ];
        case "Delete at Index":
          return [
            {
              line: "current = head",
              explanation: "Start from head",
              highlight: false,
            },
            {
              line: "for i in range(index):",
              explanation: "Traverse to target position",
              highlight: false,
            },
            {
              line: "    current = current.next",
              explanation: "Move to next node",
              highlight: false,
            },
            {
              line: "temp = current.next",
              explanation: "Store node to delete",
              highlight: false,
            },
            {
              line: "current.next = current.next.next",
              explanation: "Skip over node to delete",
              highlight: false,
            },
          ];
        case "Search":
          return [
            {
              line: "current = head",
              explanation: "Start from head",
              highlight: false,
            },
            {
              line: "while current:",
              explanation: "Traverse list",
              highlight: false,
            },
            {
              line: "    if current.value == target:",
              explanation: "Check current node",
              highlight: false,
            },
            {
              line: "        return current",
              explanation: "Value found",
              highlight: false,
            },
            {
              line: "    current = current.next",
              explanation: "Move to next node",
              highlight: false,
            },
            {
              line: "return null",
              explanation: "Value not found",
              highlight: false,
            },
          ];
        case "Insert at Index":
          return [
            {
              line: "newNode = Node(value)",
              explanation: "Create new node",
              highlight: false,
            },
            {
              line: "current = head",
              explanation: "Start from head",
              highlight: false,
            },
            {
              line: "for i in range(index):",
              explanation: "Traverse to insertion point",
              highlight: false,
            },
            {
              line: "    current = current.next",
              explanation: "Move to next node",
              highlight: false,
            },
            {
              line: "    if current.next:",
              explanation: "Check if next node exists",
              highlight: false,
            },
            {
              line: "        nextNode = current.next",
              explanation: "Store next node",
              highlight: false,
            },
            {
              line: "        current.next = newNode",
              explanation: "Link current to new node",
              highlight: false,
            },
            {
              line: "        newNode.next = nextNode",
              explanation: "Link new node to next",
              highlight: false,
            },
          ];
        case "Push":
          return [
            {
              line: "stack.push(value)",
              explanation: "Add new element to the top of the stack",
              highlight: false,
            },
            {
              line: "// Stack: [..., value]",
              explanation: "New element is now at the top of the stack",
              highlight: false,
            },
          ];
        case "Pop":
          return [
            {
              line: "if (!stack.isEmpty())",
              explanation: "Check if stack is not empty",
              highlight: false,
            },
            {
              line: "  value = stack.pop()",
              explanation: "Remove and return the top element",
              highlight: false,
            },
            {
              line: "// Stack: [...]",
              explanation: "Top element has been removed",
              highlight: false,
            },
          ];
        case "Peek":
          return [
            {
              line: "if (!stack.isEmpty())",
              explanation: "Check if stack is not empty",
              highlight: false,
            },
            {
              line: "  value = stack.peek()",
              explanation: "Return the top element without removing it",
              highlight: false,
            },
          ];
        case "Search":
          return [
            {
              line: "current = stack.top",
              explanation: "Start from the top of the stack",
              highlight: false,
            },
            {
              line: "while (current != null)",
              explanation: "Traverse through the stack",
              highlight: false,
            },
            {
              line: "  if (current.value == target)",
              explanation: "Check if current element matches target",
              highlight: false,
            },
            {
              line: "    return current",
              explanation: "Element found",
              highlight: false,
            },
            {
              line: "  current = current.next",
              explanation: "Move to next element",
              highlight: false,
            },
            {
              line: "return null",
              explanation: "Element not found",
              highlight: false,
            },
          ];
        default:
          return [];
      }
    },

    nextStep() {
      if (
        this.currentOperation &&
        this.currentStep < this.currentOperation.codeSteps.length - 1
      ) {
        this.currentStep++;
        this.currentOperation.currentStep = this.currentStep;
        this.currentOperation.codeSteps[this.currentStep - 1].highlight = false;
        this.currentOperation.codeSteps[this.currentStep].highlight = true;
      }
    },

    resetSteps() {
      this.currentStep = 0;
      if (this.currentOperation) {
        this.currentOperation.currentStep = 0;
        this.currentOperation.codeSteps.forEach(
          (step) => (step.highlight = false)
        );
        if (this.currentOperation.codeSteps.length > 0) {
          this.currentOperation.codeSteps[0].highlight = true;
        }
      }
    },

    completeOperation() {
      if (this.currentOperation) {
        this.currentOperation = { ...this.currentOperation, completed: true };
      }
    },

    setAnimationSpeed(speed: number) {
      this.animationSpeed = speed;
    },

    togglePlayPause() {
      this.isPlaying = !this.isPlaying;
    },

    reset() {
      switch (this.activeDataStructure) {
        case "Linked List":
          this.linkedList = [];
          break;
        case "Stack":
          this.stack = [];
          break;
        case "Queue":
          this.queue = [];
          break;
        case "Binary Tree":
          this.binaryTree = [];
          break;
        case "Heap":
          this.heap = [];
          break;
        case "Graph":
          this.graph = { nodes: [], edges: [] };
          break;
      }
      this.operationLog = "Reset completed";
    },

    setReset(value: boolean) {
      this.shouldReset = value;
    },

    pushToStack(value: number) {
      const newNode = {
        value: value.toString(),
        highlighted: false,
        status: "pushing",
      };
      this.stack = [...this.stack, newNode];
      this.operationLog = `Pushed ${value} to the stack`;
    },

    popFromStack() {
      if (this.stack.length > 0) {
        const poppedValue = this.stack[this.stack.length - 1].value;
        this.stack = this.stack.slice(0, -1);
        this.operationLog = `Popped ${poppedValue} from the stack`;
      } else {
        this.operationLog = "Cannot pop from empty stack";
      }
    },

    resetStack() {
      this.stack = [];
      this.operationLog = "Stack has been reset";
    },

    peekStack() {
      if (this.stack.length > 0) {
        const topValue = this.stack[this.stack.length - 1].value;
        this.operationLog = `Top element is ${topValue}`;
        return topValue;
      } else {
        this.operationLog = "Stack is empty";
        return null;
      }
    },

    searchStack(value: string) {
      const index = this.stack.findIndex((node) => node.value === value);
      if (index !== -1) {
        this.operationLog = `Found ${value} at position ${
          this.stack.length - index - 1
        } from top`;
        return index;
      } else {
        this.operationLog = `${value} not found in stack`;
        return -1;
      }
    },
  },
});

export const pinia = createPinia();

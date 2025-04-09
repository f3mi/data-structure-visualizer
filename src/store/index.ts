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

export interface BinaryTreeNode {
  value: number;
  left: BinaryTreeNode | null;
  right: BinaryTreeNode | null;
  height: number;
  status?: "current" | "found" | "traversed";
}

export const useDataStructureStore = defineStore("dataStructure", {
  state: () => ({
    activeDataStructure: "Linked List",
    linkedList: [] as Node[],
    stack: [] as Node[],
    queue: [] as Node[],
    binaryTree: null as BinaryTreeNode | null,
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
      if (!this.currentOperation || this.currentOperation.completed) {
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
        this.operationLog = `Starting ${type} operation...`;
      }
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
        case "Enqueue":
          return [
            {
              line: "newNode = Node(value)",
              explanation: "Create new node with value",
              highlight: false,
            },
            {
              line: "if queue.isEmpty():",
              explanation: "Check if queue is empty",
              highlight: false,
            },
            {
              line: "    front = newNode",
              explanation: "Set front to new node if empty",
              highlight: false,
            },
            {
              line: "else:",
              explanation: "Queue not empty",
              highlight: false,
            },
            {
              line: "    rear.next = newNode",
              explanation: "Link rear to new node",
              highlight: false,
            },
            {
              line: "rear = newNode",
              explanation: "Update rear pointer",
              highlight: false,
            },
          ];
        case "Dequeue":
          return [
            {
              line: "if queue.isEmpty():",
              explanation: "Check if queue is empty",
              highlight: false,
            },
            {
              line: "    return null",
              explanation: "Nothing to dequeue",
              highlight: false,
            },
            {
              line: "temp = front",
              explanation: "Store front node",
              highlight: false,
            },
            {
              line: "front = front.next",
              explanation: "Move front pointer",
              highlight: false,
            },
            {
              line: "if front is null:",
              explanation: "Check if queue is now empty",
              highlight: false,
            },
            {
              line: "    rear = null",
              explanation: "Reset rear pointer",
              highlight: false,
            },
            {
              line: "return temp.value",
              explanation: "Return dequeued value",
              highlight: false,
            },
          ];
        case "Peek":
          return [
            {
              line: "if queue.isEmpty():",
              explanation: "Check if queue is empty",
              highlight: false,
            },
            {
              line: "    return null",
              explanation: "Nothing to peek",
              highlight: false,
            },
            {
              line: "return front.value",
              explanation: "Return front value",
              highlight: false,
            },
          ];
        case "Search":
          return [
            {
              line: "current = front",
              explanation: "Start from front",
              highlight: false,
            },
            {
              line: "while current:",
              explanation: "Traverse queue",
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
        case "Insert":
          return [
            {
              line: "newNode = Node(value)",
              explanation: "Create new node with value",
              highlight: false,
            },
            {
              line: "if tree is empty:",
              explanation: "Check if tree is empty",
              highlight: false,
            },
            {
              line: "    root = newNode",
              explanation: "Set root to new node",
              highlight: false,
            },
            {
              line: "else:",
              explanation: "Tree not empty",
              highlight: false,
            },
            {
              line: "    find first available spot",
              explanation: "Find first available position",
              highlight: false,
            },
            {
              line: "    insert node",
              explanation: "Insert node at found position",
              highlight: false,
            },
          ];
        case "Delete":
          return [
            {
              line: "if tree is empty:",
              explanation: "Check if tree is empty",
              highlight: false,
            },
            {
              line: "    return null",
              explanation: "Nothing to delete",
              highlight: false,
            },
            {
              line: "find last node",
              explanation: "Find the last node in the tree",
              highlight: false,
            },
            {
              line: "update parent references",
              explanation: "Update parent node references",
              highlight: false,
            },
            {
              line: "remove node",
              explanation: "Remove the node from the tree",
              highlight: false,
            },
          ];
        case "Search":
          return [
            {
              line: "current = root",
              explanation: "Start from root node",
              highlight: false,
            },
            {
              line: "while current:",
              explanation: "Traverse tree",
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
        const { type, value, index } = this.currentOperation;

        // Generate detailed operation log messages
        if (type.startsWith("Insert")) {
          if (type === "Insert at Head") {
            this.operationLog = `Inserted value ${value} at the head of the list`;
          } else if (type === "Insert at Tail") {
            this.operationLog = `Inserted value ${value} at the tail of the list`;
          } else if (type === "Insert at Index") {
            this.operationLog = `Inserted value ${value} at index ${index} of the list`;
          }
        } else if (type.startsWith("Delete")) {
          if (type === "Delete at Head" && this.linkedList.length > 0) {
            this.operationLog = `Deleted value from the head of the list`;
          } else if (type === "Delete at Tail" && this.linkedList.length > 0) {
            this.operationLog = `Deleted value from the tail of the list`;
          } else if (type === "Delete at Index" && this.linkedList.length > 0) {
            this.operationLog = `Deleted value at index ${index} of the list`;
          } else {
            this.operationLog = `Cannot delete from empty list`;
          }
        } else if (type === "Push") {
          this.operationLog = `Pushed value ${value} onto the stack`;
        } else if (type === "Pop") {
          if (this.stack.length > 0) {
            this.operationLog = `Popped value from the stack`;
          } else {
            this.operationLog = `Cannot pop from empty stack`;
          }
        } else if (type === "Enqueue") {
          this.operationLog = `Enqueued value ${value} to the queue`;
        } else if (type === "Dequeue") {
          if (this.queue.length > 0) {
            this.operationLog = `Dequeued value from the queue`;
          } else {
            this.operationLog = `Cannot dequeue from empty queue`;
          }
        } else if (type === "Search") {
          // Search results are handled in the specific search functions
        } else if (type === "Peek") {
          if (this.activeDataStructure === "Stack") {
            if (this.stack.length > 0) {
              this.operationLog = `Peek: Top element is ${
                this.stack[this.stack.length - 1].value
              }`;
            } else {
              this.operationLog = `Stack is empty`;
            }
          } else if (this.activeDataStructure === "Queue") {
            if (this.queue.length > 0) {
              this.operationLog = `Peek: Front element is ${this.queue[0].value}`;
            } else {
              this.operationLog = `Queue is empty`;
            }
          }
        }

        this.currentOperation.completed = true;
        this.currentOperation = null;
      }
    },

    setAnimationSpeed(speed: number) {
      this.animationSpeed = speed;
      this.operationLog = `Animation speed set to ${speed}/5`;
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
          this.binaryTree = null;
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

    pushToStack(value: any) {
      if (!this.currentOperation || this.currentOperation.completed) return;

      this.stack.push({
        value: value.toString(),
        highlighted: false,
        status: "",
      });
      this.operationLog = `Pushed ${value} to stack`;
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

    pushToQueue(value: any) {
      if (!this.currentOperation || this.currentOperation.completed) return;

      this.queue.push({
        value: value.toString(),
        highlighted: false,
        status: "",
      });
      this.operationLog = `Enqueued ${value}`;
    },

    dequeueFromQueue() {
      if (this.queue.length > 0) {
        const dequeuedValue = this.queue[0].value;
        this.queue = this.queue.slice(1);
        this.operationLog = `Dequeued ${dequeuedValue} from the queue`;
      } else {
        this.operationLog = "Cannot dequeue from empty queue";
      }
    },

    peekQueue() {
      if (this.queue.length > 0) {
        const frontValue = this.queue[0].value;
        this.operationLog = `Front element is ${frontValue}`;
        return frontValue;
      } else {
        this.operationLog = "Queue is empty";
        return null;
      }
    },

    searchQueue(value: string) {
      const index = this.queue.findIndex((node) => node.value === value);
      if (index !== -1) {
        this.operationLog = `Found ${value} at position ${index} from front`;
        return index;
      } else {
        this.operationLog = `${value} not found in queue`;
        return -1;
      }
    },

    resetQueue() {
      this.queue = [];
      this.operationLog = "Queue has been reset";
    },

    // Helper function to get height of a node
    getHeight(node: BinaryTreeNode | null): number {
      return node ? node.height : 0;
    },

    // Helper function to update height of a node
    updateHeight(node: BinaryTreeNode): void {
      node.height =
        Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
    },

    // Helper function to get balance factor
    getBalanceFactor(node: BinaryTreeNode): number {
      return this.getHeight(node.left) - this.getHeight(node.right);
    },

    // Right rotation
    rotateRight(y: BinaryTreeNode): BinaryTreeNode {
      const x = y.left!;
      const T2 = x.right;

      x.right = y;
      y.left = T2;

      this.updateHeight(y);
      this.updateHeight(x);

      return x;
    },

    // Left rotation
    rotateLeft(x: BinaryTreeNode): BinaryTreeNode {
      const y = x.right!;
      const T2 = y.left;

      y.left = x;
      x.right = T2;

      this.updateHeight(x);
      this.updateHeight(y);

      return y;
    },

    // Balance the tree
    balance(node: BinaryTreeNode): BinaryTreeNode {
      this.updateHeight(node);
      const balanceFactor = this.getBalanceFactor(node);

      // Left heavy
      if (balanceFactor > 1) {
        if (this.getBalanceFactor(node.left!) < 0) {
          node.left = this.rotateLeft(node.left!);
        }
        return this.rotateRight(node);
      }

      // Right heavy
      if (balanceFactor < -1) {
        if (this.getBalanceFactor(node.right!) > 0) {
          node.right = this.rotateRight(node.right!);
        }
        return this.rotateLeft(node);
      }

      return node;
    },

    // Insert into binary tree with balancing
    insertToBinaryTree(value: number): void {
      const insertNode = (
        node: BinaryTreeNode | null,
        value: number
      ): BinaryTreeNode => {
        if (!node) {
          return { value, left: null, right: null, height: 1 };
        }

        if (value < node.value) {
          node.left = insertNode(node.left, value);
        } else if (value > node.value) {
          node.right = insertNode(node.right, value);
        } else {
          return node; // Duplicate values not allowed
        }

        return this.balance(node);
      };

      this.binaryTree = insertNode(this.binaryTree, value);
    },

    // Delete from binary tree with balancing
    deleteFromBinaryTree(value: number): void {
      const findMin = (node: BinaryTreeNode): BinaryTreeNode => {
        while (node.left) {
          node = node.left;
        }
        return node;
      };

      const deleteNode = (
        node: BinaryTreeNode | null,
        value: number
      ): BinaryTreeNode | null => {
        if (!node) return null;

        if (value < node.value) {
          node.left = deleteNode(node.left, value);
        } else if (value > node.value) {
          node.right = deleteNode(node.right, value);
        } else {
          if (!node.left || !node.right) {
            node = node.left || node.right;
          } else {
            const temp = findMin(node.right);
            node.value = temp.value;
            node.right = deleteNode(node.right, temp.value);
          }
        }

        if (!node) return null;
        return this.balance(node);
      };

      this.binaryTree = deleteNode(this.binaryTree, value);
    },
  },
});

export const pinia = createPinia();

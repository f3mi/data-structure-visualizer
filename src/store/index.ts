import { defineStore } from "pinia";

interface Node {
  value: string;
  highlighted: boolean;
  status: string; // '', 'inserting', 'deleting', 'searching'
}

interface Operation {
  type: string;
  value?: string;
  index?: number;
  completed?: boolean;
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
    animationSpeed: 5,
    isPlaying: true,
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

    executeOperation(operation: Operation) {
      this.currentOperation = { ...operation, completed: false };
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
  },
});

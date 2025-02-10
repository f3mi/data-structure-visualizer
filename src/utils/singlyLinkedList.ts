export class Node {
  value: number;
  next: Node | null;

  constructor(value: number) {
    this.value = value;
    this.next = null;
  }
}

export default class SinglyLinkedList {
  head: Node | null;
  tail: Node | null;
  length: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Append a node to the end
  append(value: number): void {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  // Reverse the linked list
  reverse(): void {
    let current = this.head;
    let prev = null;
    while (current) {
      let nextNode = current.next;
      current.next = prev;
      prev = current;
      current = nextNode;
    }
    this.tail = this.head;
    this.head = prev;
  }

  // Remove node at a specific index
  remove(index: number): void {
    if (index < 0 || index >= this.length) {
      console.error("Invalid index");
      return;
    }

    if (index === 0) {
      this.head = this.head!.next;
      if (this.length === 1) this.tail = null;
    } else {
      const leader = this.traverseToIndex(index - 1);
      if (!leader || !leader.next) return;
      const unwantedNode = leader.next;
      leader.next = unwantedNode.next;
      if (index === this.length - 1) this.tail = leader;
    }
    this.length--;
  }

  // Insert node at a specific index
  insert(index: number, value: number): void {
    if (index < 0 || index > this.length) {
      console.error("Invalid index");
      return;
    }

    const newNode = new Node(value);

    if (index === 0) {
      newNode.next = this.head;
      this.head = newNode;
      if (this.length === 0) this.tail = newNode;
    } else {
      const leader = this.traverseToIndex(index - 1);
      if (!leader) return;
      newNode.next = leader.next;
      leader.next = newNode;
      if (index === this.length) this.tail = newNode;
    }
    this.length++;
  }

  // Traverse to a specific index safely
  traverseToIndex(index: number): Node | null {
    if (index < 0 || index >= this.length) return null;
    let counter = 0;
    let currentNode = this.head;
    while (counter !== index) {
      currentNode = currentNode!.next;
      counter++;
    }
    return currentNode;
  }

  // Convert linked list to array for visualization
  toArray(): { value: number }[] {
    const arr: { value: number }[] = [];
    let current = this.head;
    while (current) {
      arr.push({ value: current.value });
      current = current.next;
    }
    return arr;
  }
}

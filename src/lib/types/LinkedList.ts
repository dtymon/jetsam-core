/**
 * A node in a linked list. Note that we use the same type of node for both
 * singly and doubly linked lists. However the previous pointer is not
 * maintained or accessed by the singly linked version.
 *
 * @typeParam Item - the type of items handled by the list
 */
interface LinkedListNode<Item> {
  // The item that the node contains
  item: Item;

  // The previous item in the list or undefined if this is the first
  prev?: LinkedListNode<Item>;

  // The next item in the list or undefined if this is the last
  next?: LinkedListNode<Item>;
}

/**
 * A chain is a collection of linked nodes delineated by its first and last
 * nodes.
 *
 * @typeParam Item - the type of items handled by the list
 */
interface LinkedListChain<Item> {
  // The first item in the chain
  first: LinkedListNode<Item>;

  // The last item in the chain
  last: LinkedListNode<Item>;

  // The number of items in the chain
  count: number;
}

/**
 * A singly linked list
 *
 * @typeParam Item - the type of items handled by the list
 */
export class LinkedList<Item> implements Iterable<Item> {
  // The head node of the list
  protected head?: LinkedListNode<Item>;

  // The tail node of the list
  protected tail?: LinkedListNode<Item>;

  // The number of items in the list
  protected count = 0;

  /**
   * Constructor
   *
   * @typeParam Item - the type of item stored in the list
   * @param items - optional items to start the list
   */
  public constructor(...items: Item[]) {
    if (items.length > 0) {
      this.addChainToEnd(this.createChain(items[0], ...items.splice(1)));
    }
  }

  /**
   * Get the number of items in the list
   *
   * @returns the number of items in the list
   */
  public length(): number {
    return this.count;
  }

  /**
   * Called to see if the list is empty
   *
   * @returns true if the list is empty
   */
  public empty(): boolean {
    return this.count === 0;
  }

  /**
   * Add one or more items to the end of the list
   *
   * @param item - the first item to be added
   * @param others - the other items to add
   * @returns this instance to allow for chaining
   */
  public push(item: Item, ...others: Item[]): this {
    this.addChainToEnd(this.createChain(item, ...others));
    return this;
  }

  /**
   * Add an item to the start of the list
   *
   * @param item - the first item to be added
   * @param others - the other items to add
   * @returns this instance to allow for chaining
   */
  public unshift(item: Item, ...others: Item[]): this {
    this.addChainToStart(this.createChain(item, ...others));
    return this;
  }

  /**
   * Remove the head of the list
   *
   * @returns the item removed or undefined if the list is empty
   */
  public shift(): Item | undefined {
    // Make sure the list is not empty
    const node = this.head;
    if (node === undefined) {
      return undefined;
    }

    // Move the head forward and the tail if it is affected
    this.head = node.next;
    if (this.tail === node) {
      this.tail = node.next;
    }

    --this.count;
    return node.item;
  }

  /**
   * Given an array of items, convert them into a chain of nodes.
   *
   * @param item - the first item for the chain
   * @param other - the other items for the chain
   * @returns the chain created for the items
   */
  protected createChain(item: Item, ...others: Item[]): LinkedListChain<Item> {
    // Create the first node in the chain
    let count = 1;
    const first: LinkedListNode<Item> = { item };
    let last: LinkedListNode<Item> = first;

    // And connect each other item
    if (others.length > 0) {
      for (const nextItem of others) {
        last.next = { item: nextItem };
        last = last.next;
        ++count;
      }
    }

    return { first, last, count };
  }

  /**
   * Add a chain of nodes to the start of the list.
   *
   * @param chain - the chain to be added
   */
  protected addChainToStart(chain: LinkedListChain<Item>) {
    // The last item in the chain should point to the head (if any)
    chain.last.next = this.head;

    // The first node in the chain becomes the head of the list
    this.head = chain.first;
    this.count += chain.count;

    // If there's no tail currently, then it is set to the end of the chain
    if (this.tail === undefined) {
      this.tail = chain.last;
    }
  }

  /**
   * Adds a chain of nodes to the end of the list
   *
   * @param chain - the chain to be added
   */
  protected addChainToEnd(chain: LinkedListChain<Item>) {
    // If there's currently a tail then it should now point to the head of this
    // chain.
    if (this.tail !== undefined) {
      this.tail.next = chain.first;
    }

    // Otherwise, since there is no tail then there's no head either in which
    // case it should point to the start of the chain.
    else {
      this.head = chain.first;
    }

    // The tail of the list is now the end of the chain
    this.tail = chain.last;
    this.count += chain.count;
  }

  /**
   * Return an iterator that can iterate the list
   *
   * @returns the iterator
   */
  [Symbol.iterator](): Iterator<Item> {
    return new LinkedListForwardIterator(this.head);
  }

  /**
   * Return the first item in the list without removing it
   *
   * @returns the first item or undefined
   */
  public first(): Item | undefined {
    return this.head?.item;
  }

  /**
   * Return the last item in the list without removing it
   *
   * @returns the last item or undefined
   */
  public last(): Item | undefined {
    return this.tail?.item;
  }

  /**
   * Convert the list into its array equivalent
   *
   * @returns the linked list as an array
   */
  public toArray(): Item[] {
    const items: Item[] = [];
    for (const item of this) {
      items.push(item);
    }
    return items;
  }

  /**
   * Convert the list into its string representation
   *
   * @returns the string representation of the list
   */
  public toString(): string {
    return this.toArray().toString();
  }

  /**
   * Convert the list into its JSON equivalent
   *
   * @returns the JSON equivalent
   */
  public toJSON(): Item[] {
    return this.toArray();
  }
}

/**
 * A doubly linked list
 *
 * @typeParam Item - the type of items handled by the list
 */
export class DoublyLinkedList<Item> extends LinkedList<Item> {
  /**
   * Remove the head of the list
   *
   * @returns the item removed or undefined if the list is empty
   */
  public shift(): Item | undefined {
    // Call the base class version to get the item. Then we need to unset the
    // new head's previous pointer.
    const item = super.shift();
    if (this.head !== undefined) {
      this.head.prev = undefined;
    }

    return item;
  }

  /**
   * Remove the tail of the list. This is only available in the doubly linked
   * version since it requires the previous pointer to be able to move the tail
   * backwards.
   *
   * @returns the item removed or undefined if the list is empty
   */
  public pop(): Item | undefined {
    // Make sure the list is not empty
    const node = this.tail;
    if (node === undefined) {
      return undefined;
    }

    // Move the tail backward and the head if it is affected
    this.tail = node.prev;
    if (this.tail === undefined) {
      // This was the last item in the list so the head is now undefined too
      this.head = undefined;
    } else {
      // The new tail has no next item
      this.tail.next = undefined;
    }

    --this.count;
    return node.item;
  }

  /**
   * Given an array of items, convert them into a chain of nodes.
   *
   * @param item - the first item for the chain
   * @param other - the other items for the chain
   * @returns the chain created for the items
   */
  protected createChain(item: Item, ...others: Item[]): LinkedListChain<Item> {
    // Create the first node in the chain
    let count = 1;
    const first: LinkedListNode<Item> = { item };
    let last: LinkedListNode<Item> = first;

    // And connect each other item
    for (const nextItem of others) {
      const node: LinkedListNode<Item> = { item: nextItem, prev: last };
      last.next = node;
      last = last.next;
      ++count;
    }

    return { first, last, count };
  }

  /**
   * Add a chain of nodes to the start of the list.
   *
   * @param chain - the chain to be added
   */
  protected addChainToStart(chain: LinkedListChain<Item>) {
    // If there is currently a head then link it to the end of the chain
    if (this.head !== undefined) {
      chain.last.next = this.head;
      this.head.prev = chain.last;
    }

    // Otherwise, since there is no head then there's no tail either in which
    // case it should point to the end of the chain.
    else {
      this.tail = chain.last;
    }

    // The first node in the chain becomes the head of the list
    this.head = chain.first;
    this.count += chain.count;
  }

  /**
   * Adds a chain of nodes to the end of the list
   *
   * @param chain - the chain to be added
   */
  protected addChainToEnd(chain: LinkedListChain<Item>) {
    // If there's currently a tail then it should now point to the head of this
    // chain.
    if (this.tail !== undefined) {
      this.tail.next = chain.first;
      chain.first.prev = this.tail;
    }

    // Otherwise, since there is no tail then there's no head either in which
    // case it should point to the start of the chain.
    else {
      this.head = chain.first;
    }

    // The tail of the list is now the end of the chain
    this.tail = chain.last;
    this.count += chain.count;
  }

  /**
   * Return a reverse iterator for the list
   *
   * @returns the iterator
   */
  riterator(): LinkedListReverseIterator<Item> {
    return new LinkedListReverseIterator(this.tail);
  }
}

/**
 * A forward iterator for a linked list
 *
 * @typeParam Item - the type of items handled by the list
 */
class LinkedListForwardIterator<Item> {
  // The node the iterator is currently pointing to
  private ptr: Readonly<LinkedListNode<Item>> | undefined;

  /**
   * Constructor
   *
   * @param node - the node to start iterating from or undefined if no node to
   * start with
   */
  public constructor(node: Readonly<LinkedListNode<Item>> | undefined) {
    this.ptr = node;
  }

  /**
   * Returns the next item in the list
   *
   * @returns the result of the interator
   */
  public next(): IteratorResult<Item> {
    if (this.ptr === undefined) {
      return { done: true, value: undefined };
    } else {
      // Grab the item and move the pointer forward
      const item = this.ptr.item;
      this.ptr = this.ptr.next;
      return { done: false, value: item };
    }
  }
}

/**
 * A reverse iterator for a linked list
 *
 * @typeParam Item - the type of items handled by the list
 */
class LinkedListReverseIterator<Item> implements Iterable<Item> {
  // The node the iterator is currently pointing to
  private ptr: Readonly<LinkedListNode<Item>> | undefined;

  /**
   * Constructor
   *
   * @param node - the node to start iterating from or undefined if no node to
   * start with
   */
  public constructor(node: Readonly<LinkedListNode<Item>> | undefined) {
    this.ptr = node;
  }

  /**
   * Returns the next item in the list
   *
   * @returns the result of the interator
   */
  public next(): IteratorResult<Item> {
    if (this.ptr === undefined) {
      return { done: true, value: undefined };
    } else {
      // Grab the item and move the pointer backward
      const item = this.ptr.item;
      this.ptr = this.ptr.prev;
      return { done: false, value: item };
    }
  }

  /**
   * To make it possible to use this reverse iterator in `for` loops, we define
   * an iterator for the iterator. For example:
   *
   * ```ts
   *   for (const item of items.riterator()) {
   *   }
   * ```
   *
   * @returns the iterator
   */
  [Symbol.iterator](): Iterator<Item> {
    return this;
  }
}

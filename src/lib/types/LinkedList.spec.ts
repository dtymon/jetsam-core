import { LinkedList, DoublyLinkedList } from './LinkedList';

class Item {
  public constructor(public name: string) {}
}

describe('LinkedList Tests', function () {
  const one = new Item('one');
  const two = new Item('two');
  const three = new Item('three');
  const four = new Item('four');

  function validateEmpty(items: LinkedList<Item>) {
    expect(items.empty()).toEqual(true);
    expect(items.length()).toEqual(0);
    expect(items.first()).not.toBeDefined();
    expect(items.last()).not.toBeDefined();
  }

  function validateNotEmpty(items: LinkedList<Item>, length: number, first: Item, last: Item) {
    expect(items.empty()).toEqual(false);
    expect(items.length()).toEqual(length);
    expect(items.first()).toBe(first);
    expect(items.last()).toBe(last);
  }

  describe('Singly linked lists', function () {
    function validateIteration(items: LinkedList<Item>, expected: Item[]) {
      const found: Item[] = [];
      for (const item of items) {
        found.push(item);
      }
      expect(found).toEqual(expected);
    }

    it('can create an empty list', function () {
      const items = new LinkedList<Item>();

      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can create a list with an initial item', function () {
      const items = new LinkedList<Item>(one);

      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);
    });

    it('can create a list with initial items', function () {
      const items = new LinkedList<Item>(one, two, three);

      validateNotEmpty(items, 3, one, three);
      validateIteration(items, [one, two, three]);
    });

    it('can convert the list into an array', function () {
      const items = new LinkedList<Item>(one, two, three);
      const asArray = items.toArray();
      expect(asArray).toEqual([one, two, three]);
    });

    it('can convert the list into JSON', function () {
      const items = new LinkedList<Item>(one, two, three);
      const json = items.toJSON();
      expect(json).toEqual([one, two, three]);
    });

    it('can create return a string representation', function () {
      const items = new LinkedList<string>('one', 'two', 'three');
      const str = items.toString();

      expect(str).toEqual('one,two,three');
    });

    it('should return undefined when shifting from an empty list', function () {
      const items = new LinkedList<Item>();
      const item = items.shift();

      expect(item).not.toBeDefined();
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can push one item on and off a list', function () {
      const items = new LinkedList<Item>();

      items.push(one);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      const item = items.shift();
      expect(item).toBe(one);
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can push many items on and off a list', function () {
      const items = new LinkedList<Item>();

      items.push(one);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      items.push(two);
      validateNotEmpty(items, 2, one, two);
      validateIteration(items, [one, two]);

      items.push(three);
      validateNotEmpty(items, 3, one, three);
      validateIteration(items, [one, two, three]);

      let item = items.shift();
      expect(item).toBe(one);
      validateNotEmpty(items, 2, two, three);
      validateIteration(items, [two, three]);

      item = items.shift();
      expect(item).toBe(two);
      validateNotEmpty(items, 1, three, three);
      validateIteration(items, [three]);

      items.push(four);
      validateNotEmpty(items, 2, three, four);
      validateIteration(items, [three, four]);

      item = items.shift();
      expect(item).toBe(three);
      validateNotEmpty(items, 1, four, four);
      validateIteration(items, [four]);

      item = items.shift();
      expect(item).toBe(four);
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can unshift many items on to a list', function () {
      const items = new LinkedList<Item>();

      items.unshift(one);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      items.unshift(two);
      validateNotEmpty(items, 2, two, one);
      validateIteration(items, [two, one]);

      items.unshift(three);
      validateNotEmpty(items, 3, three, one);
      validateIteration(items, [three, two, one]);

      items.unshift(four);
      validateNotEmpty(items, 4, four, one);
      validateIteration(items, [four, three, two, one]);

      let item = items.shift();
      expect(item).toBe(four);
      validateNotEmpty(items, 3, three, one);
      validateIteration(items, [three, two, one]);

      item = items.shift();
      expect(item).toBe(three);
      validateNotEmpty(items, 2, two, one);
      validateIteration(items, [two, one]);

      item = items.shift();
      expect(item).toBe(two);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      item = items.shift();
      expect(item).toBe(one);
      validateEmpty(items);
      validateIteration(items, []);
    });
  });

  describe('Doubly linked lists', function () {
    function validateIteration(items: DoublyLinkedList<Item>, expected: Item[]) {
      const foundForward: Item[] = [];
      for (const item of items) {
        foundForward.push(item);
      }
      expect(foundForward).toEqual(expected);

      const foundReverse: Item[] = [];
      for (const item of items.riterator()) {
        foundReverse.push(item);
      }
      expect(foundReverse).toEqual(expected.reverse());
    }

    it('can create an empty list', function () {
      const items = new DoublyLinkedList<Item>();

      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can create a list with an initial item', function () {
      const items = new DoublyLinkedList<Item>(one);

      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);
    });

    it('can create a list with initial items', function () {
      const items = new DoublyLinkedList<Item>(one, two, three);

      validateNotEmpty(items, 3, one, three);
      validateIteration(items, [one, two, three]);
    });

    it('should return undefined when shifting from an empty list', function () {
      const items = new DoublyLinkedList<Item>();
      const item = items.shift();

      expect(item).not.toBeDefined();
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('should return undefined when popping from an empty list', function () {
      const items = new DoublyLinkedList<Item>();
      const item = items.pop();

      expect(item).not.toBeDefined();
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can push one item on and pop it off a list', function () {
      const items = new DoublyLinkedList<Item>();

      items.push(one);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      const item = items.pop();
      expect(item).toBe(one);
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can push one item on and shift it off a list', function () {
      const items = new DoublyLinkedList<Item>();

      items.push(one);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      const item = items.shift();
      expect(item).toBe(one);
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can push many items on to a list', function () {
      const items = new DoublyLinkedList<Item>();

      items.push(one);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      items.push(two);
      validateNotEmpty(items, 2, one, two);
      validateIteration(items, [one, two]);

      items.push(three);
      validateNotEmpty(items, 3, one, three);
      validateIteration(items, [one, two, three]);

      let item = items.shift();
      expect(item).toBe(one);
      validateNotEmpty(items, 2, two, three);
      validateIteration(items, [two, three]);

      item = items.shift();
      expect(item).toBe(two);
      validateNotEmpty(items, 1, three, three);
      validateIteration(items, [three]);

      items.push(four);
      validateNotEmpty(items, 2, three, four);
      validateIteration(items, [three, four]);

      item = items.shift();
      expect(item).toBe(three);
      validateNotEmpty(items, 1, four, four);
      validateIteration(items, [four]);

      item = items.shift();
      expect(item).toBe(four);
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can unshift many items on to a list', function () {
      const items = new DoublyLinkedList<Item>();

      items.unshift(one);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      items.unshift(two);
      validateNotEmpty(items, 2, two, one);
      validateIteration(items, [two, one]);

      items.unshift(three);
      validateNotEmpty(items, 3, three, one);
      validateIteration(items, [three, two, one]);

      items.unshift(four);
      validateNotEmpty(items, 4, four, one);
      validateIteration(items, [four, three, two, one]);

      let item = items.shift();
      expect(item).toBe(four);
      validateNotEmpty(items, 3, three, one);
      validateIteration(items, [three, two, one]);

      item = items.shift();
      expect(item).toBe(three);
      validateNotEmpty(items, 2, two, one);
      validateIteration(items, [two, one]);

      item = items.shift();
      expect(item).toBe(two);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      item = items.shift();
      expect(item).toBe(one);
      validateEmpty(items);
      validateIteration(items, []);
    });

    it('can mix pushing, popping, shifting and unshifting', function () {
      const items = new DoublyLinkedList<Item>();

      // Items: 1
      items.push(one);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      items.unshift(two);
      validateNotEmpty(items, 2, two, one);
      validateIteration(items, [two, one]);

      items.push(three);
      validateNotEmpty(items, 3, two, three);
      validateIteration(items, [two, one, three]);

      let item = items.pop();
      expect(item).toBe(three);
      validateNotEmpty(items, 2, two, one);
      validateIteration(items, [two, one]);

      items.unshift(four);
      validateNotEmpty(items, 3, four, one);
      validateIteration(items, [four, two, one]);

      items.push(three);
      validateNotEmpty(items, 4, four, three);
      validateIteration(items, [four, two, one, three]);

      item = items.shift();
      expect(item).toBe(four);
      validateNotEmpty(items, 3, two, three);
      validateIteration(items, [two, one, three]);

      item = items.shift();
      expect(item).toBe(two);
      validateNotEmpty(items, 2, one, three);
      validateIteration(items, [one, three]);

      item = items.pop();
      expect(item).toBe(three);
      validateNotEmpty(items, 1, one, one);
      validateIteration(items, [one]);

      item = items.pop();
      expect(item).toBe(one);
      validateEmpty(items);
      validateIteration(items, []);

      item = items.shift();
      expect(item).not.toBeDefined();
      validateEmpty(items);
      validateIteration(items, []);

      item = items.pop();
      expect(item).not.toBeDefined();
      validateEmpty(items);
      validateIteration(items, []);
    });
  });
});

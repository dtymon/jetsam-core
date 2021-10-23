import { SetPlus } from './SetPlus';

describe('SetPlus Tests', function () {
  const elements1 = ['black'];
  const elements2 = ['black', 'white'];
  const elements3 = ['red', 'green', 'blue'];
  const elements4 = ['black', 'white', 'grey', 'pink'];
  const elements5 = ['black', 'white', 'yellow', 'purple', 'blue'];

  const set0: SetPlus<string> = new SetPlus();
  const set1: SetPlus<string> = new SetPlus(elements1);
  const set2: SetPlus<string> = new SetPlus(elements2);
  const set3: SetPlus<string> = new SetPlus(elements3);
  const set4: SetPlus<string> = new SetPlus(elements4);
  const set5: SetPlus<string> = new SetPlus(elements5);

  function removeDuplicates<T>(elements: T[]): T[] {
    const asObject: Record<string, T> = {};
    elements.forEach((element) => (asObject['' + element] = element));
    return Object.values(asObject);
  }

  function validateElements<T>(actual: SetPlus<T>, expected: T[]) {
    const expectedNoDuplicates = removeDuplicates(expected);
    expect(expectedNoDuplicates.sort()).toEqual(actual.toArray().sort());
    expect(actual.empty()).toEqual(expectedNoDuplicates.length < 1);
  }

  describe('constructor', function () {
    it('can create the empty set', function () {
      const expected: string[] = [];
      validateElements(set0, expected);
    });

    it('can create a set with one element', function () {
      validateElements(set1, elements1);
    });

    it('can create a set with many elements', function () {
      validateElements(set3, elements3);
    });
  });

  describe('union', function () {
    it('can handle two empty sets', function () {
      const other: SetPlus<string> = new SetPlus();
      const result = set0.union(other);
      validateElements(result, []);
    });

    it('can handle empty left-hand set', function () {
      const result = set0.union(set3);
      validateElements(result, elements3);
    });

    it('can handle empty right-hand set', function () {
      const result = set3.union(set0);
      validateElements(result, elements3);
    });

    it('can handle union with itself', function () {
      const result = set3.union(set3);
      validateElements(result, elements3);
    });

    it('can handle union with sets with no intersection', function () {
      const result = set1.union(set3);
      validateElements(result, [...elements1, ...elements3]);
    });

    it('can handle union with sets with an intersection', function () {
      const result = set1.union(set2);
      validateElements(result, [...elements1, ...elements2]);
    });

    it('can compute union with multiple sets', function () {
      const result = set2.union(set1, set3);
      validateElements(result, [...elements1, ...elements2, ...elements3]);
    });

    it('can compute union with an Array', function () {
      const result = set1.union(elements3);
      validateElements(result, [...elements1, ...elements3]);
    });

    it('can compute union with different iterable types', function () {
      const result = set2.union(set1, elements3);
      validateElements(result, [...elements1, ...elements2, ...elements3]);
    });
  });

  describe('unionInPlace', function () {
    it('can handle two empty sets', function () {
      const other: SetPlus<string> = new SetPlus();
      const result: SetPlus<string> = new SetPlus();
      result.unionInPlace(other);
      validateElements(result, []);
    });

    it('can handle empty left-hand set', function () {
      const result: SetPlus<string> = new SetPlus(set0);
      result.unionInPlace(set3);
      validateElements(result, elements3);
    });

    it('can handle empty right-hand set', function () {
      const result: SetPlus<string> = new SetPlus(set3);
      result.unionInPlace(set0);
      validateElements(result, elements3);
    });

    it('can handle union with itself', function () {
      const result: SetPlus<string> = new SetPlus(set3);
      result.unionInPlace(result);
      validateElements(result, elements3);
    });

    it('can handle union with sets with no intersection', function () {
      const result: SetPlus<string> = new SetPlus(set1);
      result.unionInPlace(set3);
      validateElements(result, [...elements1, ...elements3]);
    });

    it('can handle union with sets with an intersection', function () {
      const result: SetPlus<string> = new SetPlus(set1);
      result.unionInPlace(set2);
      validateElements(result, [...elements1, ...elements2]);
    });

    it('can compute union with multiple sets', function () {
      const result: SetPlus<string> = new SetPlus(set2);
      result.unionInPlace(set1, set3);
      validateElements(result, [...elements1, ...elements2, ...elements3]);
    });

    it('can compute union with an Array', function () {
      const result: SetPlus<string> = new SetPlus(set1);
      result.unionInPlace(elements3);
      validateElements(result, [...elements1, ...elements3]);
    });

    it('can compute union with different iterable types', function () {
      const result: SetPlus<string> = new SetPlus(set2);
      result.unionInPlace(set1, elements3);
      validateElements(result, [...elements1, ...elements2, ...elements3]);
    });
  });

  describe('intersection', function () {
    it('can handle two empty sets', function () {
      const other: SetPlus<string> = new SetPlus();
      const result = set0.intersection(other);
      validateElements(result, []);
    });

    it('can handle empty left-hand set', function () {
      const result = set0.intersection(set3);
      validateElements(result, []);
    });

    it('can handle empty right-hand set', function () {
      const result = set3.intersection(set0);
      validateElements(result, []);
    });

    it('can handle intersection with itself', function () {
      const result = set3.intersection(set3);
      validateElements(result, elements3);
    });

    it('can handle intersection with sets with no intersection', function () {
      const result = set1.intersection(set3);
      validateElements(result, []);
    });

    it('can handle intersection with sets with an intersection', function () {
      const result = set1.intersection(set2);
      validateElements(result, ['black']);
    });

    it('can compute intersection with multiple sets', function () {
      const result = set2.intersection(set1, set4);
      validateElements(result, ['black']);
    });

    it('can compute intersection resulting in many elements', function () {
      const result = set5.intersection(set2, set4);
      validateElements(result, ['black', 'white']);
    });

    it('can compute intersection with an Array', function () {
      const result = set5.intersection(elements4);
      validateElements(result, ['black', 'white']);
    });

    it('can compute union with different iterable types', function () {
      const result = set5.intersection(elements4, set2, elements1, set1);
      validateElements(result, ['black']);
    });
  });

  describe('difference', function () {
    it('can handle two empty sets', function () {
      const other: SetPlus<string> = new SetPlus();
      const result = set0.difference(other);
      validateElements(result, []);
    });

    it('can handle empty left-hand set', function () {
      const result = set0.difference(set3);
      validateElements(result, []);
    });

    it('can handle empty right-hand set', function () {
      const result = set3.difference(set0);
      validateElements(result, elements3);
    });

    it('can handle difference with itself', function () {
      const result = set3.difference(set3);
      validateElements(result, []);
    });

    it('can handle two disjoint sets', function () {
      const result = set2.difference(set3);
      validateElements(result, elements2);
    });

    it('can handle two sets with intersection', function () {
      const result = set5.difference(set2);
      validateElements(result, ['yellow', 'purple', 'blue']);
    });

    it('can handle multiple right-hand sides', function () {
      const result = set5.difference(set2, elements3);
      validateElements(result, ['yellow', 'purple']);
    });
  });

  describe('xor', function () {
    it('can handle two empty sets', function () {
      const other: SetPlus<string> = new SetPlus();
      const result = set0.xor(other);
      validateElements(result, []);
    });

    it('can handle empty left-hand set', function () {
      const result = set0.xor(set3);
      validateElements(result, elements3);
    });

    it('can handle empty right-hand set', function () {
      const result = set3.xor(set0);
      validateElements(result, elements3);
    });

    it('can handle xor with itself', function () {
      const result = set3.xor(set3);
      validateElements(result, []);
    });

    it('can handle two disjoint sets', function () {
      const result = set2.xor(set3);
      validateElements(result, [...elements2, ...elements3]);
    });

    it('can handle two intersecting sets', function () {
      const result = set5.xor(set3);
      validateElements(result, ['red', 'green', 'black', 'white', 'yellow', 'purple']);
    });

    it('can handle multiple right-hand sides', function () {
      // The intersection for these sets is 'black' and 'white' and as such
      // should not appear in the result.
      const result = set5.xor(set4, elements2);
      validateElements(result, ['grey', 'pink', 'yellow', 'purple', 'blue']);
    });
  });

  describe('equals', function () {
    it('can handle two empty sets', function () {
      const other: SetPlus<string> = new SetPlus();
      expect(set0.equals(other)).toEqual(true);
    });

    it('can handle empty left-hand set', function () {
      expect(set0.equals(set3)).toEqual(false);
    });

    it('can handle empty right-hand set', function () {
      expect(set3.equals(set0)).toEqual(false);
    });

    it('can handle be compared with itself', function () {
      expect(set3.equals(set3)).toEqual(true);
    });

    it('can handle be compared with equivalent set', function () {
      const clone = set3.clone();
      expect(set3.equals(clone)).toEqual(true);
    });

    it('can handle be compared with differing set', function () {
      expect(set3.equals(set5)).toEqual(false);
    });

    it('can handle be compared with equivalent iterable', function () {
      expect(set3.equals(elements3)).toEqual(true);
    });

    it('can handle be compared with differing iterable', function () {
      expect(set3.equals(elements4)).toEqual(false);
    });
  });

  describe('map', function () {
    const transform = (element: string): string => element.toUpperCase();

    it('can handle empty set', function () {
      const expected: string[] = [];
      expect(set0.map(transform)).toEqual(expected);
    });

    it('can handle set with one element', function () {
      expect(set1.map(transform)).toEqual(elements1.map(transform));
    });

    it('can handle set with many elements', function () {
      expect(set5.map(transform)).toEqual(elements5.map(transform));
    });
  });

  describe('toArray', function () {
    it('can handle empty set', function () {
      const expected: string[] = [];
      expect(set0.toArray()).toEqual(expected);
    });

    it('can handle set with one element', function () {
      expect(set1.toArray().sort()).toEqual(elements1.slice().sort());
    });

    it('can handle set with many elements', function () {
      expect(set4.toArray().sort()).toEqual(elements4.slice().sort());
    });
  });

  describe('toString', function () {
    it('can handle empty set', function () {
      expect(set0.toString()).toEqual('{}');
    });

    it('can handle set with one element', function () {
      expect(set1.toString()).toEqual('{black}');
    });

    it('can handle set with many elements', function () {
      // Set order cannot be guaranteed so the order of elements in the output
      // can differ. Hence we need to something a little more complicated here
      // to have certainty.
      const setAsString = set4.toString();

      const regex = new RegExp('^{(\\w+(?:,\\w+){3})}$');
      const match = regex.exec(setAsString);
      expect(match).not.toBeNull();

      if (match !== null) {
        const words = match[1].split(',').sort();
        const expected: string[] = elements4.slice().sort();
        expect(words).toEqual(expected);
      }
    });
  });
});

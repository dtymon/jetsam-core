import { MapPlus, MapPlusFactory } from './MapPlus';
import { SetPlus } from './SetPlus';

interface Education {
  school: string;
  university?: string;
  [key: string]: any;
}

interface Person {
  email: string;
  name: string;
  age: number;
  alive: boolean;
  nationality: string;
  education: Education;
  hobbies: string[];
}

const person1: Person = {
  email: 'john.doe@gmail.com',
  name: 'John Doe',
  age: 58,
  alive: true,
  nationality: 'British',
  education: {
    school: 'Heartbreak High',
    university: 'Oxford University',
  },
  hobbies: ['running', 'swimming'],
};

const person2: Person = {
  email: 'mary.smith@hotmail.com',
  name: 'Mary Smith',
  age: 21,
  alive: true,
  nationality: 'British',
  education: {
    school: 'Taylor High',
    university: 'Cambridge University',
  },
  hobbies: ['rock climbing', 'sky diving', 'painting'],
};

const person3: Person = {
  email: 'jack.straw@icloud.com',
  name: 'Jack Straw',
  age: 98,
  alive: false,
  nationality: 'Spanish',
  education: {
    school: 'School of Hard Knocks',
    trade: 'Mechanic',
  },
  hobbies: ['marathons'],
};

const person4: Person = {
  email: 'sally.smith@icloud.com',
  name: 'Sally Smith',
  age: 8,
  alive: true,
  nationality: 'Australian',
  education: {
    school: 'Brighton Primary School',
  },
  hobbies: ['ballet', 'violin'],
};

const person5: Person = {
  email: 'betsy.johnson@gmail.com',
  name: 'Betsy Johnson',
  age: 83,
  alive: false,
  nationality: 'Australian',
  education: {
    school: 'Perth High School',
    university: 'Yale University',
  },
  hobbies: ['economics'],
};

const byAge = (a: Record<string, any>, b: Record<string, any>) => a.age - b.age;

function validateMap<K extends keyof any, V>(
  actual: MapPlus<K, V>,
  expected: Record<K, V>,
  compareFn?: (a: V, b: V) => number
) {
  const expectedKeyList = [];
  const expectedValueList = [];
  for (const key in expected) {
    expectedKeyList.push(key);
    expectedValueList.push(expected[key]);

    expect(actual.has(key)).toBe(true);
    expect(actual.get(key)).toEqual(expected[key]);
  }

  expect(actual.empty()).toEqual(expectedKeyList.length < 1);
  expect(actual.size).toEqual(expectedKeyList.length);
  expect(actual.keyList().sort()).toEqual(expectedKeyList.sort());
  expect(actual.keySet().equals(expectedKeyList)).toBe(true);
  expect(actual.valueList().sort(compareFn)).toEqual(expectedValueList.sort(compareFn));
}

describe('MapPlus Tests', function () {
  describe('mapKeys', function () {
    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.mapKeys((key) => key.toUpperCase());

      expect(result).toEqual([]);
    });

    it('can handle a map with one item', function () {
      const people: Person[] = [person1];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.mapKeys((key) => key.toUpperCase());

      expect(result).toEqual([person1.email.toUpperCase()]);
    });

    it('can handle an array with many items', function () {
      const people: Person[] = [person1, person2, person3];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.mapKeys((key) => key.toUpperCase());

      expect(result).toEqual([person1.email.toUpperCase(), person2.email.toUpperCase(), person3.email.toUpperCase()]);
    });
  });

  describe('mapValues', function () {
    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.mapValues((person) => person.name.toUpperCase());

      expect(result).toEqual([]);
    });

    it('can handle a map with one item', function () {
      const people: Person[] = [person1];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.mapValues((person) => person.name.toUpperCase());

      expect(result).toEqual([person1.name.toUpperCase()]);
    });

    it('can handle an array with many items', function () {
      const people: Person[] = [person1, person2, person3];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.mapValues((person) => person.name.toUpperCase());

      expect(result).toEqual([person1.name.toUpperCase(), person2.name.toUpperCase(), person3.name.toUpperCase()]);
    });
  });

  describe('subset', function () {
    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.subset([person1.email, person3.email]);

      validateMap(result, {}, byAge);
    });

    it('can handle a map with one item and overlap', function () {
      const people: Person[] = [person1];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.subset([person1.email, person3.email]);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
      };
      validateMap(result, expected, byAge);
    });

    it('can handle a map with one item and no overlap', function () {
      const people: Person[] = [person1];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.subset([person2.email]);

      validateMap(result, {}, byAge);
    });

    it('can handle an array with many items and overlap', function () {
      const people: Person[] = [person1, person2, person4];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.subset([person1.email, person3.email]);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
      };
      validateMap(result, expected, byAge);
    });

    it('can handle an array with many items and no overlap', function () {
      const people: Person[] = [person1, person2];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.subset([person3.email]);

      validateMap(result, {}, byAge);
    });
  });

  describe('merge', function () {
    it('can handle two empty maps', function () {
      const people: Person[] = [];
      const byEmail1 = MapPlusFactory.fromArray(people, 'email');
      const byEmail2 = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail1.merge(byEmail2);

      validateMap(result, {}, byAge);
    });

    it('can handle empty left-hand side', function () {
      const people1: Person[] = [];
      const people2: Person[] = [person1, person4];
      const byEmail1 = MapPlusFactory.fromArray(people1, 'email');
      const byEmail2 = MapPlusFactory.fromArray(people2, 'email');
      const result = byEmail1.merge(byEmail2);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
        [person4.email]: person4,
      };
      validateMap(result, expected, byAge);
    });

    it('can handle empty right-hand side', function () {
      const people1: Person[] = [person2, person3];
      const people2: Person[] = [];
      const byEmail1 = MapPlusFactory.fromArray(people1, 'email');
      const byEmail2 = MapPlusFactory.fromArray(people2, 'email');
      const result = byEmail1.merge(byEmail2);

      const expected: Record<string, Person> = {
        [person2.email]: person2,
        [person3.email]: person3,
      };
      validateMap(result, expected, byAge);
    });

    it('can handle both sides populated', function () {
      const people1: Person[] = [person2, person3];
      const people2: Person[] = [person4];
      const byEmail1 = MapPlusFactory.fromArray(people1, 'email');
      const byEmail2 = MapPlusFactory.fromArray(people2, 'email');
      const result = byEmail1.merge(byEmail2);

      const expected: Record<string, Person> = {
        [person2.email]: person2,
        [person3.email]: person3,
        [person4.email]: person4,
      };
      validateMap(result, expected, byAge);
    });
  });

  describe('eject', function () {
    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.eject(person1.email);

      validateMap(byEmail, {}, byAge);
      expect(result).not.toBeDefined();
    });

    it('can handle a map with one item and overlap', function () {
      const people: Person[] = [person1];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.eject(person1.email);

      validateMap(byEmail, {}, byAge);
      expect(result).toBe(person1);
    });

    it('can handle a map with one item and no overlap', function () {
      const people: Person[] = [person2];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.eject(person1.email);

      const expected: Record<string, Person> = {
        [person2.email]: person2,
      };
      validateMap(byEmail, expected, byAge);
      expect(result).not.toBeDefined();
    });

    it('can handle an array with many items and overlap', function () {
      const people: Person[] = [person1, person2, person4];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.eject(person2.email);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
        [person4.email]: person4,
      };
      validateMap(byEmail, expected, byAge);
      expect(result).toBe(person2);
    });

    it('can handle an array with many items and no overlap', function () {
      const people: Person[] = [person1, person2, person4];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.eject(person3.email);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
        [person2.email]: person2,
        [person4.email]: person4,
      };
      validateMap(byEmail, expected, byAge);
      expect(result).not.toBeDefined();
    });
  });

  describe('keyFilter', function () {
    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const wanted: SetPlus<string> = new SetPlus([person2.email, person4.email]);
      const result = byEmail.keyFilter((key) => wanted.has(key));

      validateMap(result, {}, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle a map with one item and overlap', function () {
      const people: Person[] = [person2];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const wanted: SetPlus<string> = new SetPlus([person2.email, person4.email]);
      const result = byEmail.keyFilter((key) => wanted.has(key));

      const expected: Record<string, Person> = {
        [person2.email]: person2,
      };
      validateMap(result, expected, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle a map with one item and no overlap', function () {
      const people: Person[] = [person3];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const wanted: SetPlus<string> = new SetPlus([person2.email, person4.email]);
      const result = byEmail.keyFilter((key) => wanted.has(key));

      validateMap(result, {}, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle an array with many items and overlap', function () {
      const people: Person[] = [person1, person2, person4];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const wanted: SetPlus<string> = new SetPlus([person2.email, person4.email]);
      const result = byEmail.keyFilter((key) => wanted.has(key));

      const expected: Record<string, Person> = {
        [person2.email]: person2,
        [person4.email]: person4,
      };
      validateMap(result, expected, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle an array with many items and no overlap', function () {
      const people: Person[] = [person1, person2, person4];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const wanted: SetPlus<string> = new SetPlus([person3.email]);
      const result = byEmail.keyFilter((key) => wanted.has(key));

      validateMap(result, {}, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });
  });

  describe('valueFilter', function () {
    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.valueFilter((person) => person.alive);

      validateMap(result, {}, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle a map with one item and overlap', function () {
      const people: Person[] = [person2];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.valueFilter((person) => person.alive);

      const expected: Record<string, Person> = {
        [person2.email]: person2,
      };
      validateMap(result, expected, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle a map with one item and no overlap', function () {
      const people: Person[] = [person3];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.valueFilter((person) => person.alive);

      validateMap(result, {}, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle an array with many items and overlap', function () {
      const people: Person[] = [person1, person3, person4];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.valueFilter((person) => person.alive);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
        [person4.email]: person4,
      };
      validateMap(result, expected, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle an array with many items and no overlap', function () {
      const people: Person[] = [person3, person5];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const result = byEmail.valueFilter((person) => person.alive);

      validateMap(result, {}, byAge);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });
  });

  describe('addIfAbsent', function () {
    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      byEmail.addIfAbsent(person1.email, person1);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
      };
      validateMap(byEmail, expected, byAge);
    });

    it('can handle item being present', function () {
      const people: Person[] = [person1, person3, person5];
      const byEmail = MapPlusFactory.fromArray(people, 'email');

      // Deliberately try to change the key to refer to a different person
      byEmail.addIfAbsent(person1.email, person4);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
        [person3.email]: person3,
        [person5.email]: person5,
      };
      validateMap(byEmail, expected, byAge);
    });

    it('can handle item not being present', function () {
      const people: Person[] = [person1, person3, person5];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      byEmail.addIfAbsent(person4.email, person4);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
        [person3.email]: person3,
        [person4.email]: person4,
        [person5.email]: person5,
      };
      validateMap(byEmail, expected, byAge);
    });
  });

  describe('groupBy', function () {
    it('can handle values that are not objects', function () {
      const nameToAge: MapPlus<string, number> = new MapPlus();
      nameToAge.set('bill', 23);
      nameToAge.set('sarah', 18);
      nameToAge.set('june', 61);
      const byNationality = nameToAge.groupBy('nationality');

      validateMap(byNationality, {});
    });

    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const byNationality = byEmail.groupBy('nationality');

      validateMap(byNationality, {});
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });

    it('can handle a populated map', function () {
      const people: Person[] = [person1, person2, person3, person4, person5];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const byNationality = byEmail.groupBy('nationality');

      const expected: Record<string, Person[]> = {
        British: [person1, person2],
        Spanish: [person3],
        Australian: [person4, person5],
      };
      validateMap(byNationality, expected);
      validateMap(byEmail, MapPlusFactory.fromArray(people, 'email').toObject(), byAge);
    });
  });

  describe('toPartialObject', function () {
    it('can handle an empty map', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const details = byEmail.toPartialObject(['email', 'name']);

      expect(details).toEqual({});
    });

    it('can handle a map with one item and overlap', function () {
      const people: Person[] = [person1];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const details = byEmail.toPartialObject([person1.email]);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
      };
      expect(details).toEqual(expected);
    });

    it('can handle a map with one item and no overlap', function () {
      const people: Person[] = [person2];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const details = byEmail.toPartialObject([person1.email]);

      expect(details).toEqual({});
    });

    it('can handle a map with many items and overlap', function () {
      const people: Person[] = [person1, person2, person5];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const details = byEmail.toPartialObject([person1.email, person4.email, person5.email]);

      const expected: Record<string, Person> = {
        [person1.email]: person1,
        [person5.email]: person5,
      };
      expect(details).toEqual(expected);
    });

    it('can handle a map with many items and no overlap', function () {
      const people: Person[] = [person1, person2, person5];
      const byEmail = MapPlusFactory.fromArray(people, 'email');
      const details = byEmail.toPartialObject([person3.email, person4.email]);

      expect(details).toEqual({});
    });
  });

  describe('equals', function () {
    it('can handle two empty maps', function () {
      const people: Person[] = [];
      const byEmail1 = MapPlusFactory.fromArray(people, 'email');
      const byEmail2 = MapPlusFactory.fromArray(people, 'email');

      expect(byEmail1.equals(byEmail2)).toBe(true);
    });

    it('can handle empty operand', function () {
      const people1: Person[] = [];
      const people2: Person[] = [person3, person2, person5];
      const byEmail1 = MapPlusFactory.fromArray(people1, 'email');
      const byEmail2 = MapPlusFactory.fromArray(people2, 'email');

      expect(byEmail1.equals(byEmail2)).toBe(false);
      expect(byEmail2.equals(byEmail1)).toBe(false);
    });

    it('can handle equivalent instances', function () {
      const people1: Person[] = [person3, person2, person5];
      const people2: Person[] = [person5, person3, person2];
      const byEmail1 = MapPlusFactory.fromArray(people1, 'email');
      const byEmail2 = MapPlusFactory.fromArray(people2, 'email');

      expect(byEmail1.equals(byEmail2)).toBe(true);
      expect(byEmail2.equals(byEmail1)).toBe(true);
    });

    it('can handle instances with different keys', function () {
      const people1: Person[] = [person3, person2, person5, person4];
      const people2: Person[] = [person5, person3, person2];
      const byEmail1 = MapPlusFactory.fromArray(people1, 'email');
      const byEmail2 = MapPlusFactory.fromArray(people2, 'email');

      expect(byEmail1.equals(byEmail2)).toBe(false);
      expect(byEmail2.equals(byEmail1)).toBe(false);
    });

    it('can handle instances with same keys but different values', function () {
      const byEmail1: MapPlus<string, Person> = new MapPlus();
      byEmail1.set(person1.email, person1);
      byEmail1.set(person2.email, person2);
      byEmail1.set(person3.email, person3);

      const byEmail2: MapPlus<string, Person> = new MapPlus();
      byEmail2.set(person1.email, person1);
      byEmail2.set(person2.email, person5); // Deliberate point to wrong person
      byEmail2.set(person3.email, person3);

      expect(byEmail1.equals(byEmail2)).toBe(false);
      expect(byEmail2.equals(byEmail1)).toBe(false);
    });
  });
});

describe('MapPlusFactory Tests', function () {
  function validateMap<K extends keyof any, V>(
    actual: MapPlus<K, V>,
    expected: Record<K, V>,
    compareFn?: (a: V, b: V) => number
  ) {
    const expectedKeyList = [];
    const expectedValueList = [];
    for (const key in expected) {
      expectedKeyList.push(key);
      expectedValueList.push(expected[key]);

      expect(actual.has(key)).toBe(true);
      expect(actual.get(key)).toEqual(expected[key]);
    }

    expect(actual.empty()).toEqual(expectedKeyList.length < 1);
    expect(actual.size).toEqual(expectedKeyList.length);
    expect(actual.keyList().sort()).toEqual(expectedKeyList.sort());
    expect(actual.keySet().equals(expectedKeyList)).toBe(true);
    expect(actual.valueList().sort(compareFn)).toEqual(expectedValueList.sort(compareFn));
  }

  describe('fromObject', function () {
    it('can handle an empty object', function () {
      const obj: Record<string, any> = {};
      const map = MapPlusFactory.fromObject(obj);

      validateMap(map, obj);
    });

    it('can handle an object with one field', function () {
      const obj: Record<string, any> = {
        foo: 'bar',
      };
      const map = MapPlusFactory.fromObject(obj);

      validateMap(map, obj);
    });

    it('can handle an object with many fields', function () {
      const map = MapPlusFactory.fromObject(person1);

      validateMap(map, person1);
    });
  });

  describe('fromArray', function () {
    it('can handle an empty array', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArray(people, 'email');

      validateMap(byEmail, {});
    });

    it('can handle an array with one item', function () {
      const people: Person[] = [person1];
      const byEmail = MapPlusFactory.fromArray(people, 'email');

      const expected: Record<string, Person> = {
        [person1.email]: person1,
      };
      validateMap(byEmail, expected, byAge);
    });

    it('can handle an array with many items', function () {
      const people: Person[] = [person1, person2, person3];
      const byEmail = MapPlusFactory.fromArray(people, 'email');

      const expected: Record<string, Person> = {
        [person1.email]: person1,
        [person2.email]: person2,
        [person3.email]: person3,
      };
      validateMap(byEmail, expected, byAge);
    });
  });

  describe('fromArrayRemovingKey', function () {
    it('can handle an empty array', function () {
      const people: Person[] = [];
      const byEmail = MapPlusFactory.fromArrayRemovingKey(people, 'email');

      validateMap(byEmail, {});
    });

    it('can handle an array with one item', function () {
      const people: Person[] = [{ ...person1 }];
      const byEmail = MapPlusFactory.fromArrayRemovingKey(people, 'email');

      const person1NoEmail: Omit<Person, 'email'> = { ...person1 } as any;
      delete (person1NoEmail as any).email;

      const expected: Record<string, Omit<Person, 'email'>> = {
        [person1.email]: person1NoEmail,
      };
      validateMap(byEmail, expected);
    });

    it('can handle an array with many items', function () {
      const people: Person[] = [{ ...person1 }, { ...person2 }, { ...person3 }];
      const byEmail = MapPlusFactory.fromArrayRemovingKey(people, 'email');

      const person1NoEmail: Omit<Person, 'email'> = { ...person1 } as any;
      const person2NoEmail: Omit<Person, 'email'> = { ...person2 } as any;
      const person3NoEmail: Omit<Person, 'email'> = { ...person3 } as any;
      delete (person1NoEmail as any).email;
      delete (person2NoEmail as any).email;
      delete (person3NoEmail as any).email;

      const expected: Record<string, Omit<Person, 'email'>> = {
        [person1.email]: person1NoEmail,
        [person2.email]: person2NoEmail,
        [person3.email]: person3NoEmail,
      };
      validateMap(byEmail, expected);
    });
  });

  describe('fromTuples', function () {
    it('can handle an empty array', function () {
      const people: Person[] = [];
      const byName = MapPlusFactory.fromTuples(people, 'name', 'age');

      validateMap(byName, {});
    });

    it('can handle an array with one item', function () {
      const people: Person[] = [person1];
      const byName = MapPlusFactory.fromTuples(people, 'name', 'age');

      const expected: Record<string, number> = {
        [person1.name]: person1.age,
      };
      validateMap(byName, expected);
    });

    it('can handle an array with many items', function () {
      const people: Person[] = [person1, person4, person3];
      const byName = MapPlusFactory.fromTuples(people, 'name', 'age');

      const expected: Record<string, number> = {
        [person1.name]: person1.age,
        [person4.name]: person4.age,
        [person3.name]: person3.age,
      };
      validateMap(byName, expected);
    });
  });

  describe('groupBy', function () {
    it('can handle an empty array', function () {
      const people: Person[] = [];
      const byNationality = MapPlusFactory.groupBy(people, 'nationality');

      validateMap(byNationality, {});
    });

    it('can handle an array with one item', function () {
      const people: Person[] = [person2];
      const byNationality = MapPlusFactory.groupBy(people, 'nationality');

      const expected: Record<string, Person[]> = {
        British: [person2],
      };
      validateMap(byNationality, expected);
    });

    it('can handle an array with many items', function () {
      const people: Person[] = [person1, person2, person3, person4, person5];
      const byNationality = MapPlusFactory.groupBy(people, 'nationality');

      const expected: Record<string, Person[]> = {
        British: [person1, person2],
        Spanish: [person3],
        Australian: [person4, person5],
      };
      validateMap(byNationality, expected);
    });
  });

  describe('groupPropertyBy', function () {
    it('can handle an empty array', function () {
      const people: Person[] = [];
      const byNationality = MapPlusFactory.groupPropertyBy(people, 'nationality', 'email');

      validateMap(byNationality, {});
    });

    it('can handle an array with one item', function () {
      const people: Person[] = [person5];
      const byNationality = MapPlusFactory.groupPropertyBy(people, 'nationality', 'email');

      const expected: Record<string, string[]> = {
        Australian: [person5.email],
      };
      validateMap(byNationality, expected);
    });

    it('can handle an array with many items', function () {
      const people: Person[] = [person1, person2, person3, person4, person5];
      const byNationality = MapPlusFactory.groupPropertyBy(people, 'nationality', 'email');

      const expected: Record<string, string[]> = {
        British: [person1.email, person2.email],
        Spanish: [person3.email],
        Australian: [person4.email, person5.email],
      };
      validateMap(byNationality, expected);
    });
  });
});

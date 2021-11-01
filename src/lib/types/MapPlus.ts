import { isEqual } from '@jetsam/third-party/lodash';

import { SetPlus } from './SetPlus';

/**
 * An extension to the standard Map class
 *
 * @typeParam K - the type of element used as the key in the map
 * @typeParam V - the type of element used as the value in the map
 */
export class MapPlus<K, V> extends Map<K, V> {
  /**
   * Determine if the map is empty
   *
   * @returns true if the map is empty
   */
  public empty(): boolean {
    return this.size < 1;
  }

  /**
   * Get the keys of the map as a set
   *
   * @typeParam K - the type of element used as the key in the map
   * @returns the keys of the map as a set
   */
  public keySet(): SetPlus<K> {
    return new SetPlus(this.keys());
  }

  /**
   * Get the keys of the map as an array
   *
   * @typeParam K - the type of element used as the key in the map
   * @returns the keys of the map as an array
   */
  public keyList(): K[] {
    return Array.from(this.keys());
  }

  /**
   * Get the values of the map as an array
   *
   * @typeParam V - the type of element used as the value in the map
   * @returns the values of the map as an array
   */
  public valueList(): V[] {
    return Array.from(this.values());
  }

  /**
   * Called to invoke a given function for each key in the map
   *
   * @typeParam K - the type of element used as the key in the map
   * @param body - the function to invoke
   * @returns the array containing the results of each function invocation
   */
  public mapKeys<FuncType extends (element: K) => any>(body: FuncType): ReturnType<FuncType>[] {
    return this.keyList().map(body);
  }

  /**
   * Called to invoke a given function for each value in the map
   *
   * @typeParam V - the type of element used as the value in the map
   * @param body - the function to invoke
   * @returns the array containing the results of each function invocation
   */
  public mapValues<FuncType extends (element: V) => any>(body: FuncType): ReturnType<FuncType>[] {
    return this.valueList().map(body);
  }

  /**
   * Create a subset of the map that only contains the elements whose key is in
   * the given collection.
   *
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   */
  public subset(keys: Iterable<K>): MapPlus<K, V> {
    const result: MapPlus<K, V> = new MapPlus();
    for (const key of keys) {
      const value = this.get(key);
      value !== undefined && result.set(key, value);
    }
    return result;
  }

  /**
   * Merge the contents of another map into this instance. For keys existing in
   * both instances, the value in this instance will not be overwritten unless
   * explicitly requested.
   *
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @param other - the other map instance
   * @param overwrite - whether to overwrite values in this instance
   * @returns this instance for chaining
   */
  public merge(other: Map<K, V>, overwrite = false): this {
    for (const [key, value] of other) {
      (overwrite || !this.has(key)) && this.set(key, value);
    }
    return this;
  }

  /**
   * Eject a key from the map and return its value if it was present
   *
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @param key - the key to eject
   * @returns the value of the key if it was present or undefined
   */
  public eject(key: K): V | undefined {
    const value = this.get(key);
    this.delete(key);
    return value;
  }

  /**
   * Create a map containing only those values whose key passes the given filter
   *
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @param filter - a function returning a truthy value for any key that passes
   * the filter
   */
  public keyFilter(filter: (key: K) => any): MapPlus<K, V> {
    const result: MapPlus<K, V> = new MapPlus();
    for (const [key, value] of this) {
      filter(key) && result.set(key, value);
    }
    return result;
  }

  /**
   * Create a map containing only those values whose value passes the given
   * filter.
   *
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @param filter - a function returning a truthy value for any value that
   * passes the filter
   */
  public valueFilter(filter: (value: V) => any): MapPlus<K, V> {
    const result: MapPlus<K, V> = new MapPlus();
    for (const [key, value] of this) {
      filter(value) && result.set(key, value);
    }
    return result;
  }

  /**
   * Given a key and a value, insert an entry into the map if the key is not
   * currently present. Returns either the existing value or the value just
   * inserted.
   *
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @param key - the key to check
   * @param value - the value to add if the key is not present
   * @returns the existing value if the key was present or the newly added value
   * if it was absent
   */
  public addIfAbsent(key: K, value: V): V {
    const existing = this.get(key);
    if (existing !== undefined) {
      return existing;
    }

    this.set(key, value);
    return value;
  }

  /**
   * Called to create a map that has the elements grouped by the value of a
   * given property. For example, given a map that keys products on their
   * product code and each product has a `colour` property, the products can be
   * grouped by their colour as follows:
   *
   * ```ts
   * const products: MapPlus<ProductCode, Product> = new MapPlus();
   * ...
   * const productsByColour: MapPlus<string, Product[]> =
   * products.groupBy('colour');
   * ```
   *
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @param property - the name of the property to group by
   * @returns a new map containing a key for each value of the property found
   * and the list of elements that have that property value
   */
  public groupBy(property: string): MapPlus<K, V[]> {
    const result: MapPlus<K, V[]> = new MapPlus();
    this.forEach((element) => {
      // Ignore elements that are not objects
      if (typeof element === 'object') {
        // Get the property value for this element and add the element to the
        // list of other elements with the same value.
        const propertyValue = (element as any)[property];
        result.addIfAbsent(propertyValue, []).push(element);
      }
    });
    return result;
  }

  /**
   * Convert the map into an object
   *
   * @typeParam ObjectKeyType - the type of keys to use in the resulting object
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @returns an equivalent object
   */
  public toObject<ObjectKeyType extends keyof any>(): Record<ObjectKeyType, V> {
    const obj = {} as Record<ObjectKeyType, V>;
    for (const [key, value] of this) {
      obj[key as any as ObjectKeyType] = value;
    }
    return obj;
  }

  /**
   * Convert the map into an object whose keys are restricted to the given
   * collection.
   *
   * @typeParam ObjectKeyType - the type of keys to use in the resulting object
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @param keys - the collection of keys required in the object
   * @returns the object containing the values for the given keys
   */
  public toPartialObject<ObjectKeyType extends keyof any>(keys: Iterable<K>): Record<ObjectKeyType, V> {
    const obj = {} as Record<ObjectKeyType, V>;
    for (const key of keys) {
      const value = this.get(key);
      if (value !== undefined) {
        obj[key as any as ObjectKeyType] = value;
      }
    }
    return obj;
  }

  /**
   * Determine if this instances equals another instance, both keys and values.
   *
   * @typeParam K - the type of element used as the key in the map
   * @typeParam V - the type of element used as the value in the map
   * @param other - the other instance
   * @returns true if the two instances are equal
   */
  public equals(other: Map<K, V>): boolean {
    // First make sure they have the same set of keys
    if (!this.keySet().equals(other.keys())) {
      return false;
    }

    // Make sure all of the values are equal
    for (const [key, value] of this) {
      if (!isEqual(value, other.get(key))) {
        return false;
      }
    }

    return true;
  }
}

/**
 * A factory for creating `MaPlus` instances
 */
export class MapPlusFactory {
  /**
   * Create an instance given an object
   *
   * @typeParam ItemType - the object type
   * @param obj - the object to convert to a map
   * @returns an map instance equivalent to the given object
   */
  public static fromObject<K extends keyof any, V>(obj: Record<K, V>): MapPlus<K, V> {
    const result: MapPlus<K, V> = new MapPlus();
    for (const key in obj) {
      result.set(key, obj[key]);
    }
    return result;
  }

  /**
   * Create an instance for an array of items, specifying the property of the
   * items to use as the key. The given key property is expected to be unique
   * across the items.
   *
   * @typeParam ItemType - the type of items stored in the array
   * @typeParam Property - the property in the values to use as the key
   * @param items - the items to insert into the map
   * @param property - the name of the property to use as the key
   * @returns a map instance containing the items keyed on the specified
   * property
   */
  public static fromArray<ItemType extends Record<string, any>, Property extends keyof ItemType>(
    items: ItemType[],
    property: Property
  ): MapPlus<ItemType[Property], ItemType> {
    const result: MapPlus<ItemType[Property], ItemType> = new MapPlus();
    for (const item of items) {
      result.set(item[property], item);
    }
    return result;
  }

  /**
   * Create an instance for an array of items, specifying the property of the
   * items to use as the key. The specified key property is removed from the
   * items as they are inserted into the map
   *
   * @typeParam ItemType - the type of items stored in the array
   * @typeParam Property - the property in the values to use as the key
   * @param items - the items to insert into the map
   * @param property - the name of the property to use as the key
   * @returns a map instance containing the items keyed on the specified
   * property with the property removed from the items
   */
  public static fromArrayRemovingKey<ItemType extends Record<string, any>, Property extends keyof ItemType>(
    items: ItemType[],
    property: Property
  ): MapPlus<ItemType[Property], Omit<ItemType, Property>> {
    const result: MapPlus<ItemType[Property], Omit<ItemType, Property>> = new MapPlus();
    for (const item of items) {
      result.set(item[property], item);
      delete item[property];
    }
    return result;
  }

  /**
   * Given an array of tuples, where a tuple is stored as an object with two
   * properties, convert the tuples into a map by specifying the name of the key
   * and value propertys.
   *
   * @typeParam TupleType - the type of tuples stored in the array
   * @typeParam KeyProperty - the key property of the tuple
   * @typeParam ValueProperty - the key value of the tuple
   * @param tuples - the tuples to insert into the map
   * @param keyProperty - the name of the property to use as the key
   * @param valueProperty - the name of the property to use as the value
   * @returns a map instance containing the tuples keyed on the specified
   * property
   */
  public static fromTuples<
    TupleType extends Record<string, any>,
    KeyProperty extends keyof TupleType,
    ValueProperty extends keyof TupleType
  >(
    tuples: TupleType[],
    keyProperty: KeyProperty,
    valueProperty: ValueProperty
  ): MapPlus<TupleType[KeyProperty], TupleType[ValueProperty]> {
    const result: MapPlus<TupleType[KeyProperty], TupleType[ValueProperty]> = new MapPlus();
    for (const item of tuples) {
      result.set(item[keyProperty], item[valueProperty]);
    }
    return result;
  }

  /**
   * Given an array of items and function that can generate a key for the items,
   * create an instance containing a key for each value returned by the
   * function, with each key containing the list of items that share that value.
   *
   * @typeParam ItemType - the type of items stored in the array
   * @typeParam KeyGenerator - the type of function generating the keys
   * @param items - the items to insert into the map
   * @param generator - the key generator function
   * @returns a map instance containing the items grouped by the values of the
   * generated keys
   */
  public static groupByFunction<ItemType extends Record<string, any>, KeyGenerator extends (item: ItemType) => any>(
    items: ItemType[],
    generator: KeyGenerator
  ): MapPlus<ReturnType<KeyGenerator>, ItemType[]> {
    const result: MapPlus<ReturnType<KeyGenerator>, ItemType[]> = new MapPlus();
    for (const item of items) {
      const key = generator(item);
      const group = result.get(key);
      if (group === undefined) {
        result.set(key, [item]);
      } else {
        group.push(item);
      }
    }
    return result;
  }

  /**
   * Given an array of items and the name of a property, create an instance
   * containing a key for each value of the specified property, with each key
   * containing the list of items that share that value.
   *
   * @typeParam ItemType - the type of items stored in the array
   * @typeParam Property - the property in the values to use as the key
   * @param items - the items to insert into the map
   * @param property - the name of the property to use as the key
   * @returns a map instance containing the items grouped by the values of the
   * specified key
   */
  public static groupBy<ItemType extends Record<string, any>, Property extends keyof ItemType>(
    items: ItemType[],
    property: Property
  ): MapPlus<ItemType[Property], ItemType[]> {
    return this.groupByFunction(items, (item: ItemType) => item[property]);
  }

  /**
   * Given an array of items and function that can generate a key for the items,
   * create an instance containing a key for each value returned by the
   * function. Rather than grouping the entire item like {@link
   * groupByFunction}, the right-side of the map is a list of values for a given
   * property.
   *
   * @example
   * Given an array of cars of the form:
   * ```ts
   * const cars: Car[] = [
   *   {
   *     "registration": "ABC-123",
   *     "manufacturer": "Ford",
   *     "model": "Mustang",
   *     "colour": "Red"
   *   }
   * ]
   * ```
   * To group car registration numbers by their colour:
   * ```ts
   * const registrationByColour = MapPlus.groupPropertyByFunction(
   *   cars,
   *   (car: Car) => car.colour,
   *   'registration'
   * );
   * ```
   *
   * @typeParam ItemType - the type of items stored in the array
   * @typeParam KeyGenerator - the type of function generating the keys
   * @typeParam Property - the property in the values to include in the result
   * @param items - the items to insert into the map
   * @param generator - the key generator function
   * @param property - the property to include in the result
   * @returns a map instance containing the properties grouped by the values of
   * the generated keys
   */
  public static groupPropertyByFunction<
    ItemType extends Record<string, any>,
    KeyGenerator extends (item: ItemType) => any,
    Property extends keyof ItemType
  >(
    items: ItemType[],
    generator: KeyGenerator,
    property: Property
  ): MapPlus<ReturnType<KeyGenerator>, ItemType[Property][]> {
    const result: MapPlus<ReturnType<KeyGenerator>, ItemType[Property][]> = new MapPlus();
    for (const item of items) {
      const key = generator(item);
      const group = result.get(key);
      if (group === undefined) {
        result.set(key, [item[property]]);
      } else {
        group.push(item[property]);
      }
    }
    return result;
  }

  /**
   * As for {@link groupPropertyByFunction} except, rather than taking a key
   * generator function, this method takes the name of a key property.
   *
   * @example
   * Given an array of cars of the form:
   * ```ts
   * const cars: Car[] = [
   *   {
   *     "registration": "ABC-123",
   *     "manufacturer": "Ford",
   *     "model": "Mustang",
   *     "colour": "Red"
   *   }
   * ]
   * ```
   * To group car registration numbers by their colour:
   * ```ts
   * const registrationByColour = MapPlus.groupPropertyBy(
   *   cars,
   *   'colour',
   *   'registration'
   * );
   * ```
   *
   * @typeParam ItemType - the type of items stored in the array
   * @typeParam KeyProperty - property in the values to use as the key
   * @typeParam ValueProperty - property in the values to include in the result
   * @param items - the items to insert into the map
   * @param keyProperty - the property to use as the key
   * @param valueProperty - the property to include in the result
   * @returns a map instance containing the properties grouped by the values of
   * the keys
   */
  public static groupPropertyBy<
    ItemType extends Record<string, any>,
    KeyProperty extends keyof ItemType,
    ValueProperty extends keyof ItemType
  >(
    items: ItemType[],
    keyProperty: KeyProperty,
    valueProperty: ValueProperty
  ): MapPlus<ItemType[KeyProperty], ItemType[ValueProperty][]> {
    return this.groupPropertyByFunction(items, (item: ItemType) => item[keyProperty], valueProperty);
  }
}

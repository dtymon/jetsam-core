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

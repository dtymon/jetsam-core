/**
 * An extension to the standard Set class that provides fundamental set
 * operations.
 *
 * @typeParam T - the type of element stored in the set
 */
export class SetPlus<T> extends Set<T> {
  /**
   * Determine if this is the empty set
   *
   * @returns true if the set is empty
   */
  public empty(): boolean {
    return this.size < 1;
  }

  /**
   * Create a shallow clone of this set
   *
   * @typeParam T - the type of element stored in the set
   * @returns a new set containing the same elements as this instance
   */
  public clone(): SetPlus<T> {
    return new SetPlus<T>(this);
  }

  /**
   * Compute the union of this set with a list of other collections and return
   * the result as a new set. Formally, `result = this ∪ A ∪ B ∪ C`.
   *
   * @typeParam T - the type of element stored in the set
   * @param collections - the other collections
   * @returns the union of this set with the other collections
   */
  public union(...collections: Iterable<T>[]): SetPlus<T> {
    return this.clone().unionInPlace(...collections);
  }

  /**
   * Make this set the union of itself with a list of other collections.
   * Formally, `this = this ∪ A ∪ B ∪ C`.
   *
   * @typeParam T - the type of element stored in the set
   * @param collections - the other collections
   * @returns this instance for chaining
   */
  public unionInPlace(...collections: Iterable<T>[]): this {
    for (const collection of collections) {
      for (const element of collection) {
        this.add(element);
      }
    }
    return this;
  }

  /**
   * Compute the intersection of this set with a list of other collections and
   * return the result as a new set. Formally, `result = this ∩ A ∩ B ∩ C`.
   *
   * @typeParam T - the type of element stored in the set
   * @param collections - the other collections
   * @returns the intersection of this set with the other collections
   */
  public intersection(...collections: Iterable<T>[]): SetPlus<T> {
    // Assume the maximal result, that is, the intersection will be contain all
    // elements in this set.
    const result = this.clone();
    for (const collection of collections) {
      // Convert the collection to a set instance if necessary for easier
      // membership testing.
      const otherSet = this.asSet(collection);

      // Identify any elements in the result that are not in the other set and
      // remove them from the result. If the result becomes empty then we can
      // leave.
      for (const element of result) {
        if (!otherSet.has(element)) {
          result.delete(element);
          if (result.empty()) {
            return result;
          }
        }
      }
    }
    return result;
  }

  /**
   * Compute the difference of this set with a list of other collections and
   * return the result as a new set. The difference is a set containing all
   * elements in this set that do not appear in at least one of the other
   * collections. Formally, `result = this - A - B - C`.
   *
   * @typeParam T - the type of element stored in the set
   * @param collections - the other collections
   * @returns the difference of this set with the other collections
   */
  public difference(...collections: Iterable<T>[]): SetPlus<T> {
    // Assume the maximal result, that is, the difference will be contain all
    // elements in this set.
    const result = this.clone();
    for (const collection of collections) {
      // Remove all elements in this collection from the result
      for (const element of collection) {
        result.delete(element);

        // If the result becomes empty then we can leave
        if (result.empty()) {
          return result;
        }
      }
    }

    return result;
  }

  /**
   * Compute the symmetric difference of this set with a list of other
   * collections and return the result as a new set. The symmetric difference is
   * essentially the xor between the collections, the difference between the
   * union and the intersection. In a Venn diagram, these are all the areas
   * excluding the overlap. Formally, `result = this ∆ A ∆ B ∆ C` which is
   * equivalent to `result = (this ∪ A ∪ B ∪ C) - (this ∩ A ∩ B ∩ C)`.
   *
   * @typeParam T - the type of element stored in the set
   * @param collections - the other collections
   * @returns the symmetric difference of this set with the other collections
   */
  public xor(...collections: Iterable<T>[]): SetPlus<T> {
    // Return the difference between the union and the intesection
    return this.union(...collections).difference(this.intersection(...collections));
  }

  /**
   * Determine if this set is equivalent to another collection
   *
   * @typeParam T - the type of element stored in the set
   * @param collection - the other collection
   * @returns true if this set is equivalent to the given collection
   */
  public equals(collection: Iterable<T>): boolean {
    // The two collections are equivalent if the symmetric difference is empty
    return this.xor(collection).empty();
  }

  /**
   * Called to invoke a given function for each element in the set
   *
   * @typeParam T - the type of element stored in the set
   * @param body - the function to invoke
   * @returns the array containing the results of each function invocation
   */
  public map<FuncType extends (element: T) => any>(body: FuncType): ReturnType<FuncType>[] {
    const result: ReturnType<FuncType>[] = [];

    for (const element of this) {
      result.push(body(element));
    }
    return result;
  }

  /**
   * Create an array containing all elements in the set
   *
   * @typeParam T - the type of element stored in the set
   * @returns this instance as an array
   */
  public toArray(): T[] {
    return Array.from(this);
  }

  /**
   * Convert the set to its string representation
   *
   * @returns the set as a string
   */
  public toString(): string {
    return `{${this.toArray().join(',')}}`;
  }

  /**
   * Given an iterable, convert it to a set instance if required. Note, that the
   * returned set is only guaranteed to be an instance of *Set* and not
   * necessarily an instance of *SetPlus*.
   *
   * @typeParam T - the type of element stored in the set
   * @param collection - the collection of elements to convert
   * @returns the collection as a set
   */
  public asSet(collection: Iterable<T>): Set<T> {
    return collection instanceof Set ? collection : new Set<T>(collection);
  }
}

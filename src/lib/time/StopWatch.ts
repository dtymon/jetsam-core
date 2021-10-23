/**
 * A simple static class for timing the execution of functions
 */
export class StopWatch {
  /**
   * Determine the number of milliseconds taken to execute a given asynchronous
   * function.
   *
   * @typeParam FuncType - the type of function
   * @param body - the function to execute
   * @returns the milliseconds the execution of the function took
   */
  public static async time<FuncType extends (...args: any) => any>(
    body: FuncType,
    ...args: Parameters<FuncType>
  ): Promise<number> {
    const startTime = process.hrtime.bigint();
    await body(...(args as any));
    const endTime = process.hrtime.bigint();

    // The timestamps are in nanoseconds so convert the elapsed into fractional
    // milliseconds.
    return Number(endTime - startTime) / 1000000.0;
  }

  /**
   * Determine the number of milliseconds taken to execute a given synchronous
   * function.
   *
   * @typeParam FuncType - the type of function
   * @param body - the function  body to execute
   * @returns the milliseconds the execution of the function took
   */
  public static timeSync<FuncType extends (...args: any) => any>(
    body: FuncType,
    ...args: Parameters<FuncType>
  ): number {
    const startTime = process.hrtime.bigint();
    body(...(args as any));
    const endTime = process.hrtime.bigint();

    // The timestamps are in nanoseconds so convert the elapsed into fractional
    // milliseconds.
    return Number(endTime - startTime) / 1000000.0;
  }
}

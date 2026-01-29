export type Callback = (...args: unknown[]) => unknown;
export interface Subscription {
  unsubscribe: () => void;
}

export abstract class Hookable {
  map = new Map<string, Callback[]>();

  subscribe(hookName: string, callback: Callback): Subscription {
    if (!this.map.has(hookName)) this.map.set(hookName, []);
    const arr = this.map.get(hookName) ?? [];
    arr.push(callback);

    return {
      unsubscribe: (): Callback[] => {
        return arr.splice(arr.indexOf(callback), 1);
      },
    };
  }

  protected emit(hookName: string, args: unknown[] = []): unknown[] {
    const handlers = this.map.get(hookName);

    if (handlers)
      return handlers.map((handler) => {
        return handler(...args);
      });
    return [];
  }
}

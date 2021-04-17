export function assertNever<T>(arg: never): T {
  throw new Error('should not get here');
}

/**
 * Calls the specified function block with this value as its argument and returns this value.
 * @param ctx
 * @param block
 */
export function also<T>(ctx: T, block: (it: T) => void) {
  block(ctx);
  return ctx;
}

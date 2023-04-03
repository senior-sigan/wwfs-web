export class Once {
  private called = false;
  fn: () => void;

  constructor(fn: () => void) {
    this.fn = fn;
  }

  invoke() {
    if (!this.called) {
      this.called = true;
      this.fn();
    }
  }

  reset() {
    this.called = false;
  }
}

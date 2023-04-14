import { IUpdateable } from "../../cat-lib/src/interfaces/updateable";

function gpid(gp: Gamepad) {
  return `${gp.id}_${gp.index}`;
}

export class Inputs implements IUpdateable {
  private pressedButtons: Map<string, Set<string>> = new Map();

  private reset() {
    this.pressedButtons.forEach((v) => v.clear());
  }

  connect() {
    this.pressedButtons.set("keyboard", new Set());

    window.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.reset();
      }
    });

    window.addEventListener("keyup", (ev) => {
      this.updateKeyboard(ev.code, false);
    });
    window.addEventListener("keydown", (ev) => {
      this.updateKeyboard(ev.code, true);
    });

    window.addEventListener("gamepadconnected", (event) => {
      console.log("A gamepad connected:");
      console.log(event.gamepad);

      const gid = gpid(event.gamepad);
      this.pressedButtons.set(gid, new Set());
    });

    window.addEventListener("gamepaddisconnected", (event) => {
      console.log("A gamepad disconnected:");
      console.log(event.gamepad);

      const gid = gpid(event.gamepad);
      this.pressedButtons.delete(gid);
    });
  }

  private updateKeyboard(code: string, isPressed: boolean) {
    if (isPressed) {
      this.pressedButtons.get("keyboard")?.add(code);
    } else {
      this.pressedButtons.get("keyboard")?.delete(code);
    }
  }

  isPressed(code: string, id = "keyboard") {
    return this.pressedButtons.get(id)?.has(code) || false;
  }

  getPressed() {
    return this.pressedButtons;
  }

  anyPressed() {
    for (const src of this.pressedButtons.values()) {
      if (src.size > 0) {
        return true;
      }
    }
    return false;
  }

  private updateGamepad(gp: Gamepad) {
    const gpState = new Map<string, boolean>();
    gpState.set("X", gp.buttons[2]?.pressed || false);
    gpState.set("Y", gp.buttons[3]?.pressed || false);
    gpState.set("B", gp.buttons[1]?.pressed || false);
    gpState.set("A", gp.buttons[0]?.pressed || false);
    gpState.set(
      "Fire",
      gpState.get("X") ||
        gpState.get("Y") ||
        gpState.get("B") ||
        gpState.get("A") ||
        false
    );

    gpState.set("ArrowLeft", gp.buttons[14]?.pressed || false);
    gpState.set("ArrowRight", gp.buttons[15]?.pressed || false);
    gpState.set("ArrowUp", gp.buttons[12]?.pressed || false);
    gpState.set("ArrowDown", gp.buttons[13]?.pressed || false);

    const pressed = new Set<string>();
    gpState.forEach((isPressed, code) => {
      if (isPressed) {
        pressed.add(code);
      }
    });
    const gid = gpid(gp);
    this.pressedButtons.set(gid, pressed);
  }

  update(_dt: number) {
    if (!document.hasFocus()) {
      this.pressedButtons.forEach((src) => {
        src.clear();
      });
      return;
    }
    if (navigator.getGamepads) {
      // some browsers allow getGamepads only inside a secure scope
      const gamepads = navigator.getGamepads();
      gamepads.forEach((gp) => {
        if (gp) {
          this.updateGamepad(gp);
        }
      });
    }
  }

  debug() {
    for (const [sid, values] of this.pressedButtons) {
      if (values.size > 0) {
        console.log(sid, values);
      }
    }
  }
}

export const inputs = new Inputs();

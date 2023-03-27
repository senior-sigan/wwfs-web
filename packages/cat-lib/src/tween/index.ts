import { lerp, lerpVec2, Vec2 } from "../math";
import { Tween, TweenProps } from "./tween";

export function TweenVec2(props: TweenProps<Vec2>) {
  return new Tween<Vec2>(props, lerpVec2);
}

export function TweenNum(props: TweenProps<number>) {
  return new Tween<number>(props, lerp);
}

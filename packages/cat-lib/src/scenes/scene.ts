import { IUpdateable } from "../interfaces/updateable";

export interface IScene extends IUpdateable {
  activate(): void;
  exit(): void;
}

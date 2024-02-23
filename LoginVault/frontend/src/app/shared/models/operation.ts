export enum Operation {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete"
}

export type SubmitEvent<T> = [Operation, T];

export const LOGOUT = "logout";

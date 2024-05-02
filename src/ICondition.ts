import { Operator } from "./Operator.js";

export interface Condition {
    fact: string;
    operator: Operator;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any;
  }
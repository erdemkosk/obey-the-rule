/* eslint-disable @typescript-eslint/no-explicit-any */
import { Operator } from './Operator.js';

export interface Condition {
  constant?: any;
  fact?: string;
  operator: Operator;
  value: any;
}

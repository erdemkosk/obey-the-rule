import { Action } from './IAction.js';
import { Condition } from './ICondition.js';

export interface Rule {
  before?: Action;
  conditions: {
    and?: Condition[];
    or?: Condition[];
  };
  after: Action;
}

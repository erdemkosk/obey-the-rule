/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rule } from "./IRule.js";
import { Condition } from "./ICondition.js";
import { Action } from "./IAction.js";
import { Operator } from "./Operator.js";

export class RuleEngine {
    rules: Rule[];
    functions: any;
  
    constructor(functions: any) {
      this.rules = [];
      this.functions = functions;
    }
  
    public addRule(rule: Rule) : void {
      this.rules.push(rule);
    }
  
    public async obey() : Promise<void> {
      for (const rule of this.rules) {
        const beforeResult = await this.callFunction(rule.before);
        if (this.evaluateConditions(rule.conditions, beforeResult)) {
          this.callFunction(rule.after,  beforeResult);
          console.log(`'${JSON.stringify(rule)}' rule with success . Rule is worked!`);
        }
        else {
          console.log(`'${JSON.stringify(rule)}' rule with failed . Rule condition is not match!`);
        }
      }
    }
  
    private evaluateConditions(conditions: Rule['conditions'], value?: any): boolean {
      let status = false;
      
      if ('and' in conditions) {
        status = conditions.and.every(condition => this.evaluateSingleCondition(condition, value));
      }
    
      if ('or' in conditions) {
        status = conditions.or.some(condition => this.evaluateSingleCondition(condition, value));
      }
    
      return status;
    }
    
    private evaluateSingleCondition(condition: Condition, value?: any): boolean {
      switch (condition.operator) {
        case Operator.EQUAL:
          return value[condition.fact] === condition.value;
        case Operator.NOT_EQUAL:
          return value[condition.fact] !== condition.value;
        default:
          return false;
      }
    }
  
    private async callFunction(action: Action, beforeResult?: any) : Promise<any> {
      if (action.func in this.functions && typeof this.functions[action.func] === 'function') {
       
        return await this.functions[action.func](action.params, beforeResult);
      } else {
        console.error(`Function '${action.func}' not found or not a function.`);
      }
    }
  }

  export { Operator };
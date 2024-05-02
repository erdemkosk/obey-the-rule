/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rule } from "./IRule.js";
import { Condition } from "./ICondition.js";
import { Action } from "./IAction.js";
import { Operator } from "./Operator.js";

/**
 * Rule engine class to manage and execute rules.
 */
export class RuleEngine {
    rules: Rule[];
    functions: any;
  
    /**
     * Creates an instance of a RuleEngine.
     * @param {any} functions - An object containing functions that can be called by the rule engine.
     */
    constructor(functions: any) {
      this.rules = [];
      this.functions = functions;
    }
  
    /**
     * Adds a rule to the rule engine.
     * @param {Rule} rule - The rule to add.
     */
    public addRule(rule: Rule) : void {
      this.rules.push(rule);
    }
  
    /**
     * Evaluates all added rules in sequence and executes corresponding actions based on rule conditions.
     */
    public async obey() : Promise<void> {
      for (const rule of this.rules) {
        const beforeResult = await this.callFunction(rule.before);
        if (this.evaluateConditions(rule.conditions, beforeResult)) {
          await this.callFunction(rule.after, beforeResult);
          console.log(`'${JSON.stringify(rule)}' rule succeeded. Rule is executed!`);
        }
        else {
          console.log(`'${JSON.stringify(rule)}' rule failed. Rule condition did not match!`);
        }
      }
    }
  
    /**
     * Evaluates the conditions of a rule.
     * @param {Rule['conditions']} conditions - The conditions to evaluate.
     * @param {any} value - The result from the 'before' function, used for condition evaluation.
     * @returns {boolean} - True if conditions are met, otherwise false.
     */
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
    
    /**
     * Evaluates a single condition against the provided value.
     * @param {Condition} condition - The condition to evaluate.
     * @param {any} value - The value to check the condition against.
     * @returns {boolean} - True if the condition is met, otherwise false.
     */
    private evaluateSingleCondition(condition: Condition, value?: any): boolean {
      if (!value) {
          return false;
      }
  
      switch (condition.operator) {
          case Operator.LOOSE_EQUAL:
              return value[condition.fact] == condition.value;
          case Operator.STRICT_EQUAL:
              return value[condition.fact] === condition.value;
          case Operator.LOOSE_NOT_EQUAL:
              return value[condition.fact] != condition.value;
          case Operator.STRICT_NOT_EQUAL:
              return value[condition.fact] !== condition.value;
          case Operator.GREATER_THAN:
              return value[condition.fact] > condition.value;
          case Operator.LESS_THAN:
              return value[condition.fact] < condition.value;
          case Operator.GREATER_THAN_OR_EQUAL:
              return value[condition.fact] >= condition.value;
          case Operator.LESS_THAN_OR_EQUAL:
              return value[condition.fact] <= condition.value;
          case Operator.CONTAINS:
              if (Array.isArray(value[condition.fact])) {
                  return value[condition.fact].includes(condition.value);
              } else if (typeof value[condition.fact] === 'string') {
                  return value[condition.fact].includes(condition.value);
              } else {
                  return false;
              }
          case Operator.NOT_CONTAINS:
              if (Array.isArray(value[condition.fact])) {
                  return !value[condition.fact].includes(condition.value);
              } else if (typeof value[condition.fact] === 'string') {
                  return !value[condition.fact].includes(condition.value);
              } else {
                  return false;
              }
          case Operator.STARTS_WITH:
              if (typeof value[condition.fact] === 'string') {
                  return value[condition.fact].startsWith(condition.value);
              } else {
                  return false;
              }
          case Operator.ENDS_WITH:
              if (typeof value[condition.fact] === 'string') {
                  return value[condition.fact].endsWith(condition.value);
              } else {
                  return false;
              }
          default:
              return false;
      }
  }
  

  
    /**
     * Calls a function defined in the functions object.
     * @param {Action} action - The action to perform which includes the function name and parameters.
     * @param {any} beforeResult - The result from the 'before' function that can be passed to the 'after' function.
     * @returns {Promise<any>} - The result of the function call.
     */
    private async callFunction(action: Action, beforeResult?: any) : Promise<any> {
      try {
        if (action.func in this.functions && typeof this.functions[action.func] === 'function') {
          return await this.functions[action.func](action.params, beforeResult);
        } else {
          console.error(`Function '${action.func}' not found or not a function.`);
        }
      } catch (error) {
        console.error(`An error occurred while executing function '${action.func}':`, error);
      }
    }
    
  }

  export { Operator };

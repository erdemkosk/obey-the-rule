/* eslint-disable @typescript-eslint/no-explicit-any */
import { Rule } from "./IRule.js";
import { Condition } from "./ICondition.js";
import { Action } from "./IAction.js";
import { Operator } from "./Operator.js";
import { Result } from "./IResult.js";

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
  public addRule(rule: Rule): void {
    this.rules.push(rule);
  }

  /**
   * Evaluates all added rules in sequence and returns an array of objects containing
   * information about whether each rule's conditions are met and the reason if not.
   * @returns {Promise<Result[]>} - An array of objects containing information
   * about whether each rule's conditions are met and the reason if not.
   */
  public async obey(): Promise<Result[]> {
    const results: Result[] = [];

    for (const rule of this.rules) {
      try {
        const beforeResult = await this.callFunction(rule.before);
        const satisfied = this.evaluateConditions(rule.conditions, beforeResult);
        const result = {
          rule,
          satisfied,
          reason: satisfied ? undefined : "Conditions not met",
        };
  
        if (satisfied) {
          await this.callFunction(rule.after, beforeResult);
        }
  
        results.push(result);
      } catch (error) {
        results.push({
          rule,
          satisfied: false,
          reason: `An error occurred: ${error.message}`,
        });
      }
 
    }

    return results;
  }

  /**
   * Evaluates the conditions of a rule.
   * @param {Rule['conditions']} conditions - The conditions to evaluate.
   * @param {any} value - The result from the 'before' function, used for condition evaluation.
   * @returns {boolean} - True if conditions are met, otherwise false.
   */
  private evaluateConditions(
    conditions: Rule["conditions"],
    value?: any
  ): boolean {
    let status = false;

    if ("and" in conditions) {
      status = conditions.and.every((condition) =>
        this.evaluateSingleCondition(condition, value)
      );
    }

    if ("or" in conditions) {
      status = conditions.or.some((condition) =>
        this.evaluateSingleCondition(condition, value)
      );
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
      throw Error(`Value does not contain '${condition.value}'.`);
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
          if (Array.isArray(value[condition.fact]) || typeof value[condition.fact] === "string") {
            return value[condition.fact].includes(condition.value);
          } else {
            throw new Error(`Invalid data type for ${condition.fact}. Expected array or string.`);
          }
        case Operator.NOT_CONTAINS:
          if (Array.isArray(value[condition.fact]) || typeof value[condition.fact] === "string") {
            return !value[condition.fact].includes(condition.value);
          } else {
            throw new Error(`Invalid data type for ${condition.fact}. Expected array or string.`);
          }
        case Operator.STARTS_WITH:
          if (typeof value[condition.fact] === "string") {
            return value[condition.fact].startsWith(condition.value);
          } else {
            throw new Error(`Invalid data type for ${condition.fact}. Expected string.`);
          }
        case Operator.ENDS_WITH:
          if (typeof value[condition.fact] === "string") {
            return value[condition.fact].endsWith(condition.value);
          } else {
            throw new Error(`Invalid data type for ${condition.fact}. Expected string.`);
          }
        default:
          throw new Error(`Invalid operator: ${condition.operator}`);
      }
  }

  /**
   * Calls a function defined in the functions object.
   * @param {Action} action - The action to perform which includes the function name and parameters.
   * @param {any} beforeResult - The result from the 'before' function that can be passed to the 'after' function.
   * @returns {Promise<any>} - The result of the function call.
   */
  private async callFunction(action: Action, beforeResult?: any): Promise<any> {
   
      if (
        action.func in this.functions &&
        typeof this.functions[action.func] === "function"
      ) {
        return await this.functions[action.func](action.params, beforeResult);
      } else {
        throw Error(`Function '${action.func}' not found or not a function.`);
      }
    
  }
}

export { Operator };
export { Result };

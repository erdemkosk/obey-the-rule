/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

interface Action {
  func: string;
  params: object;
}

interface Condition {
  fact: string;
  operator: Operator;
  value: any;
}

enum Operator {
  EQUAL = 'equal',
  NOT_EQUAL = 'notEqual',
  GREATER_THAN = 'greaterThan',
  LESS_THAN = 'lessThan',
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',
  CONTAINS = 'contains',
  NOT_CONTAINS = 'notContains',
  STARTS_WITH = 'startsWith',
  ENDS_WITH = 'endsWith'
}

interface Rule {
  before: Action;
  conditions: {
    and?: Condition[];
    or?: Condition[];
  };
  after: Action;
}

const functions = {
  getCourier: getCourier,
  logCourierInfo: logCourierInfo
};

class RuleEngine {
  rules: Rule[];

  constructor() {
    this.rules = [];
  }

  addRule(rule: Rule) : void {
    this.rules.push(rule);
  }

  async evaluateFacts() : Promise<void> {
    for (const rule of this.rules) {
      const beforeResult = await this.callFunction(rule.before, {});
      if (this.evaluateConditions(rule.conditions, beforeResult)) {
        this.callFunction(rule.after,  beforeResult);
        console.log(`Function '${JSON.stringify(rule)}' calling with success . Rule is worked!`);
      }
    }
  }

  evaluateConditions(conditions: Rule['conditions'], value?: any): boolean {
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

  async callFunction(action: Action, facts: object, beforeResult?: any) {
    if (action.func in functions && typeof functions[action.func] === 'function') {
     
      return await functions[action.func](facts, action.params, beforeResult);
    } else {
      console.error(`Function '${action.func}' not found or not a function.`);
    }
  }
  
}

// Example usage:
const engine = new RuleEngine();

engine.addRule({
  before: {func : 'getCourier'  , params: {
    message: 'courier is olay'
  }},
  conditions: {
    and: [
      {
        fact: 'status',
        operator: Operator.EQUAL,
        value: 200
      }
    ],
    or: [
      {
        fact: 'vehicle',
        operator: Operator.EQUAL,
        value: 'Bike'
      },
      {
        fact: 'vehicle',
        operator: Operator.EQUAL,
        value: 'Car'
      }
    ]
  },
  after: {func : 'logCourierInfo'  , params: {
    message: 'Rule work with success!',
    success: true,
  }},
});

export async function getCourier(_facts: object): Promise<any> {
  return {
    status: 200,
    vehicle: 'Bike',
    courierInfo: {
      name: 'John Doe',
      warehouse: 'Izmir'
    }
  };
}

export async function logCourierInfo(courier : any , params: any) : Promise<any> {

  console.log(JSON.stringify({
    courierInfo: {
      status: courier.status,
      vehicle: courier.vehicle,
    },
    params
  }, null, 2));
}
 
engine.evaluateFacts();

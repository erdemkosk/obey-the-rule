/* eslint-disable @typescript-eslint/no-explicit-any */

import { RuleEngine, Operator, Result } from '../src/index.js';

const functions = {
  getOrder: getOrder,
  logOrderInfo: logOrderInfo,
};

export async function getOrder(params: any): Promise<any> {
  return {
    id: params?.orderId,
    status: 700,
    products: [
      {
        _id: '66363f645d9b4260494acbb1',
        name: 'Nutella',
        count: 2,
        price: '7$',
      },
      {
        _id: '66363fd83fda3abc3e763ecd',
        name: 'Coke',
        count: 5,
        price: '1$',
      },
    ],
    basket: {
      missingItems: {
        isValid: true,
        array: [1, 2],
      },
    },
  };
}

export async function logOrderInfo(order: any, params: any): Promise<any> {
  console.log(
    JSON.stringify(
      {
        order,
        params,
      },
      null,
      2,
    ),
  );
}

// Example usage:
const engine = new RuleEngine(functions);

// Success rule example
engine.addRule({
  before: {
    func: 'getOrder',
    params: {
      orderId: '6633d4699c759c778ab5b399',
    },
  },
  conditions: {
    and: [
      {
        fact: 'products',
        operator: Operator.EACH,
        value: {
          fact: 'name',
          operator: Operator.LOOSE_NOT_EQUAL,
          value: undefined,
        },
      },
    ],
  },
  after: {
    func: 'logOrderInfo',
    params: {
      message: 'Rule work with success!',
      success: true,
    },
  },
});

engine.addRule({
  before: {
    func: 'getOrder',
    params: {
      orderId: '6633d4699c759c778ab5b399',
    },
  },
  conditions: {
    and: [
      {
        fact: 'basket.missingItems.array',
        operator: Operator.EACH,
        value: {
          fact: '$',
          operator: Operator.GREATER_THAN,
          value: 0,
        },
      },
    ],
  },
  after: {
    func: 'logOrderInfo',
    params: {
      message: 'Rule work with success!',
      success: true,
    },
  },
});

const result: Result[] = await engine.obey();

console.log(JSON.stringify(result));

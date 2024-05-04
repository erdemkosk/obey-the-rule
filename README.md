# 🫡 Obey The Rule

![Logo](https://i.imgur.com/bC7sXDJ.png)

This project includes a minimalist rule engine implemented in TypeScript. It provides a lightweight solution for managing conditional logic and automating decision-making processes.

The and and or keys are used within the conditions object to combine specific conditions.

and: This key indicates that all specified conditions must be met simultaneously. When and is used, all conditions in the list must be true for the entire expression to be true. If any single condition is false, the entire expression is considered false.
or: This key indicates that at least one condition in the list must be true. When or is used, the expression is considered true if at least one condition in the list evaluates to true. Even if all other conditions are false, as long as one condition is true, the entire expression is true.
These keys are used to specify complex conditions. For example, they can be used to define a rule that must meet a specific condition and at the same time meet another condition or meet any of several other conditions. This allows rules to accommodate a wide range of scenarios.

### How to install

```bash
npm i obey-the-rule
```

It is currently supported esm and common js.

### Usage

Esm:

```typescript
import { RuleEngine, Operator } from 'obey-the-rule';
```

Common Js:

```typescript
const { RuleEngine, Operator } = require('obey-the-rule');
```

### Operator Types

```typescript
export enum Operator {
  /** Strict equal operator, checks if the values are exactly equal using strict comparison (===). */
  STRICT_EQUAL = 'strictEqual',

  /** Strict not equal operator, checks if the values are not equal using strict comparison (!==). */
  STRICT_NOT_EQUAL = 'strictNotEqual',

  /** Loose equal operator, checks if the values are equal using loose comparison (==). */
  LOOSE_EQUAL = 'looseEqual',

  /** Loose not equal operator, checks if the values are not equal using loose comparison (!=). */
  LOOSE_NOT_EQUAL = 'looseNotEqual',

  /** Greater than operator, checks if the value is greater than the comparison value. */
  GREATER_THAN = 'greaterThan',

  /** Less than operator, checks if the value is less than the comparison value. */
  LESS_THAN = 'lessThan',

  /** Greater than or equal operator, checks if the value is greater than or equal to the comparison value. */
  GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual',

  /** Less than or equal operator, checks if the value is less than or equal to the comparison value. */
  LESS_THAN_OR_EQUAL = 'lessThanOrEqual',

  /** Contains operator, checks if the value contains the comparison value. */
  CONTAINS = 'contains',

  /** Not contains operator, checks if the value does not contain the comparison value. */
  NOT_CONTAINS = 'notContains',

  /** Starts with operator, checks if the value starts with the comparison value. */
  STARTS_WITH = 'startsWith',

  /** Ends with operator, checks if the value ends with the comparison value. */
  ENDS_WITH = 'endsWith',

  /** Regular expression match operator, checks if the value matches the provided regular expression. */
  REGEX_MATCH = 'regexMatch',

  /** Regular expression not match operator, checks if the value does not match the provided regular expression. */
  REGEX_NOT_MATCH = 'regexNotMatch',

  /** Check inside of value operator. It will check array is containts this value */
  ARRAY_CONTAINS = 'arrayContains',

  /** Array operator it will foreach all values */
  EACH = 'each',
}
```

## Warning

This project is currently in an early development stage

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/erdemkosk/obey-the-rule/blob/master/LICENSE) file for details.

### Basic Usage With constant

```typescript
// Example usage:
import { RuleEngine, Operator } from 'obey-the-rule';
const functions = {
  helloWorld: helloWorld,
};

export async function helloWorld(): Promise<any> {
  console.log('Hello World');
}

const testValue = 'This';

// Example usage:
const engine = new RuleEngine(functions);

//success rule example
engine.addRule({
  conditions: {
    and: [
      {
        constant: testValue,
        operator: Operator.STRICT_EQUAL,
        value: 'This',
      },
    ],
  },
  after: {
    func: 'helloWorld',
    params: {
      message: 'Rule work with success!',
      success: true,
    },
  },
});

const result: Result[] = await engine.obey();

console.log(JSON.stringify(result));

//Hello World
//[{"rule":{"conditions":{"and":[{"constant":"This","operator":"strictEqual","value":"This"}]},"after":{"func":"helloWorld","params":{"message":"Rule work with success!","success":true}}},"satisfied":true}]
```

### Example Usage Add rule and Add rules

```typescript
const functions = {
  getCourier: getCourier,
  logCourierInfo: logCourierInfo,
};

export async function getCourier(params: any): Promise<any> {
  return {
    id: params?.courierId,
    status: 200,
    vehicle: 'Bike',
    courierInfo: {
      name: 'John Doe',
      warehouse: 'Izmir',
    },
  };
}

export async function logCourierInfo(courier: any, params: any): Promise<any> {
  console.log(
    JSON.stringify(
      {
        courierInfo: {
          status: courier.status,
          vehicle: courier.vehicle,
        },
        params,
      },
      null,
      2,
    ),
  );
}
```

```typescript
// Example usage:
import { RuleEngine, Operator } from 'obey-the-rule';

const engine = new RuleEngine(functions);

//success rule example
engine.addRule({
  before: {
    func: 'getCourier',
    params: {
      courierId: '6633d4699c759c778ab5b399',
    },
  },
  conditions: {
    and: [
      {
        fact: 'status',
        operator: Operator.STRICT_EQUAL,
        value: 200,
      },
    ],
    or: [
      {
        fact: 'vehicle',
        operator: Operator.STRICT_EQUAL,
        value: 'Bike',
      },
      {
        fact: 'vehicle',
        operator: Operator.STRICT_EQUAL,
        value: 'Car',
      },
    ],
  },
  after: {
    func: 'logCourierInfo',
    params: {
      message: 'Rule work with success!',
      success: true,
    },
  },
});

//failed rule example
engine.addRule({
  before: {
    func: 'getCourier',
    params: {
      courierId: '6633d4699c759c778ab5b399',
    },
  },
  conditions: {
    and: [
      {
        fact: 'status',
        operator: Operator.STRICT_EQUAL,
        value: 400,
      },
    ],
  },
  after: {
    func: 'logCourierInfo',
    params: {
      message: 'Rule work with success!',
      success: true,
    },
  },
});

// Adding multiple rules at once
engine.addRules([
  {
    before: {
      func: 'getCourier',
      params: {
        courierId: '6633d4699c759c778ab5b399',
      },
    },
    conditions: {
      and: [
        {
          fact: 'status',
          operator: Operator.STRICT_EQUAL,
          value: 200,
        },
      ],
      or: [
        {
          fact: 'vehicle',
          operator: Operator.STRICT_EQUAL,
          value: 'Bike',
        },
        {
          fact: 'vehicle',
          operator: Operator.STRICT_EQUAL,
          value: 'Car',
        },
      ],
    },
    after: {
      func: 'logCourierInfo',
      params: {
        message: 'Rule work with success!',
        success: true,
      },
    },
  },

  {
    before: {
      func: 'getCourier',
      params: {
        courierId: '6633d4699c759c778ab5b399',
      },
    },
    conditions: {
      and: [
        {
          fact: 'status',
          operator: Operator.STRICT_EQUAL,
          value: 400,
        },
      ],
    },
    after: {
      func: 'logCourierInfo',
      params: {
        message: 'Rule work with success!',
        success: true,
      },
    },
  },
]);

const result: Result[] = await engine.obey();

//[{"rule":{"before":{"func":"getCourier","params":{"courierId":"6633d4699c759c778ab5b399"}},"conditions":{"and":[{"fact":"status","operator":"strictEqual","value":200}],"or":[{"fact":"vehicle","operator":"strictEqual","value":"Bike"},{"fact":"vehicle","operator":"strictEqual","value":"Car"}]},"after":{"func":"logCourierInfo","params":{"message":"Rule work with success!","success":true}}},"satisfied":true},{"rule":{"before":{"func":"getCourier","params":{"courierId":"6633d4699c759c778ab5b399"}},"conditions":{"and":[{"fact":"status","operator":"strictEqual","value":400}]},"after":{"func":"logCourierInfo","params":{"message":"Rule work with success!","success":true}}},"satisfied":false,"reason":"Conditions not met"}]
```

### Array and Inner Values

$ it is represent current value

```typescript
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
```

For more detail you can see [examples](https://github.com/erdemkosk/obey-the-rule/blob/master/examples) 🤓

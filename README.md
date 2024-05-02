# Obey The Rule

This project includes a minimalist rule engine implemented in TypeScript. It provides a lightweight solution for managing conditional logic and automating decision-making processes.

The and and or keys are used within the conditions object to combine specific conditions.

and: This key indicates that all specified conditions must be met simultaneously. When and is used, all conditions in the list must be true for the entire expression to be true. If any single condition is false, the entire expression is considered false.
or: This key indicates that at least one condition in the list must be true. When or is used, the expression is considered true if at least one condition in the list evaluates to true. Even if all other conditions are false, as long as one condition is true, the entire expression is true.
These keys are used to specify complex conditions. For example, they can be used to define a rule that must meet a specific condition and at the same time meet another condition or meet any of several other conditions. This allows rules to accommodate a wide range of scenarios.

## Warning

This project is currently in an early development stage

## License

Licensed under the APLv2. See the [LICENSE](https://github.com/erdemkosk/obey-the-rule/blob/main/LICENSE) file for details.

## Example Usage
```typescript
const functions = {
  getCourier: getCourier,
  logCourierInfo: logCourierInfo
};

export async function getCourier(params : any): Promise<any> {
  return {
    id: params?.courierId,
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

```


```typescript
// Example usage:
const engine = new RuleEngine(functions);

//success rule example
engine.addRule({
  before: {func : 'getCourier'  , params: {
    courierId: '6633d4699c759c778ab5b399'
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

//failed rule example
engine.addRule({
  before: {func : 'getCourier'  , params: {
    courierId: '6633d4699c759c778ab5b399'
  }},
  conditions: {
    and: [
      {
        fact: 'status',
        operator: Operator.EQUAL,
        value: 400
      }
    ],
  },
  after: {func : 'logCourierInfo'  , params: {
    message: 'Rule work with success!',
    success: true,
  }},
});
 
engine.evaluateFacts();

// '{"before":{"func":"getCourier","params":{"courierId":"6633d4699c759c778ab5b399"}},"conditions":{"and":[{"fact":"status","operator":"equal","value":200}],"or":[{"fact":"vehicle","operator":"equal","value":"Bike"},{"fact":"vehicle","operator":"equal","value":"Car"}]},"after":{"func":"logCourierInfo","params":{"message":"Rule work with success!","success":true}}}' rule with success . Rule is worked!
//'{"before":{"func":"getCourier","params":{"courierId":"6633d4699c759c778ab5b399"}},"conditions":{"and":[{"fact":"status","operator":"equal","value":400}]},"after":{"func":"logCourierInfo","params":{"message":"Rule work with success!","success":true}}}' rule with failed . Rule condition is not match!

```
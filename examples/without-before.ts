/* eslint-disable @typescript-eslint/no-explicit-any */

import {RuleEngine , Operator, Result} from "../src/RuleEngine.js";

const functions = {
  helloWorld: helloWorld
};

export async function helloWorld() : Promise<any> {

  console.log('Hello World')
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
        value: 'This'
      }
    ],
  },
  after: {func : 'helloWorld'  , params: {
    message: 'Rule work with success!',
    success: true,
  }},
});

 
const result : Result[] = await engine.obey();

console.log(JSON.stringify(result));

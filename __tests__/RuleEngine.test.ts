import { RuleEngine, Operator } from "../src/RuleEngine.js";

describe('Rule Engine', () => {
  let ruleEngine;

  const functions = {
    beforeFunction: jest.fn(() => ({ factValue: 10 , message : 'Hello', array:['fact'] })),
    afterFunction: jest.fn(),
    functionWithError: jest.fn(() => { throw new Error("Error in function") })
  };  

  beforeAll(() => {
   
  });
  
  beforeEach(() => {
    ruleEngine = new RuleEngine(functions);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
   
  });


  it('adds rules correctly', () => {
    const rule = { before: 'beforeFunction', conditions: { and: [] }, after: 'afterFunction' };
    ruleEngine.addRule(rule);
    expect(ruleEngine.rules).toContain(rule);
  });

  it('executes the before and after functions if conditions are met', async () => {
    const rule = {
      before: {func : 'beforeFunction'},
      conditions: { and: [{ fact: 'factValue', operator: Operator.GREATER_THAN_OR_EQUAL, value: 10 }] },
      after: {func : 'afterFunction'},
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.beforeFunction).toHaveBeenCalled();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('does not execute the after function if conditions are not met', async () => {
    const rule = {
      before: {func : 'beforeFunction'},
      conditions: { and: [{ fact: 'factValue', operator: Operator.LESS_THAN, value: 10 }] },
      after: {func : 'afterFunction'},
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.beforeFunction).toHaveBeenCalled();
    expect(functions.afterFunction).not.toHaveBeenCalled();
  });

  it('handles logical OR conditions correctly', async () => {
    const rule = {
      before: {func : 'beforeFunction'},
      conditions: { or: [{ fact: 'factValue', operator: Operator.STRICT_EQUAL, value: 5 }, { fact: 'factValue', operator: Operator.GREATER_THAN, value: 5 }] },
      after: {func : 'afterFunction'},
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles strict equal operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.STRICT_EQUAL, value: 10 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles strict not equal operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.STRICT_NOT_EQUAL, value: 20 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles loose equal operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.LOOSE_EQUAL, value: '10' }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles loose not equal operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.LOOSE_NOT_EQUAL, value: '20' }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles greater than operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.GREATER_THAN, value: 5 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles less than operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.LESS_THAN, value: 20 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles greater than or equal operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.GREATER_THAN_OR_EQUAL, value: 10 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles less than or equal operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.LESS_THAN_OR_EQUAL, value: 10 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles contains operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'array', operator: Operator.CONTAINS, value: 'fact' }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles not contains operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'array', operator: Operator.NOT_CONTAINS, value: 'XYZ' }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles starts with operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'message', operator: Operator.STARTS_WITH, value: 'H' }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('handles ends with operator correctly', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'message', operator: Operator.ENDS_WITH, value: 'o' }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    await ruleEngine.obey();
    expect(functions.afterFunction).toHaveBeenCalled();
  });

  it('reports error when the before function is not found', async () => {
    const rule = {
      before: { func: 'nonExistentFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.STRICT_EQUAL, value: 10 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    const results = await ruleEngine.obey();
    const errorResult = results.find(result => result.satisfied === false);
    expect(errorResult.reason).toBe("An error occurred: Function 'nonExistentFunction' not found or not a function.");
  });
  

  it('catches and logs errors from the function execution', async () => {
    const rule = {
      before: { func: 'functionWithError' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.STRICT_EQUAL, value: 10 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    const results = await ruleEngine.obey();
    expect(results[0].reason).toContain('Error in function');
  });

  it('catches and logs errors when types do not match', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.STRICT_EQUAL, value: '10' }] }, // '10' string, ama beklenen number
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    const results = await ruleEngine.obey();
    expect(results[0].reason).toContain('Conditions not met');
  });
  
  it('returns successful result for a successful condition', async () => {
    const rule = {
      before: { func: 'beforeFunction' },
      conditions: { and: [{ fact: 'factValue', operator: Operator.STRICT_EQUAL, value: 10 }] },
      after: { func: 'afterFunction' },
    };
    ruleEngine.addRule(rule);
    const results = await ruleEngine.obey();
    expect(results[0].satisfied).toBe(true);
  });
  
  
  
});

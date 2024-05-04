/* eslint-disable @typescript-eslint/no-explicit-any */
import { RuleEngine } from '../../src/RuleEngine.js';
import fs from 'fs/promises';
import path from 'path';

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

async function addRulesFromFile(engine: any, filePath: string): Promise<void> {
  try {
    const fullPath = path.join(
      process.cwd(),
      'examples/read-from-outside-json' + filePath,
    );
    const data = await fs.readFile(fullPath, 'utf-8');
    const rules = JSON.parse(data);
    engine.addRules(rules);
  } catch (error) {
    console.error('Error adding rules from file:', error);
  }
}

const rulesFilePath = '/rules.json';

const engine = new RuleEngine(functions);

addRulesFromFile(engine, rulesFilePath)
  .then(() => {
    return engine.obey();
  })
  .then((result) => {
    console.log(JSON.stringify(result));
  })
  .catch((error) => {
    console.error('Error:', error);
  });

import { DynamoDB } from 'aws-sdk';
import type { Handler } from 'aws-cdk-lib/aws-lambda';

const dynamoDB = new DynamoDB.DocumentClient();

const PIZZAS_TABLE = 'Pizzas';
const TOPPINGS_TABLE = 'Toppings';

export const handler: Handler = async (event: any) => {
  try {
    const { httpMethod, path, body } = event;
    const data = body ? JSON.parse(body) : {};

    if (httpMethod === 'POST' && path.includes('/toppings')) return await addTopping(data);
    if (httpMethod === 'POST' && path.includes('/pizzas')) return await addPizza(data);
    if (httpMethod === 'GET' && path.includes('/toppings')) return await listToppings();
    if (httpMethod === 'GET' && path.includes('/pizzas')) return await listPizzas();
    if (httpMethod === 'DELETE' && path.includes('/toppings')) return await deleteTopping(data);
    if (httpMethod === 'DELETE' && path.includes('/pizzas')) return await deletePizza(data);

    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid request' }) };
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return { statusCode: 500, body: JSON.stringify({ message: errMessage }) };
  }
}

// Add a new topping
const addTopping = async (data: any) => {
  const { name } = data;
  if (!name) return { statusCode: 400, body: JSON.stringify({ message: 'Topping name required' }) };

  const existing = await dynamoDB
    .scan({ TableName: TOPPINGS_TABLE, FilterExpression: 'name = :name', ExpressionAttributeValues: { ':name': name } })
    .promise();

  if (existing.Items && existing.Items.length > 0)
    return { statusCode: 400, body: JSON.stringify({ message: 'Topping already exists' }) };

  const item = { toppingId: Date.now().toString(), name };
  await dynamoDB.put({ TableName: TOPPINGS_TABLE, Item: item }).promise();
  return { statusCode: 200, body: JSON.stringify(item) };
};

// List toppings
const listToppings = async () => {
  const toppings = await dynamoDB.scan({ TableName: TOPPINGS_TABLE }).promise();
  return { statusCode: 200, body: JSON.stringify(toppings.Items) };
};

// Delete topping
const deleteTopping = async (data: any) => {
  const { toppingId } = data;
  if (!toppingId) return { statusCode: 400, body: JSON.stringify({ message: 'Topping ID required' }) };

  await dynamoDB.delete({ TableName: TOPPINGS_TABLE, Key: { toppingId } }).promise();
  return { statusCode: 200, body: JSON.stringify({ message: 'Topping deleted' }) };
};

// Add a new pizza
const addPizza = async (data: any) => {
  const { name, toppings } = data;
  if (!name || !toppings || !Array.isArray(toppings))
    return { statusCode: 400, body: JSON.stringify({ message: 'Invalid pizza data' }) };

  const existing = await dynamoDB
    .scan({ TableName: PIZZAS_TABLE, FilterExpression: 'name = :name', ExpressionAttributeValues: { ':name': name } })
    .promise();

  if (existing.Items && existing.Items.length > 0)
    return { statusCode: 400, body: JSON.stringify({ message: 'Pizza name already exists' }) };

  const item = { pizzaId: Date.now().toString(), name, createdAt: new Date().toISOString(), toppings };
  await dynamoDB.put({ TableName: PIZZAS_TABLE, Item: item }).promise();
  return { statusCode: 200, body: JSON.stringify(item) };
};

// List pizzas
const listPizzas = async () => {
  const pizzas = await dynamoDB.scan({ TableName: PIZZAS_TABLE }).promise();
  return { statusCode: 200, body: JSON.stringify(pizzas.Items) };
};

// Delete pizza
const deletePizza = async (data: any) => {
  const { pizzaId } = data;
  if (!pizzaId) return { statusCode: 400, body: JSON.stringify({ message: 'Pizza ID required' }) };

  await dynamoDB.delete({ TableName: PIZZAS_TABLE, Key: { pizzaId } }).promise();
  return { statusCode: 200, body: JSON.stringify({ message: 'Pizza deleted' }) };
};

import { defineFunction } from '@aws-amplify/backend';

export const PizzaToppingsLambda = defineFunction({
  entry: './index.ts'
});
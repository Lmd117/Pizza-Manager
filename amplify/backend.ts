import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { PizzaToppingsLambda } from './functions/PizzaToppingsLambda/resource';

defineBackend({
  auth,
  data,
  PizzaToppingsLambda,
});

import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

/**
 * Define the schema for the Pizza and Toppings tables
 */
const schema = a.schema({
  pizzas: a
    .model({
      name: a.string().required(),
      createdAt: a.string(),
      toppings: a.hasMany("pizzas", "toppings"), // Store topping IDs
    }).authorization((allow) => allow.guest()), // Anyone can modify this table

  toppings: a
    .model({
      name: a.string().required(),
      pizzas: a.belongsTo("pizzas", "toppings"),
    }).authorization((allow) => allow.guest()),
});

export type Schema = ClientSchema<typeof schema>;

/**
 * Define the data layer with schema and IAM authorization
 */
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",
  },
});

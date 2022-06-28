const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const graphql = require('graphql')
const joinMonster = require('join-monster')
require('dotenv').config()
const session = require('express-session')

// Connect to database
const { Client } = require('pg')
const client = new Client({
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.DB_PW,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
})
client.connect()

// Define the schema
const Meter = new graphql.GraphQLObjectType({
  name: 'Meter',
  fields: () => ({
    id: { type: graphql.GraphQLID },
    device_id: { type: graphql.GraphQLInt },
    active_energy_l1: { type: graphql.GraphQLFloat },
    active_energy_l2: { type: graphql.GraphQLFloat },
    active_energy_l3: { type: graphql.GraphQLFloat },
    time_stamp: { type: graphql.GraphQLString }
  })
});

Meter._typeConfig = {
  sqlTable: 'meter',
  uniqueKey: 'id',
}


const QueryRoot = new graphql.GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    hello: {
      type: graphql.GraphQLString,
      resolve: () => "This is the graphQL API for REFLOW CLUJ"
    },
    meters: {
      type: new graphql.GraphQLList(Meter),
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return client.query(sql)
        })
      }
    },
    meter: {
      type: Meter,
      args: { device_id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return client.query(sql)
        })
      }
    },
    measurement: {
      type: Meter,
      args: { id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) } },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, sql => {
          return client.query(sql)
        })
      }
    }
  })
})

const MutationRoot = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addMeterValues: {
      type: Meter,
      args: {
        device_id: { type: graphql.GraphQLNonNull(graphql.GraphQLInt) },
        active_energy_l1: { type: graphql.GraphQLNonNull(graphql.GraphQLFloat) },
        active_energy_l2: { type: graphql.GraphQLNonNull(graphql.GraphQLFloat) },
        active_energy_l3: { type: graphql.GraphQLNonNull(graphql.GraphQLFloat) },
        time_stamp: { type: graphql.GraphQLNonNull(graphql.GraphQLString) }
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          return (await client.query("INSERT INTO meter (device_id, active_energy_l1, active_energy_l2, active_energy_l3, time_stamp) VALUES ($1, $2, $3, $4, $5) RETURNING *", [args.device_id, args.active_energy_l1, args.active_energy_l2, args.active_energy_l3, args.time_stamp])).rows[0]
        } catch (err) {
          throw new Error("Failed to insert new meter value")
        }
      }
    }
  })
})

const schema = new graphql.GraphQLSchema({
  query: QueryRoot,
  mutation: MutationRoot
});

// Create the Express app
const app = express();
const port = process.env.API_PORT;
var memoryStore = new session.MemoryStore();
const keycloak = require('./keycloak-config.js').initKeycloak(memoryStore);

// Set session
app.use(session({
  secret: 'some_secret',
  resave: false,
  saveUninitialized: true,
  store: memoryStore }));

app.use(keycloak.middleware());

app.use(
  '/',
  keycloak.protect(process.env.KEYCLOAK_ALLUSER_LIST.split(", ")),
  graphqlHTTP({
    schema: schema,
    graphiql: true
  })
);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)}
);

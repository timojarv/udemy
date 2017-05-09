const express = require("express");
const app = express();

const expressGraphQL = require("express-graphql");

const schema = require("./schema/schema");

app.use('/graphql', expressGraphQL({
    graphiql: true,
    schema
}))

app.listen(4000, () => {
    console.log("Server listening on port 4000");
});
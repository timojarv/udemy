const GraphQL = require("graphql");
const axios = require("axios");

const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = GraphQL;

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve: (parentValue, args) =>
                axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                    .then(r => r.data)
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve: (parentValue, args) =>
                axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then(({data}) => data)
        },
        friends: {
            type: new GraphQLList(UserType),
            resolve: (parentValue, args) => parentValue.friends.map(id =>
                axios.get(`http://localhost:3000/users/${id}`).then(r => r.data)
            )
        }
    })
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve: (parentValue, args) => axios.get(`http://localhost:3000/users/${args.id}`)
                .then(({data}) => data)
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve: (parentValue, args) => axios.get(`htp://localhost:3000/companies/${args.id}`)
                .then(({data}) => data)
        }
    }
});

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addUser: {
            type: UserType,
            args: {
                firstName: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) },
                companyId: { type: GraphQLString }
            },
            resolve: (parentValue, { firstName, age }) =>
                axios.post(`http://localhost:3000/users`, { firstName, age })
                    .then(r => r.data)
        },
        deleteUser: {
            type: UserType,
            args: { id: { type: new GraphQLNonNull(GraphQLString) } },
            resolve: (parentValue, args) =>
                axios.delete(`http://localhost:3000/users/${args.id}`)
                    .then(r => r.data)
        },
        editUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                firstName: { type: GraphQLString },
                age: { type: GraphQLInt },
                companyId: { type: GraphQLString }
            },
            resolve: (parentValue, args) =>
                axios.patch(`http://localhost:3000/users/${args.id}`, args)
                    .then(r => r.data)
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});
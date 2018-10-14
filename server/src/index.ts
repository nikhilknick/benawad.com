import { ApolloServer, gql, IResolvers } from "apollo-server-express";
import express from "express";
import path from "path";

import { INDEX_NAME, INDEX_TYPE, getEsClient } from "./es-client";

const typeDefs = gql`
  type Video {
    id: ID!
    title: String!
    thumbnail: String
  }

  type Query {
    search(query: String!): [Video!]!
  }
`;

const resolvers: IResolvers = {
  Video: {
    id: parent => parent.vidId,
    thumbnail: (parent, _, { req }) =>
      `${
        process.env.NODE_ENV === "production"
          ? "https://www.benawad.com"
          : "localhost:4000"
      }/images/${parent.vidId}.jpg`
  },
  Query: {
    search: async (_, { query }, { esClient }) => {
      const results = await esClient.search({
        index: INDEX_NAME,
        type: INDEX_TYPE,
        body: {
          suggest: {
            titleSuggester: {
              prefix: query,
              completion: {
                field: "titleSuggest",
                // size: size,
                fuzzy: {
                  fuzziness: "auto"
                }
              }
            }
          }
        }
      });

      return (results as any).suggest.titleSuggester[0].options.map(
        (x: any) => x._source
      );
    }
  }
};

async function main() {
  const esClient = await getEsClient();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }: any) => ({ req, esClient })
  });

  const app = express();

  app.use("/images", express.static(path.join(__dirname, "../images")));

  server.applyMiddleware({ app });

  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
}

main();

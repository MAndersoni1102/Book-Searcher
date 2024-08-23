import "./App.css";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";

// Get the GraphQL endpoint from environment variables
const GRAPHQL_ENDPOINT =
  import.meta.env.VITE_GRAPHQL_ENDPOINT || "http://localhost:3001/graphql";

// Construct our main GraphQL API endpoint.
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Define the custom cache with merge function.
const cache = new InMemoryCache({
  typePolicies: {
    User: {
      fields: {
        savedBooks: {
          merge(existing = [], incoming = []) {
            const existingBooks = new Map(
              existing.map((book) => [book.bookId, book])
            );
            const incomingBooks = new Map(
              incoming.map((book) => [book.bookId, book])
            );

            return [...existingBooks.values(), ...incomingBooks.values()];
          },
        },
      },
    },
  },
});

// Create Apollo Client instance with the custom cache.
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Navbar />
      <Outlet />
    </ApolloProvider>
  );
}

export default App;
import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';
import { PolymerApollo } from 'polymer-apollo';

const apolloClient = new ApolloClient(meteorClientConfig());
window.PolymerApolloBehavior = new PolymerApollo({ apolloClient });

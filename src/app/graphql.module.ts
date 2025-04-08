import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';
import { HttpClientModule } from '@angular/common/http';

export const createApollo = (httpLink: HttpLink) => ({
  cache: new InMemoryCache(),
  link: httpLink.create({ uri: 'http://localhost:4000/graphql' }) // ✅ change to your backend URL if needed
});

export const graphqlConfig = [
  HttpClientModule,
  {
    provide: APOLLO_OPTIONS,
    useFactory: createApollo,
    deps: [HttpLink]
  }
];

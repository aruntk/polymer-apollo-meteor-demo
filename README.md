# Polymer-Apollo Meteor Demo

Github User API Meteor Graphql App Using [polymer-apollo](https://github.com/aruntk/polymer-apollo)
--

## Instructions

`bower install`

`meteor npm install`

`./run.sh`

graphiql link - [http://localhost:3000/graphiql](http://localhost:3000/graphiql?query=query%20gith(%24user%3AString!)%7B%0A%20%20github(username%3A%24user)%7B%0A%20%20%20%20id%2C%0A%20%20%20%20name%2C%0A%20%20%20%20public_repos%0A%20%20%7D%0A%7D&operationName=gith&variables=%7B%0A%20%20%22user%22%3A%20%22aruntk%22%0A%7D)

## Usage

### Server

#### Setting Up Apollo Graphql Server

https://github.com/aruntk/polymer-apollo-meteor-demo/blob/master/server/apollo.js

```js
// /server/apollo.js

import { createApolloServer } from 'meteor/apollo';
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools';

import { typeDefs } from '/imports/api/schema';
import { resolvers } from '/imports/api/resolvers';

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

createApolloServer({
  schema,
});
```

#### Schema

https://github.com/aruntk/polymer-apollo-meteor-demo/blob/master/imports/api/schema.js

```js
/imports/api/schema.js

export const typeDefs = [`
type github {
  login: String
  id: String
...
  created_at: String
  updated_at: String
}
type Query {
  github(username: String!) : github
}
schema {
  query: Query
}
`];

```

#### Resolver

https://github.com/aruntk/polymer-apollo-meteor-demo/blob/master/imports/api/resolvers.js

```
///imports/api/resolvers.js

import { HTTP } from "meteor/http";
export const resolvers = {
  Query: {
    github(root, { username }, context) {
      return new Promise((resolve,reject) => {
        HTTP.call("GET", `https://api.github.com/users/${username}`,{
          headers:{
            "User-Agent": "meteor-polymer-apollo-demo"
          }
        },
          (error,result)=>{
            if(error){
              return reject(error);
            }
            return resolve(result.data);
          }
        );
      });
    },
  },
};
```

### Client

#### Creating PolymerApolloBehavior

https://github.com/aruntk/polymer-apollo-meteor-demo/blob/master/imports/startup/client/apollo.js

```js

// /imports/startup/client/apollo.js

import ApolloClient from 'apollo-client';
import { meteorClientConfig } from 'meteor/apollo';
import { PolymerApollo } from 'polymer-apollo';

const apolloClient = new ApolloClient(meteorClientConfig());
window.PolymerApolloBehavior = new PolymerApollo({apolloClient});

```

#### Creating a Polymer element

https://github.com/aruntk/polymer-apollo-meteor-demo/blob/master/imports/ui/components/apollo-test.html

```html

<!-- /imports/ui/components/apollo-test.html -->

<dom-module id="apollo-test">
  <template>
    <style>
...
    </style>
    <div class="apollo">
      <div class="layout horizontal">
        <iron-a11y-keys id="a11y" target="[[target]]" keys="enter" on-keys-pressed="fetch"></iron-a11y-keys>
        <paper-input class="flex" id="input" label="Github Username" value="[[username]]"></paper-input>
        <paper-button on-tap="fetch">Fetch</paper-button>
      </div>
      <div class="vertical layout center">
        <paper-spinner active="{{loading}}">
        </paper-spinner>
        <div class="vertical layout center center-justified contents" hidden="{{error}}">
          <img src="{{github.avatar_url}}" hidden="{{!github.avatar_url}}" class="avatar"/>
          <div hidden="{{!github.name}}">Name: [[github.name]]</div>
          <div hidden="{{!github.html_url}}">Profile : 
            <a href="[[github.html_url]]">[[github.html_url]]</a>
          </div>
          <div hidden="{{!github.public_repos}}">Repos : [[github.public_repos]]</div>
        </div>
        <div class="vertical layout center" hidden="{{!error}}">
          {{error}}
        </div>
      </div>
    </div>
  </template>
</dom-module>

```

```js
// /imports/ui/components/apollo-test.html
import gql from 'graphql-tag';
Polymer({
  is:"apollo-test",
  behaviors:[PolymerApolloBehavior],
  properties:{
    github:{
      type:Object,
      value:{}
    },
    username:{
      type:String,
      value:"aruntk",
    },
    loading:Boolean,
    error:String,
    target: {
      type: Object,
      value: function() {
        return this.$.input;
      }
    },
  },

  apollo: {
    // Query with parameters
    github: {
      query: gql`query github($username: String!) {
        github(username: $username){
          avatar_url,
          html_url,
          name,
          public_repos
        }
      }`,
      variables: {
        username: 'username'
      },
      error(error){
        this.set("github",{});
        this.set("error",error.message);
      },
      loadingKey:"loading"
        // Additional options here
    },
  },
  fetch:function(){
    const inp = this.$.input.value;
    this.set("error","");
    this.set("username",inp);
  }
});

```

Meteor Polymer integration is done with the help of [Synthesis - Polymer compiler](https://github.com/meteorwebcomponents/synthesis) and [meteor polymer data mixin](https://github.com/meteorwebcomponents/mixin) from [meteorwebcomponents](https://github.com/meteorwebcomponents/mixin) .

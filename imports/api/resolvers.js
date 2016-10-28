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


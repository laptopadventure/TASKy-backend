
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { AuthRequest } from 'src/models/User';

// This is our function we created to verify our user
// This is a special function for express called "Middleware"
// We can simply "use()" this in our server
// When a user is validated, request.user will contain their information
// Otherwise, this will force an error
export function verifyUser(request: Request & AuthRequest, _response: Response, next: NextFunction) {
  if(request.path === "/signup") {
    next()
    return
  }
  try {
    const token = request.headers.get("authorization").split(' ')[1];
    // this console allows me to grab the token so I can use it to test it in ThunderClient
    // make a request from the client-side, get my token back, then test it in ThunderClient
    // we get .verify from jwt - it verifies the user
    jwt.verify(token, getKey, {}, (_error, user) => {      
      request.user = user as any;
      next();
    });
  } catch (error) {
    next();
  }
}

// =============== HELPER METHODS, pulled from the jsonwebtoken documentation =================== //
//                 https://www.npmjs.com/package/jsonwebtoken                                     //

// Define a client, this is a connection to YOUR auth0 account, using the URL given in your dashboard
const client = jwksClient({
  // this url comes from your app on the auth0 dashboard
  jwksUri: process.env.JWKS_URI,
});

// Match the JWT's key to your Auth0 Account Key so we can validate it
function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, function (_err, key) {
    const signingKey = key.getPublicKey()
    callback(null, signingKey);
  });
}

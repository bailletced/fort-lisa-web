import axios from "axios";
import { TJwtBody } from "../authController";
const cache = require("memory-cache");

export const verifyToken = async (jwt: any) => {
  const jwtVerifier = require("jsonwebtoken");
  const jwkToPem = require("jwk-to-pem");

  // We get cached jwk
  let jwk = cache.get("jwk");
  if (jwk === undefined || jwk === null) {
    await fetchJwks()
      .then((jwks) => {
        jwk = jwks.keys[0];
        cache.put("jwk", jwk);
      })
      .catch((err) => {
        console.error(err);
      });
  }
  const pem = jwkToPem(jwk);

  try {
    const decodedJwt = jwtVerifier.verify(jwt, pem, { algorithms: ["RS256"] });
    return decodedJwt as TJwtBody;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const fetchJwks = async (): Promise<any> => {
  const region = process.env.AWS_DEFAULT_REGION;
  const userPoolId = process.env.AWS_COGNITO_POOL_ID;
  return axios
    .get(
      `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
    )
    .then((response) => {
      return response.data;
    });
};

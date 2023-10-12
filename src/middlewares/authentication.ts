import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import HttpError from '@n-errors/HttpError';

export async function expressAuthentication(
  request: express.Request,
  securityName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  scopes?: string[],
): Promise<any> {
  if (securityName === 'api_key') {
    let token;
    if (request.query && request.query.access_token) {
      token = request.query.access_token;
    }

    if (token === 'abc123456') {
      return Promise.resolve({
        id: 1,
        name: 'Ironman',
      });
    }
    return Promise.reject(new HttpError(401, 'Invalid API key'));
  }

  if (securityName === 'jwt') {
    const token = (request.body.token
      || request.query.token
      || request.headers.authorization)?.split(' ')[1];
    return new Promise((resolve, reject) => {
      if (!token) {
        reject(new HttpError(401, 'No token provided!'));
      }
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err: any, decoded: any) => {
        if (err) {
          reject(new HttpError(401, err.message));
        } else {
          // Check if JWT contains all required scopes
          resolve(decoded);
        }
      });
    });
  }

  return Promise.reject(new HttpError(401, 'Unknown security name'));
}

import * as jwt from 'jsonwebtoken';

export async function generateTokens(id: number) {
  try {
    const payload = {
      id,
    };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '15m',
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '7d',
    });
    return await Promise.resolve({ accessToken, refreshToken });
  } catch (error) {
    return await Promise.reject(error);
  }
}

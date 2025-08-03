import { config } from 'dotenv';

config();

export const jwtSecret = process.env.JWT_SECRET || 'secret_key';
export const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';
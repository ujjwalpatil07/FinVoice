import 'dotenv/config';

import dotenv from "dotenv";

dotenv.config()

export const corsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','x-csrf-token','x-request-id']
};

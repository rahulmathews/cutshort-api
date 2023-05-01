import { Response } from 'express';

interface Json {
  success: boolean;
  message: string;
  data: Array<unknown>;
}

type Send<T = Response> = (body?: Json) => T;

export interface ModifiedResponse extends Response {
  json: Send<this>;
}

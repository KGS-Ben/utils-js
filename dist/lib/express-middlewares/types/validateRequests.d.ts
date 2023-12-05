import { NextFunction, Request, Response } from 'express';
export type ExpressMiddleWare = (req: Request, res: Response, next: NextFunction) => void;

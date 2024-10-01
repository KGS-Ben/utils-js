import { HttpStatusCode } from 'axios';
import express, { Request, Response } from 'express';

export const Router = express.Router();

Router.get('/api/ping', async (req: Request, res: Response) => {
    // TODO: We can use that to send another reponse code or status text if we do some health checks
    res.status(HttpStatusCode.Ok).send();
});

import request from 'supertest';
import express, { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { Router } from '../index';

const app = express();
app.use(Router);

describe('GET /api/ping', () => {
    it('should respond with status 200', async () => {
        const res = await request(app).get('/api/ping');
        expect(res.status).toBe(HttpStatusCode.Ok);
    });
});


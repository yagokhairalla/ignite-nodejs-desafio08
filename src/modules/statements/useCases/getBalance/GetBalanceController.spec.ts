import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';

import createConnection from '../../../../database';

let token: string;
let connection: Connection;

describe('Get Balance Controller', () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        await request(app).post('/api/v1/users')
        .send({
            name: 'user test profile',
            email: 'profile@test.com',
            password: 'test'
        });

        const session = await request(app).post('/api/v1/sessions')
        .send({            
            email: 'profile@test.com',
            password: 'test'
        });
        
        token = session.body.token;             
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be get account balance', async () => {
        const response = await request(app).get('/api/v1/statements/balance')
        .set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('statement');
        expect(response.body).toHaveProperty('balance');
    });    

    it('should not be get account balance if token is invalid', async () => {
        const wrongToken = 'wrongtoken';
        
        const response = await request(app).get('/api/v1/statements/balance')
        .set({
            Authorization: `Bearer ${wrongToken}`
        });

        expect(response.status).toBe(401);
        expect(response.body).not.toHaveProperty('statement');
        expect(response.body).not.toHaveProperty('balance');
    }); 
});
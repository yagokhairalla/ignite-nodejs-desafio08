import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';

import createConnection from '../../../../database';

let token: string;
let connection: Connection;

describe('Create Statement Controller', () => {
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

    it('should be make a deposit', async () => {
        const response = await request(app).get('/api/v1/statements/deposit')
        .set({
            Authorization: `Bearer ${token}`
        }).send({
            amount: 100,
            description: 'deposit test description'
        }); 

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.type).toBe('deposit');
    });    

    it('should be able to make a withdraw', async () => {
        const response = await request(app).get('/api/v1/statements/withdraw')
        .set({
            Authorization: `Bearer ${token}`
        }).send({
            amount: 100,
            description: 'withdraw test description'
        }); 

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
        expect(response.body.type).toBe('withdraw');
    });
});
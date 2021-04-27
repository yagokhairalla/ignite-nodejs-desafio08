import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';

import createConnection from '../../../../database';

let statementId: string;
let token: string;
let connection: Connection;

describe('Get Statement Operation Controller', () => {
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

        const statement = await request(app).post('/api/v1/statements/deposit')
        .set({
            Authorization: `Bearer ${token}`
        })
        .send({
            amount: 100,
            description: 'deposit description'
        });
        
        token = session.body.token;  
        statementId = statement.body.id;           
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be get statement operation', async () => {
        const response = await request(app).get(`/api/v1/statements/${statementId}`)
        .set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('amount');
        expect(response.body.id).toBe(statementId);        
    });    

    it('should not be ablet to get statement operation if id does not exists', async () => {
        const wrongId = 'wrong_id';
        
        const response = await request(app).get(`/api/v1/statements/${wrongId}`)
        .set({
            Authorization: `Bearer ${token}`
        });

        expect(response.status).toBe(404);        
    }); 
});
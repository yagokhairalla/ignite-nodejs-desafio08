import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';

import createConnection from '../../../../database';

let token: string;
let connection: Connection;

describe('Show User Profile Controller', () => {
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
        console.log(token);        
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to see user profile', async () => {
        const response = await request(app).get('/api/v1/profile')
        .set({
            Authorization: `Bearer ${token}`
        }); 

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id');
    });    

    it('should not be able to see user profile if token is incorrect', async () => {
        const wrongToken = 'wrongtoken';
        
        const response = await request(app).get('/api/v1/profile')
        .set({
            Authorization: `Bearer ${wrongToken}`
        }); 

        expect(response.status).toBe(401);
        expect(response.body).not.toHaveProperty('id');
        expect(response.body).toEqual({
            message: 'JWT invalid token!'
        });
    });
    
    it('should not be able to see user profile if token is missing', async () => {        
        const response = await request(app).get('/api/v1/profile');

        expect(response.status).toBe(401);
        expect(response.body).not.toHaveProperty('id');
        expect(response.body).toEqual({
            message: 'JWT token is missing!'
        });
    });
});
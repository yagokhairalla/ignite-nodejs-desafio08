import request from 'supertest';
import { Connection } from 'typeorm';
import { app } from '../../../../app';

import createConnection from '../../../../database';

let connection: Connection;
describe('Authenticate User Controller', () => {
    beforeAll(async () => {
        connection = await createConnection();

        await connection.runMigrations();

        await request(app).post('/api/v1/users')
        .send({
            name: 'session test',
            email: 'session@test.com',
            password: 'test'
        });

        
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it('should be able to authenticate user', async () => {
        const response = await request(app).post('/api/v1/sessions')
        .send({
            email: 'session@test.com',
            password: 'test'
        }); 

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it('should not be able to authenticate a user if the password is incorrect', async () => {
        const response = await request(app).post('/api/v1/sessions')
        .send({            
            email: 'session@test.com',
            password: 'incorrect_test'
        }); 

        expect(response.status).toBe(401);
        expect(response.body).not.toHaveProperty('token');
    });

    it('should not be able to authenticate a user if the user is incorrect', async () => {
        const response = await request(app).post('/api/v1/sessions')
        .send({            
            email: 'session_incorrect@test.com',
            password: 'test'
        }); 

        expect(response.status).toBe(401);
        expect(response.body).not.toHaveProperty('token');
    });
});
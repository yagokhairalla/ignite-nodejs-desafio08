import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { OperationType } from "../../entities/Statement";

let usersRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;
let statementsRepository: InMemoryStatementsRepository;


describe('Get Balance Use Case', () => {
    beforeEach(() => {
        statementsRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);        
    });

    it('should be able to get balance', async () => {
        const user = await usersRepository.create({
            email: 'teste@mail.com',
            name: 'test user',
            password: '1234'
        });
        
        const balance = await getBalanceUseCase.execute({
            user_id: user.id as string            
        });        

        expect(balance).toHaveProperty('balance');        
        expect(balance).toHaveProperty('statement');
        expect(balance.statement.length).toBe(0);
    });
    
    it('should not be able get a balance for a non-existing user', async () => {
        expect( async () => {
            await usersRepository.create({
                email: 'teste@mail.com',
                name: 'test user',
                password: '1234'
            });

            const statement = await getBalanceUseCase.execute({
                user_id: 'non-existing-user'            
            });
            
        }).rejects.toBeInstanceOf(GetBalanceError);       
    });
});
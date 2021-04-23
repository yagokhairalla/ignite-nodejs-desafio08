import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { OperationType } from "../../entities/Statement";

let usersRepository: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;
let statementsRepository: InMemoryStatementsRepository;


describe('Create Statement Use Case', () => {
    beforeEach(() => {
        statementsRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository);        
    });

    it('should be able to create a statement operation', async () => {
        const user = await usersRepository.create({
            email: 'teste@mail.com',
            name: 'test user',
            password: '1234'
        });
        
        const statement = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            description: 'teste description',
            amount: 100            
        });

        expect(statement).toHaveProperty('id');        
    });
    
    it('should not be able to create a statement (withdraw) if the user has insufficient funds', async () => {
        expect( async () => {
            const user = await usersRepository.create({
                email: 'teste@mail.com',
                name: 'test user',
                password: '1234'
            });

            await createStatementUseCase.execute({
                user_id: user.id as string,
                type: OperationType.DEPOSIT,
                description: 'teste description',
                amount: 100            
            });

            const statement = await createStatementUseCase.execute({
                user_id: user.id as string,
                type: OperationType.WITHDRAW,
                description: 'teste description',
                amount: 200            
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);       
    });

    it('should not be able to create a statement for a non-existing user', async () => {
        expect( async () => {
            await usersRepository.create({
                email: 'teste@mail.com',
                name: 'test user',
                password: '1234'
            });

            await createStatementUseCase.execute({
                user_id: 'non-existing-id',
                type: OperationType.DEPOSIT,
                description: 'teste description',
                amount: 100            
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);       
    });    
});
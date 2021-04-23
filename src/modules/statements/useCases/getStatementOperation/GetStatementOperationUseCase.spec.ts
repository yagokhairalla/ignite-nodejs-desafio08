import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { OperationType } from "../../entities/Statement";

let usersRepository: InMemoryUsersRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let statementsRepository: InMemoryStatementsRepository;
let createStatementRepository: InMemoryStatementsRepository;


describe('Get Statement Operation Use Case', () => {
    beforeEach(() => {
        statementsRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();
        statementsRepository = new InMemoryStatementsRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);        
    });

    it('should be able to get statement operation', async () => {
        const user = await usersRepository.create({
            email: 'teste@mail.com',
            name: 'test user',
            password: '1234'
        });

        const statement = await statementsRepository.create({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            description: 'test',
            amount: 100
        });
        
        const statementOperation = await getStatementOperationUseCase.execute({
            user_id: user.id as string,
            statement_id: statement.id as string
        });        
        
        expect(statementOperation.id).toEqual(statement.id);
        expect(statementOperation.amount).toEqual(100);        
    });
    
    it('should not be able get a statement operation for a non-existing user', async () => {
        expect( async () => {
            const user = await usersRepository.create({
                email: 'teste@mail.com',
                name: 'test user',
                password: '1234'
            });
    
            const statement = await statementsRepository.create({
                user_id: user.id as string,
                type: OperationType.DEPOSIT,
                description: 'test',
                amount: 100
            });
            
            const statementOperation = await getStatementOperationUseCase.execute({
                user_id: 'non-existing-user',
                statement_id: statement.id as string
            });            
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);       
    });

    it('should not be able get a non-existing statement operation', async () => {
        expect( async () => {
            const user = await usersRepository.create({
                email: 'teste@mail.com',
                name: 'test user',
                password: '1234'
            });
    
            const statement = await statementsRepository.create({
                user_id: user.id as string,
                type: OperationType.DEPOSIT,
                description: 'test',
                amount: 100
            });
            
            const statementOperation = await getStatementOperationUseCase.execute({
                user_id: user.id as string,
                statement_id: 'non-existing-statement'
            });            
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);       
    });
});
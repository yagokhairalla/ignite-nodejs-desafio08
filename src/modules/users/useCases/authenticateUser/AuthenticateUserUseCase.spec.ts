import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;
let usersRepository: InMemoryUsersRepository;

describe('Authenticate User Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    });

    it('should be able to authenticate an existing user', async () => {
        const user = await createUserUseCase.execute({
            name: 'Name test',
            email: 'test@mail.com',
            password: 'password'
        });

        const authenticate = await authenticateUserUseCase.execute({            
            email: 'test@mail.com',
            password: 'password'
        });

        expect(authenticate).toHaveProperty('token');
    }); 
    
    it('should not be able to authenticate if email is incorrect', () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: 'Name test',
                email: 'test@mail.com',
                password: 'password'
            });
    
            const authenticate = await authenticateUserUseCase.execute({            
                email: 'email_errado@mail.com',
                password: 'password'
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);        
    });

    it('should not be able to authenticate if password is incorrect', () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: 'Name test',
                email: 'test@mail.com',
                password: 'password'
            });
    
            const authenticate = await authenticateUserUseCase.execute({            
                email: 'test@mail.com',
                password: 'password_errado'
            });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);        
    });
});
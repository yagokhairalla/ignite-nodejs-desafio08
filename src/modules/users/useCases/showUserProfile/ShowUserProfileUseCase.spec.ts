import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let usersRepository: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile Use Case', () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();        
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository); 
        createUserUseCase = new CreateUserUseCase(usersRepository);        
    });

    it('should be able to return info from the authenticated user', async () => {
        const user = await createUserUseCase.execute({
            name: 'Name test',
            email: 'test@mail.com',
            password: 'password'
        });

        const profile = await showUserProfileUseCase.execute(user.id as string);

        expect(profile.name).toEqual(user.name);
        expect(profile.email).toEqual(user.email);
        expect(profile).toHaveProperty('password');        
    });
    
    it('should not be able to return info from a non-existing user', async () => {
        expect(async () => {
            await createUserUseCase.execute({
                name: 'Name test',
                email: 'test@mail.com',
                password: 'password'
            });
    
            await showUserProfileUseCase.execute('123');
        }).rejects.toBeInstanceOf(ShowUserProfileError);       
    });
    
});
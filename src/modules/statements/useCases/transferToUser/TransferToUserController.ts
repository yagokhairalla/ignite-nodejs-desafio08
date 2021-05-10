import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { TransferToUserUseCase } from './TransferToUserUseCase';

class TransferToUserController {
    async execute(request: Request, response: Response): Promise<Response> {
        const { amount, description } = request.body;
        const { id } = request.user;
        const { user_id } = request.params;

        const transferToUserUseCase = container.resolve(TransferToUserUseCase);
        await transferToUserUseCase.execute({
            sender_id: id,
            amount,
            description,
            recipient_id: user_id
        });

        return response.status(201).send();
    }
}

export { TransferToUserController }
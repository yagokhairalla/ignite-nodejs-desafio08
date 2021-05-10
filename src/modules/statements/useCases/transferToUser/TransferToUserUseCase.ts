import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import ITransferToUserDTO from "./ITransferToUserDTO";
import { TransferToUserError } from "./TransferToUserError";

@injectable()
class TransferToUserUseCase {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    
        @inject('StatementsRepository')
        private statementsRepository: IStatementsRepository
    ) {}

    async execute({sender_id, recipient_id, amount, description}: ITransferToUserDTO): Promise<void> {
        const senderBalance = await this.statementsRepository.getUserBalance({ user_id: sender_id, with_statement: true });

        if(amount > senderBalance.balance) {
            throw new TransferToUserError.InsufficientFunds();
        }

        const recipient = await this.usersRepository.findById(recipient_id);

        if(!recipient) {
            throw new TransferToUserError.RecipientNotFound();
        }

        if(recipient.id === sender_id) {
            throw new TransferToUserError.TransferToYourself();
        }

        const sender = await this.usersRepository.findById(sender_id);
        // Nao precisa verificar, pois ja vem do middleware

        const amountNegativoParaSender = Math.abs(amount) * -1;

        // cria statement para sender
        await this.statementsRepository.create({
            user_id: sender_id,
            amount: amountNegativoParaSender,
            description,
            type: OperationType.TRANSFER
        });

        
        // cria statement para recipient
        await this.statementsRepository.create({
            user_id: recipient_id,
            description,
            amount: amount,
            type: OperationType.TRANSFER,
            sender_id
        });
    }
}

export { TransferToUserUseCase }
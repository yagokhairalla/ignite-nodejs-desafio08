import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferToUserError {
  export class RecipientNotFound extends AppError {
    constructor() {
      super('Recipient not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class TransferToYourself extends AppError {
    constructor() {
      super('You cannot transfer to yourself', 400);
    }
  }
}

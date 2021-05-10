export default interface ITransferToUserDTO {
    sender_id: string;
    recipient_id: string;
    amount: number;    
    description: string;
}
import { IsNotEmpty, IsString } from "class-validator";

export class TransactionDto {
    @IsNotEmpty()
    @IsString()
    public hash: string;

    @IsNotEmpty()
    @IsString()
    public from: string;

    @IsNotEmpty()
    @IsString()
    public to: string;

    @IsNotEmpty()
    @IsString()
    public value: string;

    @IsNotEmpty()
    @IsString()
    public blockNumber: string;
}
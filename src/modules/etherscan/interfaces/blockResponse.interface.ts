import { AxiosResponse } from "axios";
import { TransactionDto } from "src/modules/transactions/dtos/transaction.dto";

export interface IBlockResponse extends AxiosResponse {
    data: {
        result: {
            transactions?: TransactionDto[],
        }
    }
}
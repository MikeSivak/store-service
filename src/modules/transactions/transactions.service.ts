import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { TransactionDto } from './dtos/transaction.dto';
import { Transaction } from './trasaction.entity';
import { getArrayAsChunks } from 'src/helpers/chunkArray.helper';


@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    async saveTransactions(transactions: TransactionDto[]): Promise<number> {
        const beforeInsertionCount: number = await this.transactionRepository.count();
        const transactionChunks: Array<TransactionDto>[] = getArrayAsChunks(transactions, 10000);
        try {
            await Promise.all(transactionChunks.map(async (chunk: TransactionDto[]) => {
                return await this.transactionRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Transaction)
                    .values(chunk)
                    .onConflict(`("hash") DO NOTHING`)
                    .returning("id")
                    .execute();
            }));
        } catch (e) {
            Logger.log(e);
        }
        const afterInsertionCount: number = await this.transactionRepository.count();
        const result: number = afterInsertionCount - beforeInsertionCount;

        return result;
    }

    async getTransactionsByBlockNumbers(blockNumbers: string[]): Promise<Transaction[]> {
        return await this.transactionRepository
            .createQueryBuilder('transaction')
            .where('transaction.blockNumber in (:...blockNumbers)', { blockNumbers: [...blockNumbers] })
            .getMany();
    }
}

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

    async saveTransactions(transactions: TransactionDto[]): Promise<any> {
        const chunks = getArrayAsChunks(transactions, 10000);
        let result: any;
        try {
            result = chunks.map(async chunk => {
                await this.transactionRepository
                    .createQueryBuilder()
                    .insert()
                    .into(Transaction)
                    .values(chunk.map(i => i))
                    .onConflict(`("hash") DO NOTHING`)
                    .execute();
            })
        } catch (e) {
            Logger.log(e);
        }
        return result;
    }

    async getTransactionsByBlockNumbers(blockNumbers: string[]): Promise<Transaction[]> {
        return await this.transactionRepository
            .createQueryBuilder('transaction')
            .where('transaction.blockNumber in (:...blockNumbers)', { blockNumbers: [...blockNumbers] })
            .getMany();
    }
}

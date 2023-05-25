import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult } from 'typeorm';
import { TransactionDto } from './transaction.dto';
import { Transaction } from './trasaction.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    async saveTransactions(transactions: TransactionDto[]): Promise<Promise<(TransactionDto & Transaction)[]>> {
        return await this.transactionRepository.save(transactions, { chunk: 10000 });
    }

    async getTransactionsByBlockNumbers(blockNumbers: string[]): Promise<Transaction[]> {
        return await this.transactionRepository
            .createQueryBuilder('transaction')
            .where('transaction.blockNumber in (:...blockNumbers)', { blockNumbers: [...blockNumbers] })
            .getMany();
    }
}

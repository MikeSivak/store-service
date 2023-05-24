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

    async saveTransactions(transactions: TransactionDto[]): Promise<InsertResult> {
        return await this.transactionRepository
            .createQueryBuilder()
            .insert()
            .into(Transaction)
            .values(transactions)
            .execute();
    }
}

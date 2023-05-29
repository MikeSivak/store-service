import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDto } from './dtos/transaction.dto';
import { Transaction } from './trasaction.entity';

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
    ) { }

    async saveTransactions(transactions: TransactionDto[]): Promise<Transaction[]> {
        let result: Transaction[] = [];
        try {
            result = await this.transactionRepository.save(transactions, { chunk: 10000 });
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

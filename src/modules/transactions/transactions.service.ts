import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionDto } from './transaction.dto';
import { Transaction } from './trasaction.entity';

@Injectable()
export class TransactionsService {
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>;

    public createTransaction(body: TransactionDto): Promise<Transaction> {
        const transaction: Transaction = new Transaction();
        
        transaction.from = body.from;
        transaction.to = body.to;
        transaction.value = body.value;
        transaction.blockNumber = body.blockNumber;

        return this.repository.save(transaction);
    }
}

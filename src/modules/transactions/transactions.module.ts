import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './trasaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService, ]
})
export class TransactionsModule { }

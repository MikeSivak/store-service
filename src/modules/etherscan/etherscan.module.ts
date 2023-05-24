import { Module } from '@nestjs/common';
import { EtherscanService } from './etherscan.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  providers: [EtherscanService],
  exports: [EtherscanService],
})
export class EtherscanModule { }

import { Module } from '@nestjs/common';
import { EtherscanService } from './etherscan.service';
import { TransactionsModule } from '../transactions/transactions.module';
import { EtherscanController } from './etherscan.controller';

@Module({
  imports: [TransactionsModule],
  providers: [EtherscanService],
  exports: [EtherscanService],
  controllers: [EtherscanController],
})
export class EtherscanModule { }

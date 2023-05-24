import { Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { EtherscanModule } from '../etherscan/etherscan.module';

@Module({
  imports: [EtherscanModule],
  providers: [CronjobsService]
})
export class CronjobsModule { }

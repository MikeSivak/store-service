import { Injectable, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule/dist';
import { EtherscanService } from '../etherscan/etherscan.service';

@Injectable()
export class CronjobsService {
    constructor(
        @Inject(EtherscanService)
        private readonly etherscanService: EtherscanService,
    ) { }

    @Cron(CronExpression.EVERY_MINUTE)
    async saveTransactions() {
        await this.etherscanService.getTransactions();
    }
}

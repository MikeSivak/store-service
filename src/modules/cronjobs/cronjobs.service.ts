import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule/dist';
import { EtherscanService } from '../etherscan/etherscan.service';

@Injectable()
export class CronjobsService {
    constructor(
        @Inject(EtherscanService)
        private readonly etherscanService: EtherscanService,
    ) { }

    @Cron('*/40 * * * * *')
    async saveTransactions() {
        await this.etherscanService.getTransactions();
    }
}

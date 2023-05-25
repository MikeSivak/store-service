import { Controller, Get } from '@nestjs/common';
import { EtherscanService } from './etherscan.service';

@Controller('etherscan')
export class EtherscanController {
    constructor(
        private readonly etherscanService: EtherscanService,
    ) { }

    @Get('/max-sum-block')
    async getBlockAddress(): Promise<any> {
        return await this.etherscanService.getBlockAddress();
    }
}

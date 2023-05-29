import { Controller, Get } from '@nestjs/common';
import { EtherscanService } from './etherscan.service';
import { BlockAddress } from './types/blockAddress.type';

@Controller('etherscan')
export class EtherscanController {
    constructor(
        private readonly etherscanService: EtherscanService,
    ) { }

    @Get('/max-sum-block')
    async getBlockAddress(): Promise<BlockAddress> {
        return await this.etherscanService.getBlockAddress();
    }
}

import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { EtherscanService } from './modules/etherscan/etherscan.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(EtherscanService)
    private readonly ethSerivce: EtherscanService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/getTransactions')
  async start(): Promise<any> {
    return await this.ethSerivce.getBlockAddress();
    // return await this.ethSerivce.getTransactions();
  }
}

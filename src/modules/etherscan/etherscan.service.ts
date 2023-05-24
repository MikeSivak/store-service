import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/trasaction.entity';
import { InsertResult } from 'typeorm';


@Injectable()
export class EtherscanService {
    private etherscanApi: string;
    private apiKey: string;
    private limiter: Bottleneck;
    constructor(
        @Inject(ConfigService)
        private readonly config: ConfigService,
        @Inject(TransactionsService)
        private readonly transactionsService: TransactionsService,
    ) {
        this.etherscanApi = config.get<string>('ETHERSCAN_API');
        this.apiKey = config.get<string>('ETHERSCAN_API_KEY');
        this.limiter = new Bottleneck({
            minTime: 333,
            maxConcurrent: 40,
        })
    }

    scheduleRequest(endpoint: string): Promise<AxiosResponse<any, any>> {
        return this.limiter.schedule(() => {
            return axios.get(endpoint);
        })
    }

    async getBlockNumbers(numOfBlocks: number): Promise<string[]> {
        const endBlock: number = (await axios.get(
            `${this.etherscanApi}?module=proxy&action=eth_blockNumber`
        )).data.result;

        const startBlock: number = endBlock - numOfBlocks;
        const diff: number = endBlock - startBlock;

        return Array.from({ length: diff }, (v, k) => (k + startBlock + 1).toString(16));
    }

    async getTransactions(): Promise<string> {
        const blockNumbers: string[] = await this.getBlockNumbers(100);

        const blockPromises = blockNumbers.map((num: string) => {
            let endpoint = `${this.etherscanApi}?module=proxy&action=eth_getBlockByNumber&tag=${num}&boolean=true&apikey=${this.apiKey}`;
            return this.scheduleRequest(endpoint);
        });

        const result: Transaction[] = (await Promise.all(blockPromises)).map((block: AxiosResponse<any, any>) => {
            const transactions: any = block.data.result.transactions?.map((t: any) => {
                return {
                    hash: t.hash,
                    blockNumber: t.blockNumber,
                    from: t.from,
                    to: t.to,
                    value: t.value
                }
            });
            return transactions;
        })[0];

        const savedTransactions: InsertResult = await this.transactionsService.saveTransactions(result);

        Logger.log(`${savedTransactions.identifiers.length} transactions were saved in the database`);

        return savedTransactions
            ? `${savedTransactions.identifiers.length} new transactions were saved in the database`
            : `No new transactions`;
    }
}

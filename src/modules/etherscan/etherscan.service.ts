import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import Bottleneck from 'bottleneck';
import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/trasaction.entity';
import { TransactionDto } from '../transactions/dtos/transaction.dto';
import { BlockSum } from './types/blockSum.type';
import { IBlockResponse } from './interfaces/blockResponse.interface';
import { BlockAddress } from './types/blockAddress.type';


@Injectable()
export class EtherscanService {
    private readonly etherscanApi: string;
    private readonly apiKey: string;
    private readonly limiter: Bottleneck;
    constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService,
        @Inject(TransactionsService)
        private readonly transactionsService: TransactionsService,
    ) {
        this.etherscanApi = configService.get<string>('ETHERSCAN_API');
        this.apiKey = configService.get<string>('ETHERSCAN_API_KEY');
        this.limiter = new Bottleneck({
            minTime: 333,
            maxConcurrent: 40,
        })
    }

    async scheduleRequest(endpoint: string): Promise<IBlockResponse> {
        return this.limiter.schedule(() => {
            return axios.get(endpoint);
        })
    }

    async getHexBlockNumbers(numOfBlocks: number): Promise<string[]> {
        const endBlock: number = (await axios.get(
            `${this.etherscanApi}?module=proxy&action=eth_blockNumber&apikey=${this.apiKey}`
        )).data.result;

        const startBlock: number = endBlock - numOfBlocks;
        const diff: number = endBlock - startBlock;

        return Array.from({ length: diff }, (v, k) => (k + startBlock + 1).toString(16)).map(num => `0x${num}`);
    }

    async getTransactions(): Promise<void> {
        const blockNumbers: string[] = await this.getHexBlockNumbers(100);
        const blockPromises: Promise<IBlockResponse>[] = blockNumbers.map((num: string) => {
            let endpoint: string = `${this.etherscanApi}?module=proxy&action=eth_getBlockByNumber&tag=${num}&boolean=true&apikey=${this.apiKey}`;
            return this.scheduleRequest(endpoint);
        });

        const transactions: TransactionDto[] = [];

        (await Promise.all(blockPromises)).map((block: IBlockResponse) => {
            block.data.result.transactions?.map((t: TransactionDto) => {
                transactions.push(t)
            });
        });

        // const savedTransactions: Transaction[] = await this.transactionsService.saveTransactions(transactions);

        // savedTransactions
        //     ? Logger.log(`${savedTransactions.length} new transactions were saved in the database`)
        //     : Logger.log('No new transactions');

        await this.transactionsService.saveTransactions(transactions);
    }

    async getBlockAddress(): Promise<BlockAddress> {
        let blockNumbers: string[] = await this.getHexBlockNumbers(100);
        const transactions: Transaction[] = await this.transactionsService.getTransactionsByBlockNumbers(blockNumbers);
        const amountArr: BlockSum[] = [];

        for (let i: number = 0; i < blockNumbers.length; i++) {
            let sum: number = 0;
            transactions.map((t: Transaction) => {
                if (blockNumbers[i] === t.blockNumber) {
                    sum += parseInt(t.value);
                }
            });
            amountArr.push({
                blockNumber: blockNumbers[i],
                sum: sum,
            });
            sum = 0;
        }

        let max: number = 0;
        let address: string;
        for (let i: number = 0; i < amountArr.length; i++) {
            if (amountArr[i].sum > max) {
                max = amountArr[i].sum;
                address = amountArr[i].blockNumber;
            }
        }

        return { address };
    }
}

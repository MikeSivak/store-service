import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosResponse } from 'axios';
import Bottleneck from 'bottleneck';
import { TransactionsService } from '../transactions/transactions.service';
import { Transaction } from '../transactions/trasaction.entity';
import { TransactionDto } from '../transactions/transaction.dto';


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

    async getHexBlockNumbers(numOfBlocks: number): Promise<string[]> {
        const endBlock: number = (await axios.get(
            `${this.etherscanApi}?module=proxy&action=eth_blockNumber&apikey=${this.apiKey}`
        )).data.result;

        const startBlock: number = endBlock - numOfBlocks;
        const diff: number = endBlock - startBlock;

        return Array.from({ length: diff }, (v, k) => (k + startBlock + 1).toString(16));
    }

    async getTransactions(): Promise<string> {
        const blockNumbers: string[] = await this.getHexBlockNumbers(100);
        const blockPromises = blockNumbers.map((num: string) => {
            let endpoint = `${this.etherscanApi}?module=proxy&action=eth_getBlockByNumber&tag=${num}&boolean=true&apikey=${this.apiKey}`;
            return this.scheduleRequest(endpoint);
        });

        const transactions: TransactionDto[] = [];

        (await Promise.all(blockPromises)).map((block: AxiosResponse<any, any>) => {
            block.data.result.transactions?.map((t: TransactionDto) => {
                const transaction: TransactionDto = {
                    hash: t.hash,
                    blockNumber: t.blockNumber,
                    from: t.from,
                    to: t.to,
                    value: t.value
                }
                transactions.push(transaction)
            });
        });

        const savedTransactions: Transaction[] = await this.transactionsService.saveTransactions(transactions);

        Logger.log(`${savedTransactions.length} transactions were saved in the database`);

        return savedTransactions
            ? `${savedTransactions.length} new transactions were saved in the database`
            : `No new transactions`;
    }

    async getBlockAddress(): Promise<any> {
        let blockNumbers: string[] = (await this.getHexBlockNumbers(100)).map(num => `0x${num}`);
        const transactions: Transaction[] = await this.transactionsService.getTransactionsByBlockNumbers(blockNumbers);
        const amountArr: any = [];

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

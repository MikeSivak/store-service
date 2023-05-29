import { Module } from '@nestjs/common';
import { CronjobsModule } from './modules/cronjobs/cronjobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeormService } from './shared/typeorm/typeorm.service';
import { ConfigModule } from '@nestjs/config/dist';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtherscanModule } from './modules/etherscan/etherscan.module';

@Module({
  imports: [
    CronjobsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TransactionsModule,
    TypeOrmModule.forRootAsync({ useClass: TypeormService }),
    EtherscanModule,
  ],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronjobsModule } from './modules/cronjobs/cronjobs.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeormService } from './shared/typeorm/typeorm.service';
import { ConfigModule } from '@nestjs/config/dist';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    CronjobsModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    TransactionsModule,
    TypeOrmModule.forRootAsync({ useClass: TypeormService }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    TypeormService
  ],
})
export class AppModule { }

import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule/dist';

@Injectable()
export class CronjobsService {
    @Cron('*/1 * * * * *')
    check() {
        // console.log('CHECK')
    }
}

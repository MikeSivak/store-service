import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class TypeormService implements TypeOrmOptionsFactory {
    constructor(
        @Inject(ConfigService)
        private readonly configService: ConfigService,
    ) { }

    async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
        return {
            type: 'postgres',
            host: this.configService.get<string>('DATABASE_HOST'),
            port: this.configService.get<number>('DATABASE_PORT'),
            database: this.configService.get<string>('DATABASE_NAME'),
            username: this.configService.get<string>('DATABASE_USER'),
            password: this.configService.get<string>('DATABASE_PASSWORD'),
            entities: ['dist/**/*.entity.{ts,js}'],
            migrations: ['dist/migrations/*.{ts,js}'],
            migrationsTableName: 'typeorm_migrations',
            logger: 'file',
            synchronize: this.configService.get<string>('NODE_ENV') !== 'prod' ? true : false,
        }
    }
}

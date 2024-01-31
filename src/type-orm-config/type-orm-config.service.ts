import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return this.configService.get<string>('NODE_ENV') === 'production'
      ? {
          type: 'oracle',
          host: this.configService.get<string>('DB_HOST'),
          port: this.configService.get<number>('DB_PORT'),
          username: this.configService.get<string>('DB_USERNAME'),
          password: this.configService.get<string>('DB_PASSWORD'),
          database: this.configService.get<string>('DB_DATABASE'),
          sid: this.configService.get<string>('DB_SID'),
          autoLoadEntities: true,
          // synchronize: true,
        }
      : {
          type: 'sqlite',
          database: 'dev.db',
          autoLoadEntities: true,
          logging: true,
          // synchronize: true,
          // dropSchema: true,
        };
  }
}

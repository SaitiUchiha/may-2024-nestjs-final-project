import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import configuration from './common/configs/configuration';
import { DatabaseModule } from './database/database.module';
import { RedisModule } from '@webeleon/nestjs-redis';
import { AuthModule } from './modules/auth/auth.module';
import { PostModule } from './modules/post/post.module';

@Module({
  imports: [
    RedisModule.forRoot({
      url: `redis://127.0.0.1:6379`,
    }),
    AuthModule,
    PostModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

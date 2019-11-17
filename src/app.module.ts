import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote/vote.entity';
import { VoteService } from './vote/vote.service';
import { VoteModule } from './vote/vote.module';

@Module({
  imports: [
    AuthModule,
    VoteModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'vote.db',
      entities: [Vote],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, VoteService],
})
export class AppModule { }

import { Module } from '@nestjs/common';
import { ContentsController } from './contents.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contents } from './contents.entity';
import { ContentsService } from './contents.service';

@Module({
  imports: [TypeOrmModule.forFeature([Contents])],
  controllers: [ContentsController],
  providers: [ContentsService],
})
export class ContentsModule {}

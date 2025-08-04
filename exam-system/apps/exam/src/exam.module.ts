import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { RedisModule } from '@app/redis';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, CommonModule } from '@app/common';
import { PrismaModule } from '@app/prisma';

// CommonModule把多个服务需要用到module可以放到CommonModule里，各个服务只需要引入CommonModule即可
@Module({
  imports: [RedisModule, PrismaModule, CommonModule],
  controllers: [ExamController],
  providers: [
    ExamService,
    {
      // 添加全局guard守卫
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class ExamModule {}

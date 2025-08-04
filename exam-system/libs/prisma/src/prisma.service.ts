import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    // 在 constructor 里设置 PrismaClient 的 log 参数，也就是打印 sql 到控制台
    super({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
      ],
    });
  }

  // 在 onModuleInit 的生命周期方法里调用 $connect 来连接数据库
  async onModuleInit() {
    await this.$connect();
  }
}

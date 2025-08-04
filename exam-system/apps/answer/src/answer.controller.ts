import { Controller, Get, Inject } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  // 注入exam服务，调用exam服务的方法
  // 这就是RPC（远程过程调用）
  @Inject('EXAM_SERVICE')
  private examClient: ClientProxy;

  @Get()
  async getHello() {
    const value = await firstValueFrom(this.examClient.send('sum', [1, 3, 5]));
    return this.answerService.getHello() + ' ' + value;
  }
}

import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async keys(pattern: string) {
    return await this.redisClient.keys(pattern);
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);

    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
  /**
  回顾下 zset 的命令：

ZADD：往集合中添加成员

ZREM：从集合中删除成员

ZCARD：集合中的成员个数

ZSCORE：某个成员的分数

ZINCRBY：增加某个成员的分数

ZRANK：成员在集合中的排名

ZRANGE：打印某个范围内的成员

ZRANGESTORE：某个范围内的成员，放入新集合

ZCOUNT：集合中分数在某个返回的成员个数

ZDIFF：打印两个集合的差集

ZDIFFSTORE：两个集合的差集，放入新集合

ZINTER：打印两个集合的交集

ZINTERSTORE：两个集合的交集，放入新集合

ZINTERCARD：两个集合的交集的成员个数

ZUNION：打印两个集合的并集

ZUNIONSTORE：两个集合的并集，放回新集合
   */
  async zRankingList(key: string, start: number = 0, end: number = -1) {
    console.log('key', key);
    console.log('start', start);
    console.log('end', end);
    return this.redisClient.zRange(
      key,
      start,
      end,
      // 以下用法需要 redis 6.2 以上版本
      //   , {
      //   REV: true,
      // }
    );
  }

  async zAdd(key: string, members: Record<string, number>) {
    const mems = [];
    for (const key in members) {
      mems.push({
        value: key,
        score: members[key],
      });
    }
    return await this.redisClient.zAdd(key, mems);
  }
}

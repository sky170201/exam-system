import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  Query,
  SetMetadata,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from '@app/email';
import { RedisService } from '@app/redis';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from '@app/common/custom.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    console.log('发送的邮箱地址：address===========', address);

    await this.redisService.set(`captcha_${address}`, code, 5 * 60);

    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Get('aaa')
  @RequireLogin()
  aaa(@UserInfo() userInfo, @UserInfo('username') username) {
    console.log(userInfo, username);
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    if (!address) {
      throw new BadRequestException('邮箱地址不能为空');
    }
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(
      `update_password_captcha_${address}`,
      code,
      10 * 60,
    );

    await this.emailService.sendMail({
      to: address,
      subject: '更改密码验证码',
      html: `<p>你的更改密码验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('update_password')
  async updatePassword(@Body() passwordDto: UpdateUserPasswordDto) {
    return this.userService.updatePassword(passwordDto);
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);

    /**
     这里就不用双 token 的方式来刷新了，而是用单 token 无限续期来做。
     也就是当访问接口的时候，就返回一个新的 token。
     这样只要它在 token 过期之前，也就是 7 天内访问了一次系统，那就会刷新换成新 token。
     超过 7 天没访问，那就需要重新登录了。
     */
    return {
      user,
      token: this.jwtService.sign(
        {
          userId: user.id,
          username: user.username,
        },
        {
          expiresIn: '7d', // token的过期时间7天
        },
      ),
    };
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    // delete registerUser.captcha;

    // TODO 默认会插入createTime和updateTime？
    // return await this.userService.create(registerUser);
    return await this.userService.register(registerUser);
  }
}

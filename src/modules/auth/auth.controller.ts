import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse } from '@nestjs/swagger';
import {
  AuthDto,
  AuthQueryDto,
  LogInDto,
  SingUpDto,
  UpdateAuthDto,
} from './dto/auth.dto';
import { JWTAuthGuard } from '../../common/guards/jwt-auth.guard';
import { User } from '../../database/entities/user.entity';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { UserSearchField } from '../../common/constants/enums';
import { BaseQueryDto } from '../../common/validators/base.query.validator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @ApiOkResponse({ type: SingUpDto })
  @Post('/signUp')
  create(@Body() body: AuthDto): Promise<{ accessToken: string }> {
    return this.authService.signUpUser(body);
  }

  @Post('/log-in')
  logIn(@Body() body: LogInDto): Promise<{ accessToken: string }> {
    return this.authService.login(body);
  }

  @Post('/log-out')
  @UseGuards(JWTAuthGuard)
  logOutUser(@CurrentUser() user: User): Promise<void> {
    return this.authService.logOutUser(user);
  }

  @Patch('/me')
  @UseGuards(JWTAuthGuard)
  updateUser(
    @CurrentUser() user: User,
    @Body() changes: UpdateAuthDto,
  ): Promise<User> {
    return this.authService.update(user, changes);
  }

  @Delete('/me')
  @UseGuards(JWTAuthGuard)
  deleteUser(@CurrentUser() user: User): Promise<void> {
    return this.authService.delete(user);
  }

  @UseGuards(JWTAuthGuard)
  @Get('/list')
  findAll(@Query() query: BaseQueryDto): Promise<AuthQueryDto> {
    return this.authService.findAll(query);
  }
}

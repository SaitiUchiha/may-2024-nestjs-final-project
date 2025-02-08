import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostDto, PostQueryDto } from './dto/post.dto';
import { JWTAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/auth.decorator';
import { User } from '../../database/entities/user.entity';
import { DeleteResult } from 'typeorm';
import { PostEntity } from '../../database/entities/post.entity';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get('/list/:userId')
  findAll(): Promise<PostQueryDto | undefined> {
    return this.postService.findAll();
  }

  @UseGuards(JWTAuthGuard)
  @Post('/create')
  create(
    @CurrentUser() user: User,
    @Body() createPostDto: PostDto,
  ): Promise<PostEntity | undefined> {
    return this.postService.create(user, createPostDto);
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: PostDto,
  ): Promise<PostEntity | undefined> {
    return this.postService.update(id, updatePostDto);
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult | undefined> {
    return this.postService.remove(id);
  }
}

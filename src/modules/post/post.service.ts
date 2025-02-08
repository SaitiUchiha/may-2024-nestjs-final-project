import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostDto, PostQueryDto, UpdatePostDto } from './dto/post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { BaseQueryDto } from '../../common/validators/base.query.validator';
import { PostEntity } from '../../database/entities/post.entity';
import { User } from '../../database/entities/user.entity';

@Injectable()
export class PostService {
  private logger: Logger;
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(user: User, data: PostDto): Promise<PostEntity | undefined> {
    try {
      const post = await this.postRepository.save(
        this.postRepository.create({
          ...data,
          user_id: user.id,
        }),
      );
      return post;
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException('Creation of the post failed.');
    }
  }

  async findAll(query?: BaseQueryDto): Promise<PostQueryDto | undefined> {
    try {
      const options = {
        page: query?.page || 1,
        limit: query?.limit || 10,
      };

      const [entities, total] = await this.postRepository.findAndCount({
        select: {
          title: true,
          description: true,
          id: true,
        },
        relations: {
          user: true,
        },
        skip: (options.page - 1) * options.limit,
        take: options.limit,
      });

      return {
        page: options.page,
        pages: Math.ceil(total / options.limit),
        countItems: total,
        entities: entities,
      };
    } catch (error) {
      console.log(error);
    }
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostEntity | undefined> {
    try {
      const editedPost = await this.postRepository.findOneBy({ id: id });

      if (!editedPost) {
        throw new NotFoundException('Post not found');
      }

      editedPost.title = updatePostDto.title;
      editedPost.description = updatePostDto.description;
      editedPost.body = updatePostDto.body;

      await this.postRepository.save(editedPost);

      return editedPost;
    } catch (error) {
      console.log(error);
    }
  }

  async remove(id: string): Promise<DeleteResult | undefined> {
    try {
      const deletedPost = await this.postRepository.findOneBy({ id: id });
      if (!deletedPost) {
        throw new NotFoundException('Post not found');
      }
      return await this.postRepository.delete({ id: id });
    } catch (error) {
      console.log(error);
    }
  }
}

import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { AuthDto } from '../../auth/dto/auth.dto';
import { User } from '../../../database/entities/user.entity';
import { PostEntity } from '../../../database/entities/post.entity';

export class PostDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  body: string;
}

export class PostQueryDto {
  @ApiProperty({ required: true })
  page?: number;
  @ApiProperty({ required: true })
  pages?: number;
  @ApiProperty({ required: true })
  limit?: number;
  @ApiProperty({ required: false })
  sort?: string;
  @ApiProperty({ required: true })
  countItems?: number;
  @ApiProperty({ required: true })
  entities?: PostEntity[];
}

export class UpdatePostDto {
  @ApiProperty({ required: true })
  title: string;
  @ApiProperty({ required: true })
  description: string;
  @ApiProperty({ required: true })
  body: string;
}

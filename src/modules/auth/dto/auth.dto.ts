import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Match } from '../../../common/decorators/password.decorator';
import { User } from '../../../database/entities/user.entity';

export class AuthDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  @Transform(({ value }) => value.trim())
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  firstName: string;
  @IsNumber()
  @IsOptional()
  @ApiProperty()
  @Min(18)
  age: number;
}

export class AuthResponseDto extends IntersectionType(AuthDto) {
  id: number;
  status: boolean;
}

export class UpdateAuthDto {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  age: number;
}

export class AuthQueryDto {
  @ApiProperty({ required: true })
  page?: number;
  @ApiProperty({ required: true })
  total?: number;
  @ApiProperty({ required: true })
  limit?: number;
  @ApiProperty({ required: false })
  sort?: string;
  @ApiProperty({ required: true })
  data?: User[];
}

export class SingUpDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  createdAt: Date;
}

export class LogInDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ required: true })
  @Transform(({ value }) => value.trim())
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

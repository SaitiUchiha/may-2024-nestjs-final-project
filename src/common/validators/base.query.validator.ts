import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderEnum } from '../constants/enums';
import { Type } from 'class-transformer';

export class BaseQueryDto {
  @IsOptional()
  @IsString()
  idOrEmail?: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  age?: number;

  @IsOptional()
  @IsDateString()
  createdAt?: Date;

  @IsOptional()
  @IsDateString()
  updatedAt?: Date;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number = 10;

  @ApiProperty({
    required: false,
    default: OrderEnum.ASC,
    enum: [OrderEnum.ASC, OrderEnum.DESC],
  })
  @IsEnum([OrderEnum.ASC, OrderEnum.DESC])
  @IsOptional()
  order = OrderEnum.ASC;
}

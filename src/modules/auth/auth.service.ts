import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRedisClient, RedisClient } from '@webeleon/nestjs-redis';

import { AuthDto, AuthQueryDto, LogInDto, UpdateAuthDto } from './dto/auth.dto';
import { User } from '../../database/entities/user.entity';
import { BaseQueryDto } from '../../common/validators/base.query.validator';

@Injectable()
export class AuthService {
  private redisUserKey = 'user-token';
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRedisClient() private readonly redisClient: RedisClient,
    private readonly jwtService: JwtService,
  ) {}

  async signUpUser(body: AuthDto): Promise<{ accessToken: string }> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { email: body.email },
      });
      if (findUser) {
        throw new BadRequestException(
          `User already exists with email: ${findUser.email}`,
        );
      }
      const password = await bcrypt.hash(body.password, 10);
      const user: User = await this.userRepository.save(
        this.userRepository.create({
          ...body,
          password,
        }),
      );

      const token = await this.singIn(user.id, user.email);

      await this.redisClient.setEx(
        `${this.redisUserKey}-${user.id}`,
        24 * 60 * 60,
        token,
      );

      return { accessToken: token };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async logOutUser(body: User): Promise<void> {
    try {
      const user = await this.userRepository.findOneBy({ id: body.id });
      if (!user) {
        throw new UnauthorizedException();
      }
      await this.redisClient.del(`${this.redisUserKey}-${user?.id}`);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async validateUser(userId: string, userEmail: string): Promise<User | null> {
    if (!userId || !userEmail) {
      throw new UnauthorizedException();
    }
    const user = this.userRepository.findOne({
      where: {
        id: userId,
        email: userEmail,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async singIn(userId: string, userEmail: string): Promise<string> {
    return this.jwtService.sign({ id: userId, email: userEmail });
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async login(data: LogInDto): Promise<{ accessToken: string }> {
    try {
      const findUser = await this.userRepository.findOne({
        where: { email: data.email },
      });

      if (!findUser) {
        throw new BadRequestException('Wrong email or password.');
      }

      if (!(await this.compareHash(data.password, findUser.password))) {
        throw new BadRequestException('Wrong email or password.');
      }

      const token = await this.singIn(findUser.id, findUser.email);

      await this.redisClient.setEx(
        `${this.redisUserKey}-${findUser.id}`,
        24 * 60 * 60,
        token,
      );

      return { accessToken: token };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async update(user: User, changes: UpdateAuthDto): Promise<User> {
    try {
      const editedUser = await this.userRepository.findOneBy({ id: user.id });

      if (!editedUser) {
        throw new NotFoundException('User not found');
      }
      const password = await bcrypt.hash(changes.password, 10);

      editedUser.firstName = changes.firstName;
      editedUser.age = changes.age;
      editedUser.email = changes.email;
      editedUser.password = password;

      await this.userRepository.save(editedUser);

      return editedUser;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async delete(user: User): Promise<void> {
    try {
      const editedUser = await this.userRepository.findOneBy({ id: user.id });

      if (!editedUser) {
        throw new NotFoundException('User not found');
      }

      await this.userRepository.delete(editedUser);
    } catch (error) {
      console.log(error);
    }
  }

  async findByIdOrEmail(idOrEmail: string): Promise<User | null> {
    try {
      const user = this.userRepository.findOne({
        where: [{ id: idOrEmail }, { email: idOrEmail }],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }

  async findAll(query: BaseQueryDto): Promise<AuthQueryDto> {
    try {
      const {
        idOrEmail,
        firstName,
        email,
        id,
        age,
        createdAt,
        updatedAt,
        page,
        limit,
      } = query;

      if (idOrEmail) {
        const user = await this.findByIdOrEmail(idOrEmail);
        return {
          data: user ? [user] : [],
          total: user ? 1 : 0,
          page: 1,
          limit: 1,
        };
      }

      const where: any = {};

      if (firstName) where.firstName = Like(`%${firstName}%`);
      if (email) where.email = Like(`%${email}%`);
      if (id) where.id = id;
      if (age) where.age = age;
      if (createdAt) where.createdAt = createdAt;
      if (updatedAt) where.updatedAt = updatedAt;

      const [data, total] = await this.userRepository.findAndCount({
        where: { isActive: false },
        select: {
          email: true,
          firstName: true,
          id: true,
        },
        relations: {
          posts: true,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      console.log(error);
      throw new NotFoundException('User not found');
    }
  }
}

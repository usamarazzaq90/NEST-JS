import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create and save a new user in the database.
   */
  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  /**
   * Retrieve all users.
   */
  async findAll() {
    return this.prisma.user.findMany();
  }

  /**
   * Find a user by id.
   * @throws NotFoundException if user is not found.
   */
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with id ${id} not found.`);
    return user;
  }

  /**
   * Update user details by id.
   * @throws NotFoundException if user is not found.
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id); // Ensure user exists
    return this.prisma.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  /**
   * Delete a user by id.
   * @throws NotFoundException if user is not found.
   */
  async remove(id: number) {
    await this.findOne(id); // Ensure user exists
    return this.prisma.user.delete({ where: { id } });
  }
}

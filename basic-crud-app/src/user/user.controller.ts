import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * POST /users
   * Create a new user.
   */
  @Post()
  create(@Body() createUser: any) {
    return this.userService.create(createUser);
  }

  /**
   * GET /users
   * Retrieve all users.
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * GET /users/:id
   * Retrieve a user by id.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  /**
   * PUT /users/:id
   * Update a user by id.
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * DELETE /users/:id
   * Delete a user by id.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}

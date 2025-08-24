import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType marks all fields optional for update DTO
export class UpdateUserDto extends PartialType(CreateUserDto) {}

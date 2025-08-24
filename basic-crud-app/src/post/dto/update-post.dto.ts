import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';

// Allows partial update of any of the CreatePostDto fields
export class UpdatePostDto extends PartialType(CreatePostDto) {}

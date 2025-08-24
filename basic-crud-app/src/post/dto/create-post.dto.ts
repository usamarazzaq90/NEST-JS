import { IsInt, IsOptional, IsString, IsArray } from 'class-validator';

export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsInt()
  userId: number; // <--- Add this

  /**
   * Array of category IDs to associate with post.
   */
  @IsArray()
  @IsInt({ each: true })
  @IsOptional()
  categories?: number[];
}

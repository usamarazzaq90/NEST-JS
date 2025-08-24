import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts') // Base route
export class PostController {
  constructor(private readonly postService: PostService) {}

  /**
   * POST /posts
   * Create a new post
   */
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.create(createPostDto);
  }

  /**
   * GET /posts
   * Get all posts with categories
   */
  @Get()
  findAll() {
    return this.postService.findAll();
  }

  /**
   * GET /posts/:id
   * Get single post by id with categories
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postService.findOne(id);
  }

  /**
   * PUT /posts/:id
   * Update a post by id
   */
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, updatePostDto);
  }

  /**
   * DELETE /posts/:id
   * Delete a post by id
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postService.remove(id);
  }
}

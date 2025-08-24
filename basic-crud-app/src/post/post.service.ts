import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // your prisma service
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Create a new post with optional categories.
   */
  async create(createPostDto: CreatePostDto) {
    const { categories, ...postData } = createPostDto;

    return this.prisma.post.create({
      data: {
        ...postData,
        categories: categories
          ? {
              connect: categories.map((id) => ({ id })),
            }
          : undefined,
      },
      include: { categories: true, user: true },
    });
  }

  /**
   * Retrieve all posts with their categories.
   */
  async findAll() {
    return this.prisma.post.findMany({
      include: { categories: true },
    });
  }

  /**
   * Find a single post by id with its categories.
   * @throws NotFoundException on missing post
   */
  async findOne(id: number) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: { categories: true },
    });
    if (!post) throw new NotFoundException(`Post with id ${id} not found.`);
    return post;
  }

  /**
   * Update a post's details and optionally its categories.
   * @throws NotFoundException if post not found
   */
  async update(id: number, updatePostDto: UpdatePostDto) {
    await this.findOne(id); // Ensure post exists
    const { categories, ...postData } = updatePostDto;

    return this.prisma.post.update({
      where: { id },
      data: {
        ...postData,
        ...(categories
          ? {
              categories: {
                set: categories.map((catId) => ({ id: catId })),
              },
            }
          : {}),
      },
      include: { categories: true },
    });
  }

  /**
   * Delete a post by id.
   * @throws NotFoundException if post not found
   */
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.post.delete({ where: { id } });
  }
}

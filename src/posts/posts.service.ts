import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreatePostDto from './dto/createPost.dto';
import UpdatePostDto from './dto/updatePost.dto';
import Post from './post.entity';
import PostNotFoundException from './exception/post-not-found.exception';
import User from '../users/user.entity';

@Injectable()
export default class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  getAllPosts() {
    return this.postsRepository.find({
      relations: ['author', 'categories'],
    });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne(id, {
      relations: ['author', 'categories'],
    });
    if (post) {
      return post;
    }
    throw new PostNotFoundException(id);
  }

  async updatePost(id: number, post: UpdatePostDto) {
    await this.postsRepository.update(id, post);
    const updatedPost = await this.postsRepository.findOne(id, {
      relations: ['author', 'categories'],
    });
    if (updatedPost) {
      return updatedPost;
    }
    throw new PostNotFoundException(id);
  }

  async createPost(post: CreatePostDto, user: User) {
    const newPost = await this.postsRepository.create({
      ...post,
      author: user,
    });
    await this.postsRepository.save(newPost);
    return newPost;
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postsRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new PostNotFoundException(id);
    }
  }
}

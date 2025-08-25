import { Injectable } from '@nestjs/common';
import { CreateHelloDto } from './dto/create-hellobuddy.dto';

@Injectable()
export class HellobuddyService {
  create(dto: CreateHelloDto) {
    // Simple echo/response; replace with your business logic
    return {
      message: 'Hello, world!',
      data: dto,
      // You could also compute something with a, b, c, d here.
    };
  }
}

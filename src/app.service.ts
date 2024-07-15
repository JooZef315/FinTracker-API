import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ok() {
    return 'OK!';
  }
}

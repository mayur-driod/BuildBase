import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('Server is running on port', process.env.PORT, "access it at http://localhost:" + process.env.PORT);
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
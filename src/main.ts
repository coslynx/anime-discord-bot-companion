import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DiscordService } from './discord/utils/discord.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const discordService = app.get(DiscordService);
  await discordService.startBot();
  await app.listen(3000);
}
bootstrap();
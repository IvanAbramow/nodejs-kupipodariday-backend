import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { HashModule } from './hash/hash.module';
import configuration from './config/configuration';
import { DatabaseConfigFactory } from './config/database.config';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: DatabaseConfigFactory,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    PassportModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    HashModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

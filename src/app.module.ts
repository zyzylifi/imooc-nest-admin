import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { BookModule } from './modules/book/book.module';
import { ContentsModule } from './modules/contents/contents.module';
import { MenuModule } from './modules/menu/menu.module';
import { RoleModule } from './modules/role/role.module';
import {  TypeOrmModule } from '@nestjs/typeorm';
import { getMysqlUsernameAndPassword } from './utils'; 

const { username, password } = getMysqlUsernameAndPassword();

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username,
    password,
    database: 'ibook',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    autoLoadEntities: true,
    // synchronize: true,
  }),UserModule,AuthModule,BookModule,ContentsModule,MenuModule,RoleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

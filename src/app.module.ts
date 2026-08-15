import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Project } from './projects/entities/project.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'better-sqlite3',
        database: config.get<string>('DATABASE_PATH', './dev.db'),
        entities: [User, Project],
        // Fine for an assessment/demo build; a real production app would
        // use TypeORM migrations instead of auto-sync.
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    ProjectsModule,
  ],
})
export class AppModule {}
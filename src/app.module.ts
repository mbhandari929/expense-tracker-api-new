import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
     type: 'better-sqlite3',
      database: 'expense.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
    IncomeModule,
     ExpenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
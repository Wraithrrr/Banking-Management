import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { join } from 'path'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { BanksModule } from './banks/banks.module'
import { AdminModule } from './admin/admin.module'
import { BranchesModule } from './branches/branches.module'
import { CustomersModule } from './customers/customers.module'
import { AccountsModule } from './accounts/accounts.module'
import { TransactionsModule } from './transactions/transactions.module'
import { LoansModule } from './loans/loans.module'
import { ComplaintsModule } from './complaints/complaints.module'
import { NotificationsModule } from './notifications/notifications.module'
import { ReportsModule } from './reports/reports.module'
import { OwnerModule } from './owner/owner.module'
import { ZakatModule } from './zakat/zakat.module'
import { AuditLogModule } from './audit-log/audit-log.module'
import { DocumentsModule } from './documents/documents.module'
import { PayrollModule } from './payroll/payroll.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    UsersModule,
    BanksModule,
    AdminModule,
    BranchesModule,
    CustomersModule,
    AccountsModule,
    TransactionsModule,
    LoansModule,
    ComplaintsModule,
    NotificationsModule,
    ReportsModule,
    OwnerModule,
    ZakatModule,
    AuditLogModule,
    DocumentsModule,
    PayrollModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

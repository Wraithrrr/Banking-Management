/**
 * SmartES Banking — Database Seed Script
 * ----------------------------------------
 * Creates a fully operational test bank with all 11 roles, branches,
 * customers, accounts, loans (at various stages), transactions, and repayments.
 *
 * Run:  npx ts-node -r tsconfig-paths/register src/seeds/seed.ts
 *
 * All test users get password: Test@1234
 * Admin login: admin@smartesmfb.com / Test@1234
 */

import 'reflect-metadata'
import { DataSource } from 'typeorm'
import * as bcrypt from 'bcrypt'

// ── Entities ──────────────────────────────────────────────────────────────────
import { Bank, BankType } from '../banks/entities/bank.entity'
import { User, UserRole } from '../users/entities/user.entity'
import { Branch } from '../branches/entities/branch.entity'
import { Customer, Gender } from '../customers/entities/customer.entity'
import { Account, AccountType, AccountStatus } from '../accounts/entities/account.entity'
import { LoanApplication, LoanStatus, LoanType } from '../loans/entities/loan-application.entity'
import { LoanRepayment, RepaymentStatus } from '../loans/entities/loan-repayment.entity'
import { Transaction, TransactionType, TransactionStatus } from '../transactions/entities/transaction.entity'

const DB = {
  host:     process.env.DB_HOST     ?? 'localhost',
  port:     parseInt(process.env.DB_PORT ?? '5432'),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? 'postgres',
  database: process.env.DB_NAME     ?? 'smartes_banking',
}

const AppDataSource = new DataSource({
  type: 'postgres',
  ...DB,
  synchronize: true,
  logging: false,
  entities: [Bank, User, Branch, Customer, Account, LoanApplication, LoanRepayment, Transaction],
})

function daysAgo(n: number): Date {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d
}

async function seed() {
  await AppDataSource.initialize()
  console.log('✅ Connected to database')

  const bankRepo       = AppDataSource.getRepository(Bank)
  const userRepo       = AppDataSource.getRepository(User)
  const branchRepo     = AppDataSource.getRepository(Branch)
  const customerRepo   = AppDataSource.getRepository(Customer)
  const accountRepo    = AppDataSource.getRepository(Account)
  const loanRepo       = AppDataSource.getRepository(LoanApplication)
  const repaymentRepo  = AppDataSource.getRepository(LoanRepayment)
  const txRepo         = AppDataSource.getRepository(Transaction)

  const password = await bcrypt.hash('Test@1234', 10)

  // ── 1. Bank ──────────────────────────────────────────────────────────────────
  let bank = await bankRepo.findOne({ where: { cbnLicenseNumber: 'MFB-2024-001' } })
  if (!bank) {
    bank = await bankRepo.save(bankRepo.create({
      name: 'SmartES Microfinance Bank',
      type: BankType.MICROFINANCE,
      cbnLicenseNumber: 'MFB-2024-001',
      rcNumber: 'RC-887654',
    }))
    console.log(`✅ Bank created: ${bank.name} (ID: ${bank.id})`)
  } else {
    console.log(`ℹ  Bank already exists (ID: ${bank.id}) — skipping`)
  }
  const bankId = bank.id

  // ── 2. Branches ──────────────────────────────────────────────────────────────
  const branchDefs = [
    { name: 'Lagos Head Office', code: 'LAG-HQ-001', address: 'Lagos, Lagos Island', phone: '08011111111' },
    { name: 'Abuja Branch', code: 'ABJ-001', address: 'Abuja, Garki District', phone: '08022222222' },
    { name: 'Kano Branch', code: 'KAN-001', address: 'Kano, Wudil', phone: '08033333333' },
  ]
  const branches: Branch[] = []
  for (const def of branchDefs) {
    let b = await branchRepo.findOne({ where: { code: def.code, bankId } })
    if (!b) b = await branchRepo.save(branchRepo.create({ ...def, bankId, isActive: true }))
    branches.push(b)
  }
  console.log(`✅ ${branches.length} branches ready`)
  const [hqBranch, abjBranch, kanBranch] = branches

  // ── 3. Users (all 11 roles) ───────────────────────────────────────────────────
  const userDefs: { fullName: string; email: string; role: UserRole; branchId?: number; phone: string }[] = [
    { fullName: 'Ibrahim Musa',       email: 'admin@smartesmfb.com',          role: UserRole.ADMIN,            phone: '08040000001' },
    { fullName: 'Amina Yusuf',        email: 'owner@smartesmfb.com',          role: UserRole.OWNER,            phone: '08040000002' },
    { fullName: 'Fatima Al-Hassan',   email: 'compliance@smartesmfb.com',     role: UserRole.COMPLIANCE,       phone: '08040000003' },
    { fullName: 'Emeka Okafor',       email: 'ic@smartesmfb.com',             role: UserRole.INTERNAL_CONTROL, phone: '08040000004' },
    { fullName: 'Abubakar Suleiman',  email: 'headops@smartesmfb.com',        role: UserRole.HEAD_OPERATIONS,  phone: '08040000005' },
    { fullName: 'Ngozi Eze',          email: 'headcredit@smartesmfb.com',     role: UserRole.HEAD_CREDIT,      phone: '08040000006' },
    { fullName: 'Musa Danladi',       email: 'bm.lagos@smartesmfb.com',       role: UserRole.BRANCH_MANAGER,   branchId: hqBranch.id, phone: '08040000007' },
    { fullName: 'Hauwa Ismail',       email: 'credit.lagos@smartesmfb.com',   role: UserRole.CREDIT_OFFICER,   branchId: hqBranch.id, phone: '08040000008' },
    { fullName: 'Samuel Adeyemi',     email: 'cs.lagos@smartesmfb.com',       role: UserRole.CUSTOMER_SERVICE, branchId: hqBranch.id, phone: '08040000009' },
    { fullName: 'Zainab Umar',        email: 'ao.lagos@smartesmfb.com',       role: UserRole.ACCOUNT_OFFICER,  branchId: hqBranch.id, phone: '08040000010' },
    { fullName: 'Chidi Nwosu',        email: 'teller.lagos@smartesmfb.com',   role: UserRole.TELLER,           branchId: hqBranch.id, phone: '08040000011' },
    // Extra staff for Abuja
    { fullName: 'Bello Abdullahi',    email: 'bm.abuja@smartesmfb.com',       role: UserRole.BRANCH_MANAGER,   branchId: abjBranch.id, phone: '08040000012' },
    { fullName: 'Grace Okonkwo',      email: 'credit.abuja@smartesmfb.com',   role: UserRole.CREDIT_OFFICER,   branchId: abjBranch.id, phone: '08040000013' },
    { fullName: 'Usman Garba',        email: 'ao.abuja@smartesmfb.com',       role: UserRole.ACCOUNT_OFFICER,  branchId: abjBranch.id, phone: '08040000014' },
    { fullName: 'Adaobi Nkem',        email: 'teller.abuja@smartesmfb.com',   role: UserRole.TELLER,           branchId: abjBranch.id, phone: '08040000015' },
  ]

  const users: Record<string, User> = {}
  for (const def of userDefs) {
    let u = await userRepo.findOne({ where: { email: def.email } })
    if (!u) {
      u = await userRepo.save(userRepo.create({
        ...def,
        password,
        bankId,
        isFirstLogin: false,
        isActive: true,
      }))
    }
    users[def.role] = u  // last one wins per role (fine for test)
    users[def.email] = u // also index by email
  }
  console.log(`✅ ${userDefs.length} users ready`)

  const aoUser     = users['ao.lagos@smartesmfb.com']
  const creditUser = users['credit.lagos@smartesmfb.com']
  const bmUser     = users['bm.lagos@smartesmfb.com']
  const hcUser     = users[UserRole.HEAD_CREDIT]
  const tellerUser = users['teller.lagos@smartesmfb.com']
  const aoCreditAbuja = users['credit.abuja@smartesmfb.com']

  // ── 4. Customers ──────────────────────────────────────────────────────────────
  type CustomerDef = { firstName: string; lastName: string; bvn: string; phone: string; email: string; gender: Gender; dob: string; address: string; kycApproved: boolean }
  const customerDefs: CustomerDef[] = [
    { firstName: 'Adebayo',   lastName: 'Ogundimu',    bvn: '22211100001', phone: '08050000001', email: 'adebayo@test.com',   gender: Gender.MALE,   dob: '1985-04-12', address: 'Lagos, Surulere', kycApproved: true },
    { firstName: 'Ramatu',    lastName: 'Bashir',       bvn: '22211100002', phone: '08050000002', email: 'ramatu@test.com',    gender: Gender.FEMALE, dob: '1990-07-23', address: 'Abuja, Wuse 2',  kycApproved: true },
    { firstName: 'Ifeanyi',   lastName: 'Uchenna',      bvn: '22211100003', phone: '08050000003', email: 'ifeanyi@test.com',   gender: Gender.MALE,   dob: '1978-01-30', address: 'Lagos, Lekki',   kycApproved: true },
    { firstName: 'Halima',    lastName: 'Murtala',      bvn: '22211100004', phone: '08050000004', email: 'halima@test.com',    gender: Gender.FEMALE, dob: '1993-11-05', address: 'Kano, Tarauni',  kycApproved: true },
    { firstName: 'Olumide',   lastName: 'Fashola',      bvn: '22211100005', phone: '08050000005', email: 'olumide@test.com',   gender: Gender.MALE,   dob: '1982-08-18', address: 'Lagos, Ikeja',   kycApproved: false },
    { firstName: 'Aisha',     lastName: 'Sani',         bvn: '22211100006', phone: '08050000006', email: 'aisha@test.com',     gender: Gender.FEMALE, dob: '1996-03-14', address: 'Abuja, Maitama', kycApproved: true },
    { firstName: 'Chidinma',  lastName: 'Obiorah',      bvn: '22211100007', phone: '08050000007', email: 'chidinma@test.com',  gender: Gender.FEMALE, dob: '1988-09-22', address: 'Lagos, Ajah',    kycApproved: true },
    { firstName: 'Mohammed',  lastName: 'Bello',        bvn: '22211100008', phone: '08050000008', email: 'mbello@test.com',    gender: Gender.MALE,   dob: '1975-12-01', address: 'Kano, Dala',     kycApproved: false },
    { firstName: 'Esther',    lastName: 'Okonkwo',      bvn: '22211100009', phone: '08050000009', email: 'esther@test.com',    gender: Gender.FEMALE, dob: '1991-06-17', address: 'Abuja, Garki',   kycApproved: true },
    { firstName: 'Tunde',     lastName: 'Adewale',      bvn: '22211100010', phone: '08050000010', email: 'tunde@test.com',     gender: Gender.MALE,   dob: '1987-02-28', address: 'Lagos, Ikorodu', kycApproved: true },
    { firstName: 'Maryam',    lastName: 'Abdullahi',    bvn: '22211100011', phone: '08050000011', email: 'maryam@test.com',    gender: Gender.FEMALE, dob: '1994-10-09', address: 'Kano, Fagge',    kycApproved: true },
    { firstName: 'Emeka',     lastName: 'Chukwu',       bvn: '22211100012', phone: '08050000012', email: 'emeka@test.com',     gender: Gender.MALE,   dob: '1980-05-25', address: 'Lagos, Festac',  kycApproved: true },
  ]

  const customers: Customer[] = []
  for (const def of customerDefs) {
    let c = await customerRepo.findOne({ where: { bvn: def.bvn, bankId } })
    if (!c) {
      c = await customerRepo.save(customerRepo.create({
        firstName: def.firstName,
        lastName: def.lastName,
        bvn: def.bvn,
        phone: def.phone,
        email: def.email,
        gender: def.gender,
        dateOfBirth: def.dob,
        address: def.address,
        bankId,
        isKycApproved: def.kycApproved,
        kycApprovedById: def.kycApproved ? users[UserRole.COMPLIANCE]?.id ?? null : null,
        createdById: aoUser.id,
        kycDocumentPaths: JSON.stringify([]),
      }))
    }
    customers.push(c)
  }
  console.log(`✅ ${customers.length} customers ready`)

  // ── 5. Accounts ───────────────────────────────────────────────────────────────
  const accountNumbers = ['1000000001','1000000002','1000000003','1000000004','1000000005',
                          '1000000006','1000000007','1000000008','1000000009','1000000010',
                          '1000000011','1000000012']
  const balances       = [250000, 180000, 920000, 65000, 0, 540000, 310000, 0, 420000, 1200000, 88000, 750000]

  const accounts: Account[] = []
  for (let i = 0; i < customers.length; i++) {
    let acc = await accountRepo.findOne({ where: { accountNumber: accountNumbers[i] } })
    if (!acc) {
      acc = await accountRepo.save(accountRepo.create({
        accountNumber: accountNumbers[i],
        type: AccountType.SAVINGS,
        balance: balances[i].toFixed(2),
        customerId: customers[i].id,
        branchId: i < 8 ? hqBranch.id : abjBranch.id,
        bankId,
        status: customers[i].isKycApproved ? AccountStatus.ACTIVE : AccountStatus.PENDING,
        createdById: aoUser.id,
      }))
    }
    accounts.push(acc)
  }
  console.log(`✅ ${accounts.length} accounts ready`)

  // ── 6. Loans at various stages ────────────────────────────────────────────────
  type LoanDef = {
    customer: Customer; account: Account; amount: number; purpose: string
    termMonths: number; type: LoanType; status: LoanStatus
    creditOfficer: User; branchId: number; daysOld: number
  }
  const loanDefs: LoanDef[] = [
    // DISBURSED — fully approved loans
    { customer: customers[0],  account: accounts[0],  amount: 500000,   purpose: 'Working capital for textile business',   termMonths: 6,  type: LoanType.BUSINESS, status: LoanStatus.DISBURSED,    creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 90 },
    { customer: customers[1],  account: accounts[1],  amount: 250000,   purpose: 'Shop renovation',                        termMonths: 4,  type: LoanType.PERSONAL, status: LoanStatus.DISBURSED,    creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 60 },
    { customer: customers[2],  account: accounts[2],  amount: 800000,   purpose: 'MSME equipment purchase',                termMonths: 12, type: LoanType.BUSINESS, status: LoanStatus.DISBURSED,    creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 120 },
    { customer: customers[5],  account: accounts[5],  amount: 150000,   purpose: 'Personal emergency',                     termMonths: 3,  type: LoanType.PERSONAL, status: LoanStatus.DISBURSED,    creditOfficer: aoCreditAbuja,   branchId: abjBranch.id, daysOld: 45 },
    { customer: customers[6],  account: accounts[6],  amount: 320000,   purpose: 'Food business expansion',                termMonths: 6,  type: LoanType.BUSINESS, status: LoanStatus.DISBURSED,    creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 75 },
    { customer: customers[8],  account: accounts[8],  amount: 600000,   purpose: 'Agro-processing startup',                termMonths: 9,  type: LoanType.BUSINESS, status: LoanStatus.DISBURSED,    creditOfficer: aoCreditAbuja,   branchId: abjBranch.id, daysOld: 30 },
    { customer: customers[9],  account: accounts[9],  amount: 1200000,  purpose: 'Commercial property purchase',           termMonths: 12, type: LoanType.BUSINESS, status: LoanStatus.DISBURSED,    creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 150 },
    { customer: customers[10], account: accounts[10], amount: 80000,    purpose: 'School fees support',                    termMonths: 3,  type: LoanType.PERSONAL, status: LoanStatus.DISBURSED,    creditOfficer: aoCreditAbuja,   branchId: abjBranch.id, daysOld: 20 },
    { customer: customers[11], account: accounts[11], amount: 450000,   purpose: 'Transport business',                     termMonths: 8,  type: LoanType.BUSINESS, status: LoanStatus.DISBURSED,    creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 55 },
    // APPROVED — awaiting teller disbursement
    { customer: customers[3],  account: accounts[3],  amount: 100000,   purpose: 'Petty trade support',                    termMonths: 3,  type: LoanType.PERSONAL, status: LoanStatus.APPROVED,     creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 2  },
    // PENDING_HOC — awaiting Head of Credit
    { customer: customers[5],  account: accounts[5],  amount: 400000,   purpose: 'Tailoring business expansion',           termMonths: 6,  type: LoanType.BUSINESS, status: LoanStatus.PENDING_HOC,  creditOfficer: aoCreditAbuja,   branchId: abjBranch.id, daysOld: 3  },
    // PENDING_BM — awaiting Branch Manager
    { customer: customers[1],  account: accounts[1],  amount: 200000,   purpose: 'Cosmetics stock purchase',               termMonths: 4,  type: LoanType.BUSINESS, status: LoanStatus.PENDING_BM,   creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 1  },
    // DECLINED
    { customer: customers[4],  account: accounts[4],  amount: 500000,   purpose: 'Real estate',                            termMonths: 12, type: LoanType.BUSINESS, status: LoanStatus.DECLINED,     creditOfficer: creditUser,      branchId: hqBranch.id,  daysOld: 14 },
  ]

  const loans: LoanApplication[] = []
  for (const def of loanDefs) {
    const existing = await loanRepo.findOne({ where: { customerId: def.customer.id, amount: def.amount.toFixed(2) as any, status: def.status, bankId } })
    if (!existing) {
      const created = new Date()
      created.setDate(created.getDate() - def.daysOld)
      const loan = loanRepo.create({
        customerId:     def.customer.id,
        customerName:   `${def.customer.firstName} ${def.customer.lastName}`,
        accountNumber:  def.account.accountNumber,
        type:           def.type,
        amount:         def.amount.toFixed(2),
        purpose:        def.purpose,
        termMonths:     def.termMonths,
        interestRate:   '15.00',
        status:         def.status,
        creditOfficerId: def.creditOfficer.id,
        branchManagerId: def.status !== LoanStatus.PENDING_BM ? bmUser.id : null,
        headCreditId:   [LoanStatus.APPROVED, LoanStatus.DISBURSED].includes(def.status) ? hcUser.id : null,
        branchId:       def.branchId,
        bankId,
        declineReason:  def.status === LoanStatus.DECLINED ? 'Insufficient income evidence and high existing obligations.' : null,
        createdAt:      created,
        updatedAt:      def.status === LoanStatus.DISBURSED ? created : new Date(),
      })
      const saved = await loanRepo.save(loan)
      loans.push(saved)
    }
  }
  const disbursedLoans = loans.filter(l => l.status === LoanStatus.DISBURSED)
  console.log(`✅ ${loans.length} loans created (${disbursedLoans.length} disbursed)`)

  // ── 7. Loan repayments ────────────────────────────────────────────────────────
  let repaymentCount = 0
  for (const loan of disbursedLoans) {
    const amount  = parseFloat(loan.amount)
    const monthly = amount / loan.termMonths
    const disbDate = new Date(loan.updatedAt)

    // Check if repayments already exist for this loan
    const existing = await repaymentRepo.count({ where: { loanId: loan.id } })
    if (existing > 0) continue

    for (let m = 1; m <= loan.termMonths; m++) {
      const dueDate = new Date(disbDate)
      dueDate.setMonth(dueDate.getMonth() + m)

      const now = new Date()
      let status: RepaymentStatus
      let paidAmount = '0.00'
      let paidAt: Date | null = null

      if (dueDate < now) {
        // Past due — randomly some paid, some overdue
        if (Math.random() > 0.15) {
          status = RepaymentStatus.PAID
          paidAmount = monthly.toFixed(2)
          paidAt = new Date(dueDate.getTime() - 2 * 86_400_000) // paid 2 days before due
        } else {
          status = RepaymentStatus.OVERDUE
        }
      } else {
        status = RepaymentStatus.PENDING
      }

      const repayment = repaymentRepo.create({
        loanId:    loan.id,
        dueDate:   dueDate.toISOString().split('T')[0],
        amount:    monthly.toFixed(2),
        paidAmount,
        status,
        paidAt,
      })
      await repaymentRepo.save(repayment)
      repaymentCount++
    }
  }
  console.log(`✅ ${repaymentCount} repayment schedules created`)

  // ── 8. Transactions ───────────────────────────────────────────────────────────
  const txDefs = [
    { from: accounts[0], to: accounts[1],  amount: 50000,  type: TransactionType.TRANSFER, status: TransactionStatus.COMPLETED,        narration: 'Business payment',            requiresApproval: false, daysOld: 5 },
    { from: null,        to: accounts[2],  amount: 200000, type: TransactionType.DEPOSIT,  status: TransactionStatus.COMPLETED,        narration: 'Cash deposit',                requiresApproval: false, daysOld: 3 },
    { from: accounts[9], to: null,         amount: 1500000,type: TransactionType.WITHDRAWAL,status: TransactionStatus.PENDING_APPROVAL, narration: 'Large withdrawal',           requiresApproval: true,  daysOld: 1 },
    { from: null,        to: accounts[5],  amount: 100000, type: TransactionType.DEPOSIT,  status: TransactionStatus.COMPLETED,        narration: 'Salary credit',               requiresApproval: false, daysOld: 7 },
    { from: accounts[6], to: accounts[10], amount: 30000,  type: TransactionType.TRANSFER, status: TransactionStatus.COMPLETED,        narration: 'Loan repayment contribution', requiresApproval: false, daysOld: 2 },
    { from: null,        to: accounts[11], amount: 500000, type: TransactionType.DEPOSIT,  status: TransactionStatus.COMPLETED,        narration: 'Business proceeds',           requiresApproval: false, daysOld: 10 },
    { from: accounts[2], to: null,         amount: 75000,  type: TransactionType.WITHDRAWAL,status: TransactionStatus.COMPLETED,       narration: 'Petty cash withdrawal',       requiresApproval: false, daysOld: 4 },
    { from: accounts[11],to: accounts[0],  amount: 120000, type: TransactionType.TRANSFER, status: TransactionStatus.REJECTED,         narration: 'Inter-account transfer',      requiresApproval: false, daysOld: 8 },
  ]

  let txCount = 0
  for (const def of txDefs) {
    const ref = `TXN-SEED-${Date.now()}-${txCount}`
    const existing = await txRepo.findOne({ where: { narration: def.narration, bankId, amount: def.amount.toFixed(2) as any } })
    if (!existing) {
      const created = new Date()
      created.setDate(created.getDate() - def.daysOld)
      await txRepo.save(txRepo.create({
        reference:       ref,
        type:            def.type,
        amount:          def.amount.toFixed(2),
        narration:       def.narration,
        fromAccountId:   def.from?.id ?? null,
        toAccountId:     def.to?.id   ?? null,
        tellerUserId:    tellerUser.id,
        branchId:        hqBranch.id,
        bankId,
        status:          def.status,
        requiresApproval: def.requiresApproval,
        approvedById:    null,
        createdAt:       created,
      }))
      txCount++
    }
  }
  console.log(`✅ ${txCount} transactions created`)

  // ── Done ──────────────────────────────────────────────────────────────────────
  console.log('\n🎉 Seed complete!\n')
  console.log('─────────────────────────────────────────────────────')
  console.log('  Bank:      SmartES Microfinance Bank')
  console.log('  Admin:     admin@smartesmfb.com  /  Test@1234')
  console.log('  Owner:     owner@smartesmfb.com  /  Test@1234')
  console.log('  Compliance:compliance@smartesmfb.com  /  Test@1234')
  console.log('  Head Ops:  headops@smartesmfb.com  /  Test@1234')
  console.log('  Head Credit:headcredit@smartesmfb.com  /  Test@1234')
  console.log('  Branch Mgr: bm.lagos@smartesmfb.com  /  Test@1234')
  console.log('  Credit Off: credit.lagos@smartesmfb.com  /  Test@1234')
  console.log('  Account Off:ao.lagos@smartesmfb.com  /  Test@1234')
  console.log('  Teller:    teller.lagos@smartesmfb.com  /  Test@1234')
  console.log('  Cust Svc:  cs.lagos@smartesmfb.com  /  Test@1234')
  console.log('  Int Control:ic@smartesmfb.com  /  Test@1234')
  console.log('─────────────────────────────────────────────────────\n')

  await AppDataSource.destroy()
}

seed().catch(err => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})

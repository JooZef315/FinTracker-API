/* eslint-disable prettier/prettier */
import { v4 as uuidv4 } from 'uuid';
import { real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  BudgetStatus,
  ExpenseCategory,
  IncomeCategory,
  SavingGoalStatus,
} from 'src/common/enums';
import { relations, sql } from 'drizzle-orm';
import { getNextMonth } from 'src/common/utils/dateUtils';

export const users = sqliteTable('Users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  bio: text('bio').default('New User!'),
  balance: real('balance').notNull().default(0),
});

export const budgets = sqliteTable('budgets', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  budgetCategory: text('budgetCategory', {
    enum: [...Object.values(ExpenseCategory)] as [string, ...string[]],
  }).notNull(),
  description: text('description', {
    length: 50,
  }).default('New Budget'),
  limit: real('limit').notNull(),
  overLimit: real('overLimit').default(0),
  status: text('status', {
    enum: [...Object.values(BudgetStatus)] as [string, ...string[]],
  }).default(BudgetStatus.DRAFT),
  startDate: text('createdAt').default(sql`(CURRENT_DATE)`),
  endDate: text('endDate')
    .notNull()
    .$defaultFn(() => getNextMonth()),
});

export const incomes = sqliteTable('incomes', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  amount: real('amount').notNull(),
  source: text('source', {
    enum: [...Object.values(IncomeCategory)] as [string, ...string[]],
  }).notNull(),
  balanceAfter: real('balanceAfter').notNull(),
  createdAt: text('createdAt').default(sql`(CURRENT_DATE)`),
});

export const expenses = sqliteTable('expenses', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  amount: real('amount').notNull(),
  category: text('category', {
    enum: [...Object.values(ExpenseCategory)] as [string, ...string[]],
  }).notNull(),
  balanceAfter: real('balanceAfter').notNull(),
  budgetId: text('budgetId').references(() => budgets.id, {
    onDelete: 'set null',
    onUpdate: 'set null',
  }),
  createdAt: text('createdAt').default(sql`(CURRENT_DATE)`),
});

export const savingGoals = sqliteTable('savingGoals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => uuidv4()),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  goal: real('goal').notNull(),
  status: text('status', {
    enum: [...Object.values(SavingGoalStatus)] as [string, ...string[]],
  }).default(SavingGoalStatus.ACTIVE),
  endDate: text('endDate')
    .notNull()
    .$defaultFn(() => getNextMonth()),
});

//Drizzle Relations
export const userRelations = relations(users, ({ many }) => {
  return {
    makeIncome: many(incomes),
    spends: many(expenses),
    budgeting: many(budgets),
    saving: many(savingGoals),
  };
});

export const budgetsRelations = relations(budgets, ({ one }) => {
  return {
    budgetOwner: one(users, {
      fields: [budgets.userId],
      references: [users.id],
      relationName: 'budgetOwner',
    }),
  };
});

export const expensesRelations = relations(expenses, ({ one }) => {
  return {
    expenseOwner: one(users, {
      fields: [expenses.userId],
      references: [users.id],
      relationName: 'expenseOwner',
    }),
    expenseBudget: one(budgets, {
      fields: [expenses.budgetId],
      references: [budgets.id],
      relationName: 'expenseBudget',
    }),
  };
});

export const incomesRelations = relations(incomes, ({ one }) => {
  return {
    incomeOwner: one(users, {
      fields: [incomes.userId],
      references: [users.id],
      relationName: 'incomeOwner',
    }),
  };
});

export const savingGoalsRelations = relations(savingGoals, ({ one }) => {
  return {
    savingGoalOwner: one(users, {
      fields: [savingGoals.userId],
      references: [users.id],
      relationName: 'savingGoalOwner',
    }),
  };
});

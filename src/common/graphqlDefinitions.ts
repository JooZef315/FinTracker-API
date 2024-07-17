
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum IncomeCategory {
    SALARY = "SALARY",
    SAVINGS = "SAVINGS",
    INVESTMENT = "INVESTMENT",
    GIFTS = "GIFTS",
    OTHER = "OTHER"
}

export enum ExpenseCategory {
    FOOD = "FOOD",
    RENT = "RENT",
    UTILITIES = "UTILITIES",
    ENTERTAINMENT = "ENTERTAINMENT",
    TRANSPORTATION = "TRANSPORTATION",
    HEALTHCARE = "HEALTHCARE",
    EDUCATION = "EDUCATION",
    OTHER = "OTHER"
}

export class AddIncomeInput {
    amount: number;
    source: IncomeCategory;
}

export class AddExpenseInput {
    amount: number;
    category: ExpenseCategory;
    budgetId?: Nullable<string>;
}

export class CreateUserInput {
    name: string;
    email: string;
    password: string;
    bio?: Nullable<string>;
    balance: number;
}

export class EditUserInput {
    name?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    bio?: Nullable<string>;
}

export abstract class IQuery {
    abstract ok(): Nullable<string> | Promise<Nullable<string>>;

    abstract income(id: string): Income[] | Promise<Income[]>;

    abstract expense(id: string, page?: Nullable<number>, category?: Nullable<ExpenseCategory>, before?: Nullable<Date>): Expense[] | Promise<Expense[]>;

    abstract user(id: string): User | Promise<User>;
}

export class Income {
    id: string;
    userId: string;
    amount: number;
    source: IncomeCategory;
    balanceAfter: number;
    createdAt: Date;
}

export class Expense {
    id: string;
    userId: string;
    amount: number;
    category: ExpenseCategory;
    budgetId?: Nullable<string>;
    balanceAfter: number;
    createdAt: Date;
}

export abstract class IMutation {
    abstract addIncome(id: string, newIncome: AddIncomeInput): Income | Promise<Income>;

    abstract addExpense(id: string, newExpense: AddExpenseInput): Expense | Promise<Expense>;

    abstract createUser(newUser: CreateUserInput): User | Promise<User>;

    abstract editUser(id: string, userData: EditUserInput): User | Promise<User>;

    abstract deleteUser(id: string): string | Promise<string>;
}

export class User {
    id: string;
    name: string;
    email: string;
    bio?: Nullable<string>;
    balance: number;
}

type Nullable<T> = T | null;


/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum BudgetStatus {
    DRAFT = "DRAFT",
    IN_LIMIT = "IN_LIMIT",
    EXCEEDED = "EXCEEDED",
    ARCHIVED = "ARCHIVED"
}

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

export class LoginInput {
    email: string;
    password: string;
}

export class CreateBudgetInput {
    limit: number;
    budgetCategory: ExpenseCategory;
    description?: Nullable<string>;
    startDate?: Nullable<Date>;
    endDate?: Nullable<Date>;
}

export class EditBudgetInput {
    limit?: Nullable<number>;
    description?: Nullable<string>;
    startDate?: Nullable<Date>;
    endDate?: Nullable<Date>;
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

export class Token {
    accessToken: string;
}

export abstract class IMutation {
    abstract login(data?: Nullable<LoginInput>): Token | Promise<Token>;

    abstract createBudget(id: string, newBudget: CreateBudgetInput): Budget | Promise<Budget>;

    abstract editBudget(id: string, budgetId: string, budgetData: EditBudgetInput): Budget | Promise<Budget>;

    abstract deleteBudget(id: string, budgetId: string): string | Promise<string>;

    abstract archiveBudget(id: string, budgetId: string): string | Promise<string>;

    abstract addIncome(id: string, newIncome: AddIncomeInput): Income | Promise<Income>;

    abstract addExpense(id: string, newExpense: AddExpenseInput): Expense | Promise<Expense>;

    abstract createUser(newUser: CreateUserInput): User | Promise<User>;

    abstract editUser(id: string, userData: EditUserInput): User | Promise<User>;

    abstract deleteUser(id: string): string | Promise<string>;
}

export class Budget {
    id: string;
    userId: string;
    budgetCategory: ExpenseCategory;
    description: string;
    limit: number;
    overLimit: number;
    status: BudgetStatus;
    startDate: Date;
    endDate: Date;
    expenses: Expense[];
}

export abstract class IQuery {
    abstract budget(id: string, budgetId: string): Budget | Promise<Budget>;

    abstract budgets(id: string, category?: Nullable<ExpenseCategory>, status?: Nullable<BudgetStatus>): Budget[] | Promise<Budget[]>;

    abstract report(id: string): Report | Promise<Report>;

    abstract ok(): Nullable<string> | Promise<Nullable<string>>;

    abstract income(id: string, page?: Nullable<number>, source?: Nullable<IncomeCategory>, before?: Nullable<Date>, after?: Nullable<Date>): Income[] | Promise<Income[]>;

    abstract expense(id: string, page?: Nullable<number>, category?: Nullable<ExpenseCategory>, before?: Nullable<Date>, after?: Nullable<Date>): Expense[] | Promise<Expense[]>;

    abstract user(id: string): User | Promise<User>;
}

export class BudgetsPerstatus {
    status: BudgetStatus;
    Number_Of_budgets: number;
}

export class SpendingPerCategory {
    category: ExpenseCategory;
    amount: number;
}

export class ExpensesPerMonth {
    month: string;
    amount: number;
}

export class Report {
    userId: string;
    name: string;
    Current_Balance: number;
    Total_Income: number;
    Total_Spending: number;
    Spending_Per_Category: SpendingPerCategory[];
    budgets_Per_status: BudgetsPerstatus[];
    expenses_Per_Month: ExpensesPerMonth[];
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

export class User {
    id: string;
    name: string;
    email: string;
    bio?: Nullable<string>;
    balance: number;
}

type Nullable<T> = T | null;

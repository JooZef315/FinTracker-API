# Fin Tracker

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Nest is a progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

## Description

Welcome to Fin Tracker! This is a personal finance tracking application designed to help you manage your income, expenses, and budgets effectively. With Fin Tracker, you can easily keep track of your financial activities, generate detailed reports, and stay on top of your budget goals.

## Features

- **User Authentication**: Secure user authentication using JWT and Passport.js.
- **Manage Accounts**: Edit or delete your user account.
- **Add Transactions**: Add income and expense transactions with specific types, amounts, and dates.
- **Budget Management**: Create multiple budgets, each with a type, status, limit, and date range.
- **Automatic Budget Assignment**: Expenses are automatically assigned to the relevant budget based on type and date.
- **Generate Reports**: Generate detailed financial reports including current balance, total income, total spending, spending per category, budgets per status, and expenses per month.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **GraphQL**: A query language for your API, and a server-side runtime for executing queries.
- **SQLite**: A lightweight, disk-based database. with **Turso**, A distributed SQLite database
- **Drizzle ORM**: A lightweight TypeScript ORM for SQL databases.
- **JWT & Passport.js**: For secure user authentication.
- **Moment.js**: Simplifies date formatting and manipulation.

## Configuration

Create a .env file in the root of your project with the following variables:

```bash
PORT = 3001
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
ACCESS_TOKEN_SECRET=
```

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/JooZef315/FinTracker-API
   cd FinTracker-API
   ```
2. **Install Dependencies**

   ```bash
    npm install
    # or
    yarn install
   ```

3. **Run Database Migrations**

   ```bash
    npm run db:push
   ```

4. **Run the app**

   ```bash
   # development
   $ npm run start

   # watch mode
   $ npm run start:dev

   # production mode
   $ npm run start:prod
   ```

5. **Access the GraphQL Playground**

   Open your browser and navigate to http://localhost:3001/graphql to explore the API using the GraphQL Playground.

## API Documentation

### GraphQL Schema

1. **User**

```graphQl
input CreateUserInput {
  name: String!
  email: String!
  password: String!
  bio: String
  balance: Float!
}

input EditUserInput {
  name: String
  email: String
  password: String
  bio: String
}

type User {
  id: ID!
  name: String!
  email: String!
  bio: String
  balance: Float!
}

type Query {
  user: User!
}

type Mutation {
  createUser(newUser: CreateUserInput!): User!
  editUser(userData: EditUserInput!): User!
  deleteUser: String!
}
```

2. **transactions**

```graphQl
scalar Date

enum IncomeCategory {
  SALARY
  SAVINGS
  INVESTMENT
  GIFTS
  OTHER
}

enum ExpenseCategory {
  FOOD
  RENT
  UTILITIES
  ENTERTAINMENT
  TRANSPORTATION
  HEALTHCARE
  EDUCATION
  OTHER
}

input AddIncomeInput {
  amount: Float!
  source: IncomeCategory!
}

input AddExpenseInput {
  amount: Float!
  category: ExpenseCategory!
  budgetId: String
}

type Income {
  id: ID!
  userId: String!
  amount: Float!
  source: IncomeCategory!
  balanceAfter: Float!
  createdAt: Date!
}

type Expense {
  id: ID!
  userId: String!
  amount: Float!
  category: ExpenseCategory!
  budgetId: String
  balanceAfter: Float!
  createdAt: Date!
}

type Query {
  income(
    page: Int
    source: IncomeCategory
    before: Date
    after: Date
  ): [Income!]!
  expense(
    page: Int
    category: ExpenseCategory
    before: Date
    after: Date
  ): [Expense!]!
}

type Mutation {
  addIncome(newIncome: AddIncomeInput!): Income!
  addExpense(newExpense: AddExpenseInput!): Expense!
}
```

3. **Budgets**

```graphQl
scalar Date

enum BudgetStatus {
  DRAFT
  IN_LIMIT
  EXCEEDED
  ARCHIVED
}

input CreateBudgetInput {
  limit: Float!
  budgetCategory: ExpenseCategory!
  description: String
  startDate: Date
  endDate: Date
}

input EditBudgetInput {
  limit: Float
  description: String
  startDate: Date
  endDate: Date
}

type Budget {
  id: ID!
  userId: String!
  budgetCategory: ExpenseCategory!
  description: String!
  limit: Float!
  overLimit: Float!
  status: BudgetStatus!
  startDate: Date!
  endDate: Date!
  expenses: [Expense!]!
}

type Query {
  budget(budgetId: String!): Budget!
  budgets(category: ExpenseCategory, status: BudgetStatus): [Budget!]!
}

type Mutation {
  createBudget(newBudget: CreateBudgetInput!): Budget!
  editBudget(budgetId: String!, budgetData: EditBudgetInput!): Budget!
  deleteBudget(budgetId: String!): String!
  archiveBudget(budgetId: String!): String!
}
```

4. **Reports**

```graphQl
type BudgetsPerstatus {
  status: BudgetStatus!
  Number_Of_budgets: Int!
}

type SpendingPerCategory {
  category: ExpenseCategory!
  amount: Float!
}

type ExpensesPerMonth {
  month: String!
  amount: Float!
}

type Report {
  userId: String!
  name: String!
  Current_Balance: Float!
  Total_Income: Float!
  Total_Spending: Float!
  Spending_Per_Category: [SpendingPerCategory!]!
  budgets_Per_status: [BudgetsPerstatus!]!
  expenses_Per_Month: [ExpensesPerMonth!]!
}

type Query {
  report: Report!
}
```

5. **Auth**

```graphQl
input LoginInput {
  email: String!
  password: String!
}
type Token {
  accessToken: String!
}

type Mutation {
  login(data: LoginInput): Token!
}
```

## Conclusion

Fin Tracker is your all-in-one solution for managing your personal finances efficiently. With powerful features and a user-friendly interface, it helps you stay on top of your financial goals. Happy tracking!

## License

This project is licensed under the [MIT licensed](LICENSE).

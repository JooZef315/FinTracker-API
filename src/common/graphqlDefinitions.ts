
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

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

    abstract user(id: string): User | Promise<User>;
}

export class User {
    id: string;
    name: string;
    email: string;
    bio: string;
    balance: number;
}

export abstract class IMutation {
    abstract createUser(newUser: CreateUserInput): User | Promise<User>;

    abstract editUser(id: string, userData: EditUserInput): User | Promise<User>;

    abstract deleteUser(id: string): string | Promise<string>;
}

type Nullable<T> = T | null;

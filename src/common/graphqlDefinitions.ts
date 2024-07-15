
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

export abstract class IQuery {
    abstract ok(): Nullable<string> | Promise<Nullable<string>>;

    abstract user(): Nullable<User> | Promise<Nullable<User>>;
}

export class User {
    id?: Nullable<string>;
    name?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
    bio?: Nullable<string>;
    balance?: Nullable<number>;
}

export abstract class IMutation {
    abstract createUser(newUser: CreateUserInput): Nullable<User> | Promise<Nullable<User>>;
}

type Nullable<T> = T | null;

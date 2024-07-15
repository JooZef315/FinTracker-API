
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface Ok {
    __typename?: 'Ok';
    name?: Nullable<string>;
    age?: Nullable<number>;
}

export interface IQuery {
    __typename?: 'IQuery';
    ok(name: string): Nullable<Ok> | Promise<Nullable<Ok>>;
}

type Nullable<T> = T | null;

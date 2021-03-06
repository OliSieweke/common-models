import { DbModel } from "../db-model";

// [15.11.19 | Oli] TODO: To be removed once Angular can be updated to TS 3.5
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */

export type Constructor = new(...args: any) => any; /* eslint-disable-line @typescript-eslint/no-type-alias, @typescript-eslint/no-explicit-any */

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type NonMethodKeys<T> = Exclude<{
    [Key in keyof T]:
    T[Key] extends Function ? never : Key
}[keyof T], undefined>;
export type NonMethodProperties<T> = Pick<T, NonMethodKeys<T>>;
export type InstanceProperties<T extends new(...args: any) => any> = Pick<InstanceType<T>, NonMethodKeys<InstanceType<T>>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */
export type PartialInstanceProperties<T extends new(...args: any) => any> = Partial<InstanceProperties<T>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */
export type OwnInstanceProperties<T extends new(...args: any) => any> = Omit<InstanceProperties<T>, NonMethodKeys<DbModel>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */
export type PartialOwnInstanceProperties<T extends new(...args: any) => any> = Partial<OwnInstanceProperties<T>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */

export type PostInterface<T, ForbiddenFields extends Readonly<NonMethodKeys<T>[]> = [], AuthorizedFields extends Readonly<NonMethodKeys<T>[]> = Readonly<NonMethodKeys<T>[]>> = Omit<Pick<NonMethodProperties<T>, AuthorizedFields[number]>, ForbiddenFields[number] | keyof DbModel>;
export type PutInterface<T, ForbiddenFields extends Readonly<NonMethodKeys<T>[]> = [], AuthorizedFields extends Readonly<NonMethodKeys<T>[]> = Readonly<NonMethodKeys<T>[]>> = Omit<Pick<NonMethodProperties<T>, AuthorizedFields[number]>, ForbiddenFields[number] | keyof DbModel>;
export type PatchInterface<T, ForbiddenFields extends Readonly<NonMethodKeys<T>[]> = [], AuthorizedFields extends Readonly<NonMethodKeys<T>[]> = Readonly<NonMethodKeys<T>[]>> = Partial<Omit<Pick<NonMethodProperties<T>, AuthorizedFields[number]>, ForbiddenFields[number] | keyof DbModel>>;

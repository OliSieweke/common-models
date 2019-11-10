import { DbModel } from "../db-model";


export type Constructor = new(...args: any) => any; /* eslint-disable-line @typescript-eslint/no-type-alias, @typescript-eslint/no-explicit-any */

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type NonMethodKeys<T> = Exclude<{
    [Key in keyof T]:
    T[Key] extends Function ? never : Key
}[keyof T], undefined>;
export type InstanceProperties<T extends new(...args: any) => any> = Pick<InstanceType<T>, NonMethodKeys<InstanceType<T>>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */
export type PartialInstanceProperties<T extends new(...args: any) => any> = Partial<InstanceProperties<T>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */
export type OwnInstanceProperties<T extends new(...args: any) => any> = Omit<InstanceProperties<T>, NonMethodKeys<DbModel>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */
export type PartialOwnInstanceProperties<T extends new(...args: any) => any> = Partial<OwnInstanceProperties<T>>; /* eslint-disable-line @typescript-eslint/no-explicit-any */

export type PostInterface<T, PathParameters extends string[] = []> = Omit<T, (keyof DbModel) | PathParameters[number]>;
export type PutInterface<T, PathParameters extends string[] = []> = Omit<T, keyof DbModel | PathParameters[number]>;
export type PatchInterface<T, PathParameters extends string[] = []> = Partial<Omit<T, keyof DbModel | PathParameters[number]>>;

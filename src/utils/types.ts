export type Constructor = new(...args: any) => any; /* eslint-disable-line @typescript-eslint/no-type-alias, @typescript-eslint/no-explicit-any */

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
export type NonMethodKeys<T> = Exclude<{ /* eslint-disable-line @typescript-eslint/no-type-alias */
    [Key in keyof T]:
    T[Key] extends Function ? never : Key
}[keyof T], undefined>;
export type PartialInstanceProperties<T extends new(...args: any) => any> = Partial<Pick<InstanceType<T>, NonMethodKeys<InstanceType<T>>>>; /* eslint-disable-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-type-alias */

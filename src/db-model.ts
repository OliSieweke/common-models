import { v4 as UUID }                                                 from "uuid";
import { Constructor, PartialInstanceProperties, InstanceProperties, NonMethodKeys } from "./utils/types";


/**
 * Standard DB Model for creating instances and preparing Dynamo DB data. To be shared across the front-end and back-end.
 */
export class DbModel {
    static readonly fields? = ["resourceId", "created", "updated"] as const;
    resourceId?: string;
    created?: number;
    updated?: number;

    /**
     * The DbModel class should be extended and not instantiated directly.
     *
     * __NB__: The constructor is merely defined explicitly here to throw an appropriate error when called directly and to facilitate the typing of child classes.
     *
     * @param args  Arguments
     */
    constructor(...args: any[]) { /* eslint-disable-line @typescript-eslint/no-explicit-any */
        if (new.target === DbModel) {
            throw new Error("The DbModel class should be extended and not instantiated directly.");
        }
        Object.assign(this, args[0]);
    }

    /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
    /**
     * [__Front-End__] Constructs an instance from a JSON object.
     *
     * __NB 1:__ the data is assumed to come from an entity that has already been instantiated, no properties are being added by default.
     * __NB 2:__ this method is primarily designed for the __front-end__. The appropriate method for the __back-end__ will usually be `fromJsonString()`.
     *
     * @param json  JSON object
     */
    static fromJson<T extends typeof DbModel & Constructor & DbModelExtension<T>>(
        this: T,
        json: Parameters<T["create"]>[0],
        { withDefaults = false }: { withDefaults?: boolean } = {},
    ): InstanceType<T> {
        return this.create(json, { withDefaults });
    }
    /* eslint-enable jsdoc/require-param, jsdoc/check-param-names */

    /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
    /**
     * [__Back-End__] Constructs an instance from a JSON string.
     *
     * __NB 1:__ if the data represents an already existing entity (e.g: in an update operation), `{withDefaults: false}` should be specified.
     * __NB 2:__ this method is primarily designed for the __back-end__. The appropriate method for the __front-end__ will usually be `fromJson()`.
     *
     * __WARNING:__ parsing JSON is not a safe operation, it should be ensured that the input string is trusted or that potential errors are caught.
     *
     * @param jsonString    JSON string
     */
    static fromJsonString<T extends typeof DbModel & Constructor & DbModelExtension<T>>(
        this: T,
        jsonString: string,
        { additionalProperties, withDefaults = true }: { additionalProperties?: PartialInstanceProperties<T>, withDefaults?: boolean } = {},
    ): InstanceType<T> {
        return this.create({ ...JSON.parse(jsonString), ...additionalProperties }, { withDefaults });
    }
    /* eslint-enable jsdoc/require-param, jsdoc/check-param-names */

    /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
    /**
     * [__Front-End__] Constructs instances from a JSON array.
     *
     * __NB 1:__ the data is assumed to come from a entities that have already been instantiated, no properties are being added by default.
     * __NB 2:__ this method is primarily designed for the __front-end__. The appropriate method for the __back-end__ will usually be `fromJsonArrayString()`.
     *
     * @param json  JSON object
     */
    static fromJsonArray<T extends typeof DbModel & Constructor & DbModelExtension<T>>(
        this: T,
        jsonArray: Parameters<T["create"]>[0][],
        { withDefaults = false }: { withDefaults?: boolean } = {},
    ): InstanceType<T>[] {
        return jsonArray.map(json => this.fromJson(json, { withDefaults }));
    }
    /* eslint-enable jsdoc/require-param, jsdoc/check-param-names */

    /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
    /**
     * [__Back-End__] Constructs instances from a JSON array string.
     *
     * __NB 1:__ if the data represents already existing entities (e.g: in an update operation), `{withDefaults: false}` should be specified.
     * __NB 2:__ this method is primarily designed for the __back-end__. The appropriate method for the __front-end__ will usually be `fromJsonArray()`.
     *
     * __WARNING:__ parsing JSON is not a safe operation, it should be ensured that the input string is trusted or that potential errors are caught.
     *
     * @param jsonString    JSON string
     */
    static fromJsonArrayString<T extends typeof DbModel & Constructor & DbModelExtension<T>>(
        this: T,
        jsonArrayString: string,
        { additionalProperties, withDefaults = true }: { additionalProperties?: PartialInstanceProperties<T>, withDefaults?: boolean } = {},
    ): InstanceType<T>[] {
        const jsonArray = JSON.parse(jsonArrayString).map((item: PartialInstanceProperties<T>[]) => ({
            ...item,
            ...additionalProperties,
        })) as Parameters<T["create"]>[0][];
        return this.fromJsonArray(jsonArray, { withDefaults });
    }
    /* eslint-enable jsdoc/require-param, jsdoc/check-param-names */

    // [12.11.19 | Oli] TODO: JSDoc
    static getProtectedFields<T extends typeof DbModel & Constructor & DbModelExtension<T>>(
        this: T,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        roles?: any[], // [12.11.19 | Oli] TODO: Roles enum
    ) {
        const protectedFields = [];
        if (this.protectedFields) {
            for (const [key, value] of this.protectedFields.entries()) {
                if (!roles || !roles.includes(key)) {
                    protectedFields.push(...value);
                }
            }
        }
        return protectedFields;
    }

    /**
     * Returns an instance to be used to create a new DB entry, including optional `resourceId` and `created` fields.
     *
     * @param options                       Options object
     * @param [options.resourceId=true]     Specifies whether a `resourceId` field should be added
     * @param [options.created=true]        Specifies whether a `created` field should be added
     */
    createDbEntry(
        { resourceId = true, created = true, updated = false }: { resourceId?: boolean, created?: boolean, updated?: boolean } = {},
    ) {

        Object.assign(this, {
            ...!Object.prototype.hasOwnProperty.call(this, "resourceId") && resourceId ?
                { resourceId: UUID() } : {},
            ...!Object.prototype.hasOwnProperty.call(this, "created") && created ?
                { created: new Date().getTime() } : {},
            ...!Object.prototype.hasOwnProperty.call(this, "updated") && updated ?
                { updated: new Date().getTime() } : {},
        });

        return this;
    }

    /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
    /**
     * Returns an instance to be used to update a DB entry, including an optional `updated` field.
     *
     * @param options                   Options object
     * @param [options.created=false]   Specifies whether a `created` field should be added9
     * @param [options.updated=true]    Specifies whether an `updated` field should be added
     * @param options.blackList         Specifies a black-list of fields that should not be included in the update
     * @param options.whiteList         Specifies a white-list of fields that should be included in the update
     */
    updateDbEntry<T extends DbModel>(
        this: T,
        { updated = true, blackList = [], whiteList }: { updated?: boolean, blackList?: (keyof T)[], whiteList?: (keyof T)[] } = {},
    ) {
        blackList.push("created", "resourceId");                    // The "resourceId" and "created" fields should not be overwritten when provided
        whiteList && updated && whiteList.push("updated");          // We don't want to remove the "updated" field when explicitly specified

        Object.assign(this, {
            ...!Object.prototype.hasOwnProperty.call(this, "updated") && updated ?
                { updated: new Date().getTime() } : {},
        });

        for (let key of Object.keys(this) as (keyof T)[]) {
            if (this[key] === undefined || (whiteList && !whiteList.includes(key)) || blackList.includes(key)) {
                delete this[key];
            }
        }

        return this as Partial<this>;
    }
    /* eslint-enable jsdoc/require-param, jsdoc/check-param-names */
}

interface DbModelExtension<T extends typeof DbModel & Constructor> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protectedFields?: Map<any, (keyof InstanceProperties<T>)[]>; // [12.11.19 | Oli] TODO: any to Role enum
    create(params: PartialInstanceProperties<T>, options?: { withDefaults?: boolean }): InstanceType<T>; // [30.10.19 | Oli] THINK: Ideally we would like `create()` to be an protected abstract static method on DbModel, which is not supported at the moment. Check this issue: https://github.com/microsoft/TypeScript/issues/34516
}

type DbModelClass = typeof DbModel;
export interface DbModelWithKeys<T extends DbModelClass> extends DbModelClass {
    partitionKey: {
        attribute: keyof NonMethodKeys<InstanceType<T>>,
        pathParameter: string,
    };
    sortKey?: {
        attribute: keyof T,
        pathParameter: string,
    };
}

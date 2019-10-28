import { v4 as UUID }                     from "uuid";

interface DbModelInterface {
    resourceId?: string;
    created: number;
    updated?: number;
}

/**
 * Standard DB Model for creating and updating entries.
 */
export abstract class DbModel {
    resourceId?: string;
    created?: number;
    updated?: number;

    /**
     * Constructs instances from JSON strings.
     *
     * __NB:__ the JSON string is assumed to represent data of an entity that has already been created, no default properties are being added.
     *
     *__WARNING:__ parsing JSON is not a safe operation, it should be ensured that the input string is trusted or that potential errors are caught.
     *
     * @param json  JSON string
     */
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore // [27.10.19 | Oli] TODO: `AuthenticatedUser extends typeof DbModel` leads to type error in for example `User.fromJson("")`. Might be a TS bug, investigate...
    static fromJson<T>(this: T, json: string): InstanceType<T> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore // [27.10.19 | Oli] TODO: We would like `create()` to be an abstract static class, which is not supported at the moment. Check this issue: https://github.com/microsoft/TypeScript/issues/34516
        return this.create(JSON.parse(json), { withDefaults: false });
    }

    /**
     * Returns an instance to be used to create a new DB entry, including optional `resourceId` and `created` fields.
     *
     * @param options               Options object
     * @param options.resourceId    Specifies whether a `resourceId` field should be added
     * @param options.created       Specifies whether a `created` field should be added
     */
    createDbEntry(
        { resourceId = true, created = true }: { resourceId?: boolean, created?: boolean } = {},
    ) {

        Object.assign(this, {
            ...!Object.prototype.hasOwnProperty.call(this, "resourceId") && resourceId ?
                { resourceId: UUID() } :
                {},
            ...!Object.prototype.hasOwnProperty.call(this, "created") && created ?
                { created: new Date().getTime() } :
                {},
        });

        return this;
    }

    /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
    /**
     * Returns an instance to be used to update a DB entry, including an optional `updated` field.
     *
     * @param options Options object
     * @param options.updated Specifies whether a `resourceId` field should be added
     * @param options.blackList Specifies a black-list of fields that should not be included in the update
     * @param options.whiteList Specifies a white-list of fields that should be included in the update
     */
    updateDbEntry<T extends DbModel>(
        this: T,
        { updated = true, blackList = [], whiteList }: { updated?: boolean, blackList?: (keyof T)[], whiteList?: (keyof T)[] } = {},
    ) {
        blackList.push("created", "resourceId");                // The "resourceId" and "created" fields should never be overwritten when present
        whiteList && updated && whiteList.push("updated");      // We don't want to remove the "updated" field when explicitly specified

        Object.assign(this, {
            ...!Object.prototype.hasOwnProperty.call(this, "updated") && updated ?
                { updated: new Date().getTime() } :
                { resourceId: UUID() },
        });


        for (let key of Object.keys(this) as (keyof T)[]) {
            if ((whiteList && !whiteList.includes(key)) || (blackList && blackList.includes(key))) {
                delete this[key];
            }
        }

        return this;
    }
    /* eslint-enable jsdoc/require-param, jsdoc/check-param-names */
}

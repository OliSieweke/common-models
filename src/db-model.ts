import { v4 as UUID } from "uuid";
import { keys } from 'ts-transformer-keys';


type isPropertyOfModel = any;
/**
 * Standard DB Model for creating and updating entries.
 */
export class DbModel {
    resourceId?: string;
    created?: number;
    updated?: number;

    constructor(inputObj: object) {
        Object.assign(this, inputObj);
    }

    /* eslint-disable jsdoc/require-param, jsdoc/check-param-names */
    /**
     * This method should be used to construct input instances from JSON strings.
     *
     *__WARNING:__ parsing JSON is not a safe operation, make sure you trust your input string or catch potential errors appropriately.
     *
     * @param json  JSON string
     */
    static fromJson<T extends typeof DbModel>(this: T, json: string): InstanceType<T> {
        const parsedJson = JSON.parse(json);

        for(let key of Object.keys(json) as (keyof InstanceType<T>)[]) {
            if(!keys<InstanceType<T>>().includes(key)) {
                delete parsedJson[key];
            }
        }

        return Reflect.construct(this, [JSON.parse(json)]);
    }
    /* eslint-enable jsdoc/require-param, jsdoc/check-param-names */

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

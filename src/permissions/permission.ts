/**
 *
 */
import { DbModel } from "../db-model";


export enum PermissionTypesEnum {
    GLOBAL = "GLOBAL",
    COMPANY = "COMPANY",
}

export enum RolesEnum {
    // Global
    WEBSITE_USER = "WEBSITE_USER",
    REGISTERED_USER = "REGISTERED_USER",

    // COMPANY
    COMPANY_USER = "COMPANY_USER",
    COMPANY_OWNER = "COMPANY_OWNER",

    // Admin
    ADMIN_USER = "ADMIN_USER",
    ADMIN_COMPANY = "ADMIN_COMPANY",
}

/**
 *
 */
export class Permission extends DbModel { // [21.11.19 | Oli] TODO: No need for this to extend DbModel
    constructor(
        public resourceType: PermissionTypesEnum,
        public resourceId: string,
        public roles: RolesEnum[],
    ) { super()}
}

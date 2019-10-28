import { DbModel } from "../db-model";


/**
 *
 */
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
export class Permission extends DbModel {
    constructor(
        public resourceType: PermissionTypesEnum,
        public resourceId: string,
        public roles: RolesEnum[],
    ) { super()}
}

/**
 *
 */
export class AuthenticationUser extends DbModel {
    constructor(
        public sub: string,
        public email: string,
        public permissions?: Permission[],
    ) { super() }

    static create(
        { sub, email, permissionSettings }: { sub: string, email: string, permissionSettings?: ConstructorParameters<typeof Permission>[] },
        { withDefaults = true }: { withDefaults?: boolean } = {},
    ) {
        const permissions = permissionSettings ?
                            permissionSettings.map(permissionArgs => new Permission(...permissionArgs)) :
                            (withDefaults && [...AuthenticationUser.DEFAULT_PERMISSIONS]) || [];

        return new AuthenticationUser(sub, email, permissions);
    }

    private static readonly DEFAULT_PERMISSIONS = [
        new Permission(PermissionTypesEnum.GLOBAL, "*", [RolesEnum.WEBSITE_USER]),
        new Permission(PermissionTypesEnum.GLOBAL, "*", [RolesEnum.REGISTERED_USER]),
    ] as const;
}


import { DbModel }                                    from "../db-model";
import { Permission, PermissionTypesEnum, RolesEnum } from "../permissions/permission";


/**
 *
 */
export class AuthenticationUser extends DbModel {
    static readonly partitionKey = {
        attribute: "email",
        pathParameter: "email",
    } as const;
    static readonly globalSecondaryPartitionKey = {
        attribute: "sub",
        pathParameter: "sub",
    } as const;

    constructor(
        public sub: string,
        public email: string,
        public permissions: Permission[],
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


/// <reference types="node" />
import type { Session, User } from "@tyl/auth";
/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export declare const createTRPCContext: (opts: {
    headers: Headers;
    session: Session | null;
    user: User | null;
}) => {
    session: Session | null;
    user: User | null;
    db: import("drizzle-orm/node-postgres").NodePgDatabase<{
        trackable: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "trackable";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgUUID";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                name: import("drizzle-orm/pg-core").PgColumn<{
                    name: "name";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: false;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                type: import("drizzle-orm/pg-core").PgColumn<{
                    name: "type";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgEnumColumn";
                    data: "number" | "boolean" | "range";
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: ["boolean", "number", "range"];
                    baseColumn: never;
                }, {}, {}>;
                settings: import("drizzle-orm/pg-core").PgColumn<{
                    name: "settings";
                    tableName: "trackable";
                    dataType: "json";
                    columnType: "PgJson";
                    data: unknown;
                    driverParam: unknown;
                    notNull: false;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableRecord: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "trackableRecord";
            schema: undefined;
            columns: {
                trackableId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "trackableId";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgUUID";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                date: import("drizzle-orm/pg-core").PgColumn<{
                    name: "date";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgDateString";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                value: import("drizzle-orm/pg-core").PgColumn<{
                    name: "value";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableRelations: import("drizzle-orm").Relations<"trackable", {
            data: import("drizzle-orm").Many<"trackableRecord">;
        }>;
        recordRelations: import("drizzle-orm").Relations<"trackableRecord", {
            trackableId: import("drizzle-orm").One<"trackable", true>;
            userId: import("drizzle-orm").One<"auth_user", true>;
        }>;
        auth_user: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "auth_user";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                email: import("drizzle-orm/pg-core").PgColumn<{
                    name: "email";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                username: import("drizzle-orm/pg-core").PgColumn<{
                    name: "username";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
                    name: "hashed_password";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                settings: import("drizzle-orm/pg-core").PgColumn<{
                    name: "settings";
                    tableName: "auth_user";
                    dataType: "json";
                    columnType: "PgJson";
                    data: Record<string, unknown>;
                    driverParam: unknown;
                    notNull: false;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                role: import("drizzle-orm/pg-core").PgColumn<{
                    name: "role";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: false;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        user_session: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "user_session";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "user_session";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "user_session";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                expiresAt: import("drizzle-orm/pg-core").PgColumn<{
                    name: "expires_at";
                    tableName: "user_session";
                    dataType: "date";
                    columnType: "PgTimestamp";
                    data: Date;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableTypeEnum: import("drizzle-orm/pg-core").PgEnum<["boolean", "number", "range"]>;
    }>;
};
/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export declare const createCallerFactory: <TRecord extends import("@trpc/server").TRPCRouterRecord>(router: Pick<import("@trpc/server/unstable-core-do-not-import").Router<{
    ctx: {
        session: Session | null;
        user: User | null;
        db: import("drizzle-orm/node-postgres").NodePgDatabase<{
            trackable: import("drizzle-orm/pg-core").PgTableWithColumns<{
                name: "trackable";
                schema: undefined;
                columns: {
                    id: import("drizzle-orm/pg-core").PgColumn<{
                        name: "id";
                        tableName: "trackable";
                        dataType: "string";
                        columnType: "PgUUID";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: true;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                    name: import("drizzle-orm/pg-core").PgColumn<{
                        name: "name";
                        tableName: "trackable";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: false;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    userId: import("drizzle-orm/pg-core").PgColumn<{
                        name: "user_id";
                        tableName: "trackable";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    type: import("drizzle-orm/pg-core").PgColumn<{
                        name: "type";
                        tableName: "trackable";
                        dataType: "string";
                        columnType: "PgEnumColumn";
                        data: "number" | "boolean" | "range";
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: ["boolean", "number", "range"];
                        baseColumn: never;
                    }, {}, {}>;
                    settings: import("drizzle-orm/pg-core").PgColumn<{
                        name: "settings";
                        tableName: "trackable";
                        dataType: "json";
                        columnType: "PgJson";
                        data: unknown;
                        driverParam: unknown;
                        notNull: false;
                        hasDefault: true;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                };
                dialect: "pg";
            }>;
            trackableRecord: import("drizzle-orm/pg-core").PgTableWithColumns<{
                name: "trackableRecord";
                schema: undefined;
                columns: {
                    trackableId: import("drizzle-orm/pg-core").PgColumn<{
                        name: "trackableId";
                        tableName: "trackableRecord";
                        dataType: "string";
                        columnType: "PgUUID";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                    date: import("drizzle-orm/pg-core").PgColumn<{
                        name: "date";
                        tableName: "trackableRecord";
                        dataType: "string";
                        columnType: "PgDateString";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                    value: import("drizzle-orm/pg-core").PgColumn<{
                        name: "value";
                        tableName: "trackableRecord";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    userId: import("drizzle-orm/pg-core").PgColumn<{
                        name: "user_id";
                        tableName: "trackableRecord";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                };
                dialect: "pg";
            }>;
            trackableRelations: import("drizzle-orm").Relations<"trackable", {
                data: import("drizzle-orm").Many<"trackableRecord">;
            }>;
            recordRelations: import("drizzle-orm").Relations<"trackableRecord", {
                trackableId: import("drizzle-orm").One<"trackable", true>;
                userId: import("drizzle-orm").One<"auth_user", true>;
            }>;
            auth_user: import("drizzle-orm/pg-core").PgTableWithColumns<{
                name: "auth_user";
                schema: undefined;
                columns: {
                    id: import("drizzle-orm/pg-core").PgColumn<{
                        name: "id";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    email: import("drizzle-orm/pg-core").PgColumn<{
                        name: "email";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    username: import("drizzle-orm/pg-core").PgColumn<{
                        name: "username";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
                        name: "hashed_password";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    settings: import("drizzle-orm/pg-core").PgColumn<{
                        name: "settings";
                        tableName: "auth_user";
                        dataType: "json";
                        columnType: "PgJson";
                        data: Record<string, unknown>;
                        driverParam: unknown;
                        notNull: false;
                        hasDefault: true;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                    role: import("drizzle-orm/pg-core").PgColumn<{
                        name: "role";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: false;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                };
                dialect: "pg";
            }>;
            user_session: import("drizzle-orm/pg-core").PgTableWithColumns<{
                name: "user_session";
                schema: undefined;
                columns: {
                    id: import("drizzle-orm/pg-core").PgColumn<{
                        name: "id";
                        tableName: "user_session";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    userId: import("drizzle-orm/pg-core").PgColumn<{
                        name: "user_id";
                        tableName: "user_session";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    expiresAt: import("drizzle-orm/pg-core").PgColumn<{
                        name: "expires_at";
                        tableName: "user_session";
                        dataType: "date";
                        columnType: "PgTimestamp";
                        data: Date;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                };
                dialect: "pg";
            }>;
            trackableTypeEnum: import("drizzle-orm/pg-core").PgEnum<["boolean", "number", "range"]>;
        }>;
    };
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "UNSUPPORTED_MEDIA_TYPE" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
            httpStatus: number;
            path?: string | undefined;
            stack?: string | undefined;
        };
        message: string;
        code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: true;
}, TRecord>, "_def">) => import("@trpc/server/unstable-core-do-not-import").RouterCaller<{
    ctx: {
        session: Session | null;
        user: User | null;
        db: import("drizzle-orm/node-postgres").NodePgDatabase<{
            trackable: import("drizzle-orm/pg-core").PgTableWithColumns<{
                name: "trackable";
                schema: undefined;
                columns: {
                    id: import("drizzle-orm/pg-core").PgColumn<{
                        name: "id";
                        tableName: "trackable";
                        dataType: "string";
                        columnType: "PgUUID";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: true;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                    name: import("drizzle-orm/pg-core").PgColumn<{
                        name: "name";
                        tableName: "trackable";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: false;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    userId: import("drizzle-orm/pg-core").PgColumn<{
                        name: "user_id";
                        tableName: "trackable";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    type: import("drizzle-orm/pg-core").PgColumn<{
                        name: "type";
                        tableName: "trackable";
                        dataType: "string";
                        columnType: "PgEnumColumn";
                        data: "number" | "boolean" | "range";
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: ["boolean", "number", "range"];
                        baseColumn: never;
                    }, {}, {}>;
                    settings: import("drizzle-orm/pg-core").PgColumn<{
                        name: "settings";
                        tableName: "trackable";
                        dataType: "json";
                        columnType: "PgJson";
                        data: unknown;
                        driverParam: unknown;
                        notNull: false;
                        hasDefault: true;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                };
                dialect: "pg";
            }>;
            trackableRecord: import("drizzle-orm/pg-core").PgTableWithColumns<{
                name: "trackableRecord";
                schema: undefined;
                columns: {
                    trackableId: import("drizzle-orm/pg-core").PgColumn<{
                        name: "trackableId";
                        tableName: "trackableRecord";
                        dataType: "string";
                        columnType: "PgUUID";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                    date: import("drizzle-orm/pg-core").PgColumn<{
                        name: "date";
                        tableName: "trackableRecord";
                        dataType: "string";
                        columnType: "PgDateString";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                    value: import("drizzle-orm/pg-core").PgColumn<{
                        name: "value";
                        tableName: "trackableRecord";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    userId: import("drizzle-orm/pg-core").PgColumn<{
                        name: "user_id";
                        tableName: "trackableRecord";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                };
                dialect: "pg";
            }>;
            trackableRelations: import("drizzle-orm").Relations<"trackable", {
                data: import("drizzle-orm").Many<"trackableRecord">;
            }>;
            recordRelations: import("drizzle-orm").Relations<"trackableRecord", {
                trackableId: import("drizzle-orm").One<"trackable", true>;
                userId: import("drizzle-orm").One<"auth_user", true>;
            }>;
            auth_user: import("drizzle-orm/pg-core").PgTableWithColumns<{
                name: "auth_user";
                schema: undefined;
                columns: {
                    id: import("drizzle-orm/pg-core").PgColumn<{
                        name: "id";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    email: import("drizzle-orm/pg-core").PgColumn<{
                        name: "email";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    username: import("drizzle-orm/pg-core").PgColumn<{
                        name: "username";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
                        name: "hashed_password";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    settings: import("drizzle-orm/pg-core").PgColumn<{
                        name: "settings";
                        tableName: "auth_user";
                        dataType: "json";
                        columnType: "PgJson";
                        data: Record<string, unknown>;
                        driverParam: unknown;
                        notNull: false;
                        hasDefault: true;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                    role: import("drizzle-orm/pg-core").PgColumn<{
                        name: "role";
                        tableName: "auth_user";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: false;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                };
                dialect: "pg";
            }>;
            user_session: import("drizzle-orm/pg-core").PgTableWithColumns<{
                name: "user_session";
                schema: undefined;
                columns: {
                    id: import("drizzle-orm/pg-core").PgColumn<{
                        name: "id";
                        tableName: "user_session";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    userId: import("drizzle-orm/pg-core").PgColumn<{
                        name: "user_id";
                        tableName: "user_session";
                        dataType: "string";
                        columnType: "PgVarchar";
                        data: string;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: [string, ...string[]];
                        baseColumn: never;
                    }, {}, {}>;
                    expiresAt: import("drizzle-orm/pg-core").PgColumn<{
                        name: "expires_at";
                        tableName: "user_session";
                        dataType: "date";
                        columnType: "PgTimestamp";
                        data: Date;
                        driverParam: string;
                        notNull: true;
                        hasDefault: false;
                        enumValues: undefined;
                        baseColumn: never;
                    }, {}, {}>;
                };
                dialect: "pg";
            }>;
            trackableTypeEnum: import("drizzle-orm/pg-core").PgEnum<["boolean", "number", "range"]>;
        }>;
    };
    meta: object;
    errorShape: {
        data: {
            zodError: import("zod").typeToFlattenedError<any, string> | null;
            code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "UNSUPPORTED_MEDIA_TYPE" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
            httpStatus: number;
            path?: string | undefined;
            stack?: string | undefined;
        };
        message: string;
        code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
    };
    transformer: true;
}, TRecord>;
/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */
/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export declare const createTRPCRouter: {
    <TInput extends import("@trpc/server").TRPCRouterRecord>(input: TInput): import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
        ctx: {
            session: Session | null;
            user: User | null;
            db: import("drizzle-orm/node-postgres").NodePgDatabase<{
                trackable: import("drizzle-orm/pg-core").PgTableWithColumns<{
                    name: "trackable";
                    schema: undefined;
                    columns: {
                        id: import("drizzle-orm/pg-core").PgColumn<{
                            name: "id";
                            tableName: "trackable";
                            dataType: "string";
                            columnType: "PgUUID";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: true;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                        name: import("drizzle-orm/pg-core").PgColumn<{
                            name: "name";
                            tableName: "trackable";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: false;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        userId: import("drizzle-orm/pg-core").PgColumn<{
                            name: "user_id";
                            tableName: "trackable";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        type: import("drizzle-orm/pg-core").PgColumn<{
                            name: "type";
                            tableName: "trackable";
                            dataType: "string";
                            columnType: "PgEnumColumn";
                            data: "number" | "boolean" | "range";
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: ["boolean", "number", "range"];
                            baseColumn: never;
                        }, {}, {}>;
                        settings: import("drizzle-orm/pg-core").PgColumn<{
                            name: "settings";
                            tableName: "trackable";
                            dataType: "json";
                            columnType: "PgJson";
                            data: unknown;
                            driverParam: unknown;
                            notNull: false;
                            hasDefault: true;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                    };
                    dialect: "pg";
                }>;
                trackableRecord: import("drizzle-orm/pg-core").PgTableWithColumns<{
                    name: "trackableRecord";
                    schema: undefined;
                    columns: {
                        trackableId: import("drizzle-orm/pg-core").PgColumn<{
                            name: "trackableId";
                            tableName: "trackableRecord";
                            dataType: "string";
                            columnType: "PgUUID";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                        date: import("drizzle-orm/pg-core").PgColumn<{
                            name: "date";
                            tableName: "trackableRecord";
                            dataType: "string";
                            columnType: "PgDateString";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                        value: import("drizzle-orm/pg-core").PgColumn<{
                            name: "value";
                            tableName: "trackableRecord";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        userId: import("drizzle-orm/pg-core").PgColumn<{
                            name: "user_id";
                            tableName: "trackableRecord";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                    };
                    dialect: "pg";
                }>;
                trackableRelations: import("drizzle-orm").Relations<"trackable", {
                    data: import("drizzle-orm").Many<"trackableRecord">;
                }>;
                recordRelations: import("drizzle-orm").Relations<"trackableRecord", {
                    trackableId: import("drizzle-orm").One<"trackable", true>;
                    userId: import("drizzle-orm").One<"auth_user", true>;
                }>;
                auth_user: import("drizzle-orm/pg-core").PgTableWithColumns<{
                    name: "auth_user";
                    schema: undefined;
                    columns: {
                        id: import("drizzle-orm/pg-core").PgColumn<{
                            name: "id";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        email: import("drizzle-orm/pg-core").PgColumn<{
                            name: "email";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        username: import("drizzle-orm/pg-core").PgColumn<{
                            name: "username";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
                            name: "hashed_password";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        settings: import("drizzle-orm/pg-core").PgColumn<{
                            name: "settings";
                            tableName: "auth_user";
                            dataType: "json";
                            columnType: "PgJson";
                            data: Record<string, unknown>;
                            driverParam: unknown;
                            notNull: false;
                            hasDefault: true;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                        role: import("drizzle-orm/pg-core").PgColumn<{
                            name: "role";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: false;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                    };
                    dialect: "pg";
                }>;
                user_session: import("drizzle-orm/pg-core").PgTableWithColumns<{
                    name: "user_session";
                    schema: undefined;
                    columns: {
                        id: import("drizzle-orm/pg-core").PgColumn<{
                            name: "id";
                            tableName: "user_session";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        userId: import("drizzle-orm/pg-core").PgColumn<{
                            name: "user_id";
                            tableName: "user_session";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        expiresAt: import("drizzle-orm/pg-core").PgColumn<{
                            name: "expires_at";
                            tableName: "user_session";
                            dataType: "date";
                            columnType: "PgTimestamp";
                            data: Date;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                    };
                    dialect: "pg";
                }>;
                trackableTypeEnum: import("drizzle-orm/pg-core").PgEnum<["boolean", "number", "range"]>;
            }>;
        };
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").typeToFlattenedError<any, string> | null;
                code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "UNSUPPORTED_MEDIA_TYPE" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
                httpStatus: number;
                path?: string | undefined;
                stack?: string | undefined;
            };
            message: string;
            code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: true;
    }, TInput>;
    <TInput_1 extends import("@trpc/server/unstable-core-do-not-import").CreateRouterOptions>(input: TInput_1): import("@trpc/server/unstable-core-do-not-import").BuiltRouter<{
        ctx: {
            session: Session | null;
            user: User | null;
            db: import("drizzle-orm/node-postgres").NodePgDatabase<{
                trackable: import("drizzle-orm/pg-core").PgTableWithColumns<{
                    name: "trackable";
                    schema: undefined;
                    columns: {
                        id: import("drizzle-orm/pg-core").PgColumn<{
                            name: "id";
                            tableName: "trackable";
                            dataType: "string";
                            columnType: "PgUUID";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: true;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                        name: import("drizzle-orm/pg-core").PgColumn<{
                            name: "name";
                            tableName: "trackable";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: false;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        userId: import("drizzle-orm/pg-core").PgColumn<{
                            name: "user_id";
                            tableName: "trackable";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        type: import("drizzle-orm/pg-core").PgColumn<{
                            name: "type";
                            tableName: "trackable";
                            dataType: "string";
                            columnType: "PgEnumColumn";
                            data: "number" | "boolean" | "range";
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: ["boolean", "number", "range"];
                            baseColumn: never;
                        }, {}, {}>;
                        settings: import("drizzle-orm/pg-core").PgColumn<{
                            name: "settings";
                            tableName: "trackable";
                            dataType: "json";
                            columnType: "PgJson";
                            data: unknown;
                            driverParam: unknown;
                            notNull: false;
                            hasDefault: true;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                    };
                    dialect: "pg";
                }>;
                trackableRecord: import("drizzle-orm/pg-core").PgTableWithColumns<{
                    name: "trackableRecord";
                    schema: undefined;
                    columns: {
                        trackableId: import("drizzle-orm/pg-core").PgColumn<{
                            name: "trackableId";
                            tableName: "trackableRecord";
                            dataType: "string";
                            columnType: "PgUUID";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                        date: import("drizzle-orm/pg-core").PgColumn<{
                            name: "date";
                            tableName: "trackableRecord";
                            dataType: "string";
                            columnType: "PgDateString";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                        value: import("drizzle-orm/pg-core").PgColumn<{
                            name: "value";
                            tableName: "trackableRecord";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        userId: import("drizzle-orm/pg-core").PgColumn<{
                            name: "user_id";
                            tableName: "trackableRecord";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                    };
                    dialect: "pg";
                }>;
                trackableRelations: import("drizzle-orm").Relations<"trackable", {
                    data: import("drizzle-orm").Many<"trackableRecord">;
                }>;
                recordRelations: import("drizzle-orm").Relations<"trackableRecord", {
                    trackableId: import("drizzle-orm").One<"trackable", true>;
                    userId: import("drizzle-orm").One<"auth_user", true>;
                }>;
                auth_user: import("drizzle-orm/pg-core").PgTableWithColumns<{
                    name: "auth_user";
                    schema: undefined;
                    columns: {
                        id: import("drizzle-orm/pg-core").PgColumn<{
                            name: "id";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        email: import("drizzle-orm/pg-core").PgColumn<{
                            name: "email";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        username: import("drizzle-orm/pg-core").PgColumn<{
                            name: "username";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
                            name: "hashed_password";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        settings: import("drizzle-orm/pg-core").PgColumn<{
                            name: "settings";
                            tableName: "auth_user";
                            dataType: "json";
                            columnType: "PgJson";
                            data: Record<string, unknown>;
                            driverParam: unknown;
                            notNull: false;
                            hasDefault: true;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                        role: import("drizzle-orm/pg-core").PgColumn<{
                            name: "role";
                            tableName: "auth_user";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: false;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                    };
                    dialect: "pg";
                }>;
                user_session: import("drizzle-orm/pg-core").PgTableWithColumns<{
                    name: "user_session";
                    schema: undefined;
                    columns: {
                        id: import("drizzle-orm/pg-core").PgColumn<{
                            name: "id";
                            tableName: "user_session";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        userId: import("drizzle-orm/pg-core").PgColumn<{
                            name: "user_id";
                            tableName: "user_session";
                            dataType: "string";
                            columnType: "PgVarchar";
                            data: string;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: [string, ...string[]];
                            baseColumn: never;
                        }, {}, {}>;
                        expiresAt: import("drizzle-orm/pg-core").PgColumn<{
                            name: "expires_at";
                            tableName: "user_session";
                            dataType: "date";
                            columnType: "PgTimestamp";
                            data: Date;
                            driverParam: string;
                            notNull: true;
                            hasDefault: false;
                            enumValues: undefined;
                            baseColumn: never;
                        }, {}, {}>;
                    };
                    dialect: "pg";
                }>;
                trackableTypeEnum: import("drizzle-orm/pg-core").PgEnum<["boolean", "number", "range"]>;
            }>;
        };
        meta: object;
        errorShape: {
            data: {
                zodError: import("zod").typeToFlattenedError<any, string> | null;
                code: "PARSE_ERROR" | "BAD_REQUEST" | "INTERNAL_SERVER_ERROR" | "NOT_IMPLEMENTED" | "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "METHOD_NOT_SUPPORTED" | "TIMEOUT" | "CONFLICT" | "PRECONDITION_FAILED" | "UNSUPPORTED_MEDIA_TYPE" | "PAYLOAD_TOO_LARGE" | "UNPROCESSABLE_CONTENT" | "TOO_MANY_REQUESTS" | "CLIENT_CLOSED_REQUEST";
                httpStatus: number;
                path?: string | undefined;
                stack?: string | undefined;
            };
            message: string;
            code: import("@trpc/server/unstable-core-do-not-import").TRPC_ERROR_CODE_NUMBER;
        };
        transformer: true;
    }, import("@trpc/server/unstable-core-do-not-import").DecorateCreateRouterOptions<TInput_1>>;
};
/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export declare const publicProcedure: import("@trpc/server/unstable-core-do-not-import").ProcedureBuilder<{
    session: Session | null;
    user: User | null;
    db: import("drizzle-orm/node-postgres").NodePgDatabase<{
        trackable: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "trackable";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgUUID";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                name: import("drizzle-orm/pg-core").PgColumn<{
                    name: "name";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: false;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                type: import("drizzle-orm/pg-core").PgColumn<{
                    name: "type";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgEnumColumn";
                    data: "number" | "boolean" | "range";
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: ["boolean", "number", "range"];
                    baseColumn: never;
                }, {}, {}>;
                settings: import("drizzle-orm/pg-core").PgColumn<{
                    name: "settings";
                    tableName: "trackable";
                    dataType: "json";
                    columnType: "PgJson";
                    data: unknown;
                    driverParam: unknown;
                    notNull: false;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableRecord: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "trackableRecord";
            schema: undefined;
            columns: {
                trackableId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "trackableId";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgUUID";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                date: import("drizzle-orm/pg-core").PgColumn<{
                    name: "date";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgDateString";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                value: import("drizzle-orm/pg-core").PgColumn<{
                    name: "value";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableRelations: import("drizzle-orm").Relations<"trackable", {
            data: import("drizzle-orm").Many<"trackableRecord">;
        }>;
        recordRelations: import("drizzle-orm").Relations<"trackableRecord", {
            trackableId: import("drizzle-orm").One<"trackable", true>;
            userId: import("drizzle-orm").One<"auth_user", true>;
        }>;
        auth_user: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "auth_user";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                email: import("drizzle-orm/pg-core").PgColumn<{
                    name: "email";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                username: import("drizzle-orm/pg-core").PgColumn<{
                    name: "username";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
                    name: "hashed_password";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                settings: import("drizzle-orm/pg-core").PgColumn<{
                    name: "settings";
                    tableName: "auth_user";
                    dataType: "json";
                    columnType: "PgJson";
                    data: Record<string, unknown>;
                    driverParam: unknown;
                    notNull: false;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                role: import("drizzle-orm/pg-core").PgColumn<{
                    name: "role";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: false;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        user_session: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "user_session";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "user_session";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "user_session";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                expiresAt: import("drizzle-orm/pg-core").PgColumn<{
                    name: "expires_at";
                    tableName: "user_session";
                    dataType: "date";
                    columnType: "PgTimestamp";
                    data: Date;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableTypeEnum: import("drizzle-orm/pg-core").PgEnum<["boolean", "number", "range"]>;
    }>;
}, object, object, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, false>;
/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export declare const protectedProcedure: import("@trpc/server/unstable-core-do-not-import").ProcedureBuilder<{
    session: Session | null;
    user: User | null;
    db: import("drizzle-orm/node-postgres").NodePgDatabase<{
        trackable: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "trackable";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgUUID";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                name: import("drizzle-orm/pg-core").PgColumn<{
                    name: "name";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: false;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                type: import("drizzle-orm/pg-core").PgColumn<{
                    name: "type";
                    tableName: "trackable";
                    dataType: "string";
                    columnType: "PgEnumColumn";
                    data: "number" | "boolean" | "range";
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: ["boolean", "number", "range"];
                    baseColumn: never;
                }, {}, {}>;
                settings: import("drizzle-orm/pg-core").PgColumn<{
                    name: "settings";
                    tableName: "trackable";
                    dataType: "json";
                    columnType: "PgJson";
                    data: unknown;
                    driverParam: unknown;
                    notNull: false;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableRecord: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "trackableRecord";
            schema: undefined;
            columns: {
                trackableId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "trackableId";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgUUID";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                date: import("drizzle-orm/pg-core").PgColumn<{
                    name: "date";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgDateString";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                value: import("drizzle-orm/pg-core").PgColumn<{
                    name: "value";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "trackableRecord";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableRelations: import("drizzle-orm").Relations<"trackable", {
            data: import("drizzle-orm").Many<"trackableRecord">;
        }>;
        recordRelations: import("drizzle-orm").Relations<"trackableRecord", {
            trackableId: import("drizzle-orm").One<"trackable", true>;
            userId: import("drizzle-orm").One<"auth_user", true>;
        }>;
        auth_user: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "auth_user";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                email: import("drizzle-orm/pg-core").PgColumn<{
                    name: "email";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                username: import("drizzle-orm/pg-core").PgColumn<{
                    name: "username";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                hashedPassword: import("drizzle-orm/pg-core").PgColumn<{
                    name: "hashed_password";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                settings: import("drizzle-orm/pg-core").PgColumn<{
                    name: "settings";
                    tableName: "auth_user";
                    dataType: "json";
                    columnType: "PgJson";
                    data: Record<string, unknown>;
                    driverParam: unknown;
                    notNull: false;
                    hasDefault: true;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
                role: import("drizzle-orm/pg-core").PgColumn<{
                    name: "role";
                    tableName: "auth_user";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: false;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        user_session: import("drizzle-orm/pg-core").PgTableWithColumns<{
            name: "user_session";
            schema: undefined;
            columns: {
                id: import("drizzle-orm/pg-core").PgColumn<{
                    name: "id";
                    tableName: "user_session";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                userId: import("drizzle-orm/pg-core").PgColumn<{
                    name: "user_id";
                    tableName: "user_session";
                    dataType: "string";
                    columnType: "PgVarchar";
                    data: string;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: [string, ...string[]];
                    baseColumn: never;
                }, {}, {}>;
                expiresAt: import("drizzle-orm/pg-core").PgColumn<{
                    name: "expires_at";
                    tableName: "user_session";
                    dataType: "date";
                    columnType: "PgTimestamp";
                    data: Date;
                    driverParam: string;
                    notNull: true;
                    hasDefault: false;
                    enumValues: undefined;
                    baseColumn: never;
                }, {}, {}>;
            };
            dialect: "pg";
        }>;
        trackableTypeEnum: import("drizzle-orm/pg-core").PgEnum<["boolean", "number", "range"]>;
    }>;
}, object, {
    user: {
        id: string;
        username: string;
        email: string;
    };
    session: {
        id?: string | undefined;
        expiresAt?: Date | undefined;
        fresh?: boolean | undefined;
        userId?: string | undefined;
    };
}, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map
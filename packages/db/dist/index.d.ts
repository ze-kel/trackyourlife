import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
export * from "drizzle-orm/sql";
export { alias } from "drizzle-orm/pg-core";
declare const pool: Pool;
declare const schema: {
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
};
declare const db: NodePgDatabase<typeof schema>;
export { db, pool, schema };
//# sourceMappingURL=index.d.ts.map
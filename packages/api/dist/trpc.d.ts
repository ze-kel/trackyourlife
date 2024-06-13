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
    user: User;
}) => Promise<{
    session: Session | null;
    user: User;
    db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@tyl/db/schema")>;
}>;
/**
 * Create a server-side caller
 * @see https://trpc.io/docs/server/server-side-calls
 */
export declare const createCallerFactory: <TRecord extends import("@trpc/server").TRPCRouterRecord>(router: Pick<import("@trpc/server/unstable-core-do-not-import").Router<{
    ctx: {
        session: Session | null;
        user: User;
        db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@tyl/db/schema")>;
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
        user: User;
        db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@tyl/db/schema")>;
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
            user: User;
            db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@tyl/db/schema")>;
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
            user: User;
            db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@tyl/db/schema")>;
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
    user: User;
    db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@tyl/db/schema")>;
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
    user: User;
    db: import("drizzle-orm/node-postgres").NodePgDatabase<typeof import("@tyl/db/schema")>;
}, object, {
    session: {
        user: User;
        id?: string | undefined;
        expiresAt?: Date | undefined;
        fresh?: boolean | undefined;
        userId?: string | undefined;
    };
}, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, typeof import("@trpc/server/unstable-core-do-not-import").unsetMarker, false>;
//# sourceMappingURL=trpc.d.ts.map
export declare const postRouter: {
    all: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: any;
    }>;
    byId: import("@trpc/server").TRPCQueryProcedure<{
        input: {
            id: string;
        };
        output: any;
    }>;
    create: import("@trpc/server").TRPCMutationProcedure<{
        input: any;
        output: any;
    }>;
    delete: import("@trpc/server").TRPCMutationProcedure<{
        input: string;
        output: any;
    }>;
};
//# sourceMappingURL=post.d.ts.map
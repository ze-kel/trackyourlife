export declare const trackablesRouter: {
    getTrackablesIdList: import("@trpc/server").TRPCQueryProcedure<{
        input: void;
        output: {
            id: string;
            type: "number" | "boolean" | "range";
            name: string | null;
        }[];
    }>;
};
//# sourceMappingURL=trackables.d.ts.map
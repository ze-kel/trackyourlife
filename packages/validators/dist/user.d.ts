import { z } from "zod";
export declare const ZRegister: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    username: z.ZodString;
    role: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    username: string;
    role?: string | undefined;
}, {
    email: string;
    password: string;
    username: string;
    role?: string | undefined;
}>;
export type IRegister = z.infer<typeof ZRegister>;
export declare const ZLogin: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export type ILogin = z.infer<typeof ZLogin>;
export declare const ZUserSettings: z.ZodObject<{
    favorites: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
    colorPresets: z.ZodOptional<z.ZodArray<z.ZodObject<{
        lightMode: z.ZodObject<{
            h: z.ZodDefault<z.ZodNumber>;
            s: z.ZodDefault<z.ZodNumber>;
            l: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            h: number;
            s: number;
            l: number;
        }, {
            h?: number | undefined;
            s?: number | undefined;
            l?: number | undefined;
        }>;
        darkMode: z.ZodObject<{
            h: z.ZodDefault<z.ZodNumber>;
            s: z.ZodDefault<z.ZodNumber>;
            l: z.ZodDefault<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            h: number;
            s: number;
            l: number;
        }, {
            h?: number | undefined;
            s?: number | undefined;
            l?: number | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        lightMode: {
            h: number;
            s: number;
            l: number;
        };
        darkMode: {
            h: number;
            s: number;
            l: number;
        };
    }, {
        lightMode: {
            h?: number | undefined;
            s?: number | undefined;
            l?: number | undefined;
        };
        darkMode: {
            h?: number | undefined;
            s?: number | undefined;
            l?: number | undefined;
        };
    }>, "many">>;
    timezone: z.ZodOptional<z.ZodObject<{
        name: z.ZodString;
        label: z.ZodString;
        tzCode: z.ZodString;
        utc: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        label: string;
        tzCode: string;
        utc: string;
    }, {
        name: string;
        label: string;
        tzCode: string;
        utc: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    favorites: string[];
    colorPresets?: {
        lightMode: {
            h: number;
            s: number;
            l: number;
        };
        darkMode: {
            h: number;
            s: number;
            l: number;
        };
    }[] | undefined;
    timezone?: {
        name: string;
        label: string;
        tzCode: string;
        utc: string;
    } | undefined;
}, {
    favorites?: string[] | undefined;
    colorPresets?: {
        lightMode: {
            h?: number | undefined;
            s?: number | undefined;
            l?: number | undefined;
        };
        darkMode: {
            h?: number | undefined;
            s?: number | undefined;
            l?: number | undefined;
        };
    }[] | undefined;
    timezone?: {
        name: string;
        label: string;
        tzCode: string;
        utc: string;
    } | undefined;
}>;
export type IUserSettings = z.infer<typeof ZUserSettings>;
export declare const UserSettingsFallback: IUserSettings;
//# sourceMappingURL=user.d.ts.map
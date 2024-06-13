import { z } from "zod";
export declare const colorRGB: z.ZodObject<{
    r: z.ZodDefault<z.ZodNumber>;
    g: z.ZodDefault<z.ZodNumber>;
    b: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    r: number;
    g: number;
    b: number;
}, {
    r?: number | undefined;
    g?: number | undefined;
    b?: number | undefined;
}>;
export type IColorRGB = z.infer<typeof colorRGB>;
export declare const colorHSL: z.ZodObject<{
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
export type IColorHSL = z.infer<typeof colorHSL>;
export declare const ZColorValue: z.ZodObject<{
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
}>;
export type IColorValue = z.infer<typeof ZColorValue>;
export declare const ZTrackableSettingsBase: z.ZodObject<{
    startDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
}, {
    startDate?: string | undefined;
}>;
export declare const ZTrackableSettingsBoolean: z.ZodObject<{
    inactiveColor: z.ZodOptional<z.ZodObject<{
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
    }>>;
    activeColor: z.ZodOptional<z.ZodObject<{
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
    }>>;
    startDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
    inactiveColor?: {
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
    } | undefined;
    activeColor?: {
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
    } | undefined;
}, {
    startDate?: string | undefined;
    inactiveColor?: {
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
    } | undefined;
    activeColor?: {
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
    } | undefined;
}>;
export declare const ZTrackableSettingsNumber: z.ZodObject<{
    incrementBy: z.ZodOptional<z.ZodNumber>;
    progressEnabled: z.ZodOptional<z.ZodBoolean>;
    progress: z.ZodOptional<z.ZodObject<{
        min: z.ZodOptional<z.ZodNumber>;
        max: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        min?: number | undefined;
        max?: number | undefined;
    }, {
        min?: number | undefined;
        max?: number | undefined;
    }>>;
    colorCodingEnabled: z.ZodOptional<z.ZodBoolean>;
    colorCoding: z.ZodOptional<z.ZodArray<z.ZodObject<{
        point: z.ZodNumber;
        color: z.ZodObject<{
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
        }>;
        id: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        point: number;
        color: {
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
        };
        id: string;
    }, {
        point: number;
        color: {
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
        };
        id?: string | undefined;
    }>, "many">>;
    startDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
    incrementBy?: number | undefined;
    progressEnabled?: boolean | undefined;
    progress?: {
        min?: number | undefined;
        max?: number | undefined;
    } | undefined;
    colorCodingEnabled?: boolean | undefined;
    colorCoding?: {
        point: number;
        color: {
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
        };
        id: string;
    }[] | undefined;
}, {
    startDate?: string | undefined;
    incrementBy?: number | undefined;
    progressEnabled?: boolean | undefined;
    progress?: {
        min?: number | undefined;
        max?: number | undefined;
    } | undefined;
    colorCodingEnabled?: boolean | undefined;
    colorCoding?: {
        point: number;
        color: {
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
        };
        id?: string | undefined;
    }[] | undefined;
}>;
export declare const ZTrackableSettingsRange: z.ZodObject<{
    labels: z.ZodOptional<z.ZodArray<z.ZodObject<{
        internalKey: z.ZodString;
        emoji: z.ZodOptional<z.ZodString>;
        color: z.ZodOptional<z.ZodObject<{
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
        }>>;
        id: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        internalKey: string;
        color?: {
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
        } | undefined;
        emoji?: string | undefined;
    }, {
        internalKey: string;
        color?: {
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
        } | undefined;
        id?: string | undefined;
        emoji?: string | undefined;
    }>, "many">>;
    isCycle: z.ZodOptional<z.ZodBoolean>;
    cycleToEmpty: z.ZodOptional<z.ZodBoolean>;
    startDate: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    startDate?: string | undefined;
    labels?: {
        id: string;
        internalKey: string;
        color?: {
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
        } | undefined;
        emoji?: string | undefined;
    }[] | undefined;
    isCycle?: boolean | undefined;
    cycleToEmpty?: boolean | undefined;
}, {
    startDate?: string | undefined;
    labels?: {
        internalKey: string;
        color?: {
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
        } | undefined;
        id?: string | undefined;
        emoji?: string | undefined;
    }[] | undefined;
    isCycle?: boolean | undefined;
    cycleToEmpty?: boolean | undefined;
}>;
export type IBooleanSettings = z.infer<typeof ZTrackableSettingsBoolean>;
export type INumberSettings = z.infer<typeof ZTrackableSettingsNumber>;
export type IRangeSettings = z.infer<typeof ZTrackableSettingsRange>;
export type ITrackableSettings = IBooleanSettings | INumberSettings | IRangeSettings;
export type ITrackableDataMonth = Record<number, string>;
export type ITrackableDataYear = Record<number, ITrackableDataMonth>;
export type ITrackableData = Record<number, ITrackableDataYear>;
export type ITrackableUnsaved = {
    name: string;
    type: "boolean";
    settings: IBooleanSettings;
    data: ITrackableData;
} | {
    type: "number";
    name: string;
    settings: INumberSettings;
    data: ITrackableData;
} | {
    type: "range";
    name: string;
    settings: IRangeSettings;
    data: ITrackableData;
};
export type ITrackable = ITrackableUnsaved & {
    id: string;
};
export declare const ZTrackableUpdate: z.ZodObject<{
    id: z.ZodString;
    year: z.ZodNumber;
    month: z.ZodNumber;
    day: z.ZodNumber;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    id: string;
    year: number;
    month: number;
    day: number;
}, {
    value: string;
    id: string;
    year: number;
    month: number;
    day: number;
}>;
export type ITrackableUpdate = z.infer<typeof ZTrackableUpdate>;
//# sourceMappingURL=trackable.d.ts.map
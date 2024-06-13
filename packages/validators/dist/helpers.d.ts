export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
//# sourceMappingURL=helpers.d.ts.map
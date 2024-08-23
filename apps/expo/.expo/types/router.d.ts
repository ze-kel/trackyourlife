/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/_components/dayCellBoolean` | `/_components/dayCellNumber` | `/_components/dayCellProvider` | `/_components/trackableProvider` | `/_sitemap` | `/_ui/button` | `/_ui/input` | `/_ui/spinner` | `/authContext` | `/login`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}

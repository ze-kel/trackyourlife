/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/create` | `/(app)/settings` | `/(app)/trackables` | `/_components/DayCellBoolean` | `/_components/DayCellNumber` | `/_components/DayCellProvider` | `/_components/DayCellRange` | `/_components/dayCell` | `/_components/trackableProvider` | `/_sitemap` | `/_ui/button` | `/_ui/input` | `/_ui/spinner` | `/authContext` | `/create` | `/login` | `/settings` | `/trackables`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}

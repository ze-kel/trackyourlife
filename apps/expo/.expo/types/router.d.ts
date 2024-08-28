/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/create` | `/(app)/settings` | `/(app)/trackables` | `/_components/DayCellProvider` | `/_components/dayCell` | `/_components/dayCellBoolean` | `/_components/dayCellNumber` | `/_components/dayCellRange` | `/_components/trackableProvider` | `/_sitemap` | `/_ui/button` | `/_ui/input` | `/_ui/spinner` | `/create` | `/login` | `/settings` | `/trackables`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}

/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/` | `/(app)/settings` | `/(app)/trackables` | `/(app)/trackables/` | `/(app)/trackables/[trackableId]/` | `/_components/dateController` | `/_components/dayCell` | `/_components/dayCellBoolean` | `/_components/dayCellNumber` | `/_components/dayCellProvider` | `/_components/dayCellRange` | `/_components/trackableProvider` | `/_sitemap` | `/_ui/button` | `/_ui/input` | `/_ui/spinner` | `/login` | `/settings` | `/temp/create` | `/trackables` | `/trackables/` | `/trackables/[trackableId]/`;
      DynamicRoutes: `/(app)/trackables/${Router.SingleRoutePart<T>}` | `/trackables/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/(app)/trackables/[trackableId]` | `/trackables/[trackableId]`;
    }
  }
}

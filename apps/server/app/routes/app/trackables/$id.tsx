import * as React from "react";
import { GearIcon } from "@radix-ui/react-icons";
import { QueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  Link,
  useNavigate,
  useParams,
  useRouteContext,
  useSearch,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { year } from "drizzle-orm/mysql-core";
import { z } from "zod";

import { ZGETLimits } from "@tyl/validators/api";

import { Button } from "~/@shad/button";
import DeleteButton from "~/components/DeleteButton";
import { FavoriteButton } from "~/components/FavoriteButton";
import TrackableProvider from "~/components/Providers/TrackableProvider";
import { TrackableNameEditable } from "~/components/TrackableName";
import TrackableView from "~/components/TrackableView";
import { apiS } from "~/trpc/server";

const a = z.object({
  limits: z.any(),
  id: z.string(),
});

const SF = createServerFn({ method: "GET" })
  .validator(a)
  .handler(async ({ data }) => {
    const { id, limits } = data;

    return await apiS.trackablesRouter.getTrackableById({
      id,
      limits,
    });
  });

const getDataForTrackable = async (
  queryClient: QueryClient,
  id: string,
  year: TParamsSchema["year"],
  month: TParamsSchema["month"],
) => {
  const yearValid = year !== "list";
  const monthValid = month !== "list";

  // Year view, prefetch full year
  if (yearValid && !monthValid) {
    const trackable = await SF({
      id,
      limits: {
        type: "year",
        year: year,
      },
    });

    return { trackable };
  }

  // Either both are valid, or we use special link that always gets us to current month
  if (monthValid && yearValid) {
    const trackable = await SF({
      id,
      limits: {
        type: "month",
        year: year,
        month: month,
      },
    });
    return { trackable };
  }

  // Nothing is valid. Show year view. We still prefetch current month, just to get trackable settings and info.
  const trackable = await SF({
    id,
    limits: {
      type: "month",
      year: year,
      month: month,
    },
  });

  return { trackable };
};

const paramsSchema = z.object({
  month: z
    .number()
    .min(0)
    .max(11)
    .or(z.literal("list"))
    .optional()
    .default(new Date().getMonth()),
  year: z
    .number()
    .min(1970)
    .or(z.literal("list"))
    .optional()
    .default(new Date().getFullYear()),
});

type TParamsSchema = z.infer<typeof paramsSchema>;

export const Route = createFileRoute("/app/trackables/$id")({
  component: RouteComponent,
  validateSearch: paramsSchema,
  loaderDeps: ({ search: { month, year } }) => ({ month, year }),
  loader: async ({ params, deps: { month, year } }) => {
    return { month, year };
  },
});

function RouteComponent() {
  const navigate = useNavigate({ from: Route.fullPath });
  const { month, year } = Route.useSearch();
  const params = Route.useParams();

  return (
    <TrackableProvider id={params.id}>
      <div className="content-container flex h-full max-h-full w-full flex-col">
        <div className="flex w-full items-center justify-between">
          <TrackableNameEditable />
          <div className="flex gap-2">
            <FavoriteButton variant={"outline"} />
            <Link href={`/app/trackables/${params.id}/settings`} className="">
              <Button name="settings" variant="outline" size="icon">
                <GearIcon className="h-4 w-4" />
              </Button>
            </Link>
            <DeleteButton id={params.id} />
          </div>
        </div>

        <hr className="my-4 opacity-10" />

        <TrackableView
          month={month}
          year={year}
          setMonth={(v) =>
            navigate({
              search: (prev) => ({ ...prev, month: v }),
            })
          }
          setYear={(v) =>
            navigate({ search: (prev) => ({ ...prev, year: v }) })
          }
        />
      </div>
    </TrackableProvider>
  );
}

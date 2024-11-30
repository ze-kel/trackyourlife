import { createFileRoute, redirect } from "@tanstack/react-router";

import { cn } from "~/@shad/utils/index";
import LoginForm from "~/components/LoginForm";

export const Route = createFileRoute("/login")({
  component: LoginComp,
  beforeLoad: ({ context }) => {
    if (context.user) {
      throw redirect({ to: "/app" });
    }
  },
});

function LoginComp() {
  return (
    <div
      className={cn(
        "h-full max-h-full min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50",
      )}
    >
      <div className="mx-auto box-border w-full pt-6 max-xl:col-span-2">
        <LoginForm />
      </div>
    </div>
  );
}

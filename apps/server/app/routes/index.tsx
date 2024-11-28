import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    } else {
      throw redirect({ to: "/app" });
    }
  },
  component: Home,
});

function Home() {
  return (
    <div className="p-2">
      <h3>TODO: Langing page</h3>
    </div>
  );
}

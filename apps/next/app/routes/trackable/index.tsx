import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/trackable/")({
  component: Home,
});

function Home() {
  return (
    <div className="p-2">
      <h3>Welcome asdasd!!!</h3>
    </div>
  );
}

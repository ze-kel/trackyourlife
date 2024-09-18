import { createFileRoute, Link, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/posts")({
  component: PostsComponent,
});

function PostsComponent() {
  return <div>hello auth</div>;
}

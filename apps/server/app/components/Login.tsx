import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/start";

import { loginFn } from "../routes/_authed";
import { Auth } from "./Auth";

export function Login() {
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      console.log("hello");
      await loginFn({ data: { email, password } });
    },
    onSuccess: async (ctx) => {
      await router.invalidate();
      router.navigate({ to: "/" });
    },
  });

  return (
    <div>
      asdasdasdasd
      <Auth
        actionText="Login"
        status={loginMutation.status}
        onSubmit={(e) => {
          console.log("aaaa");
          e.preventDefault();
          const formData = new FormData(e.target as HTMLFormElement);

          loginMutation.mutate({
            email: formData.get("email") as string,
            password: formData.get("password") as string,
          });
        }}
        afterSubmit={
          loginMutation.data ? (
            <>
              <div className="text-red-400">{loginMutation.data.message}</div>
              {loginMutation.data.userNotFound ? (
                <div>
                  <button
                    className="text-blue-500"
                    onClick={(e) => {}}
                    type="button"
                  >
                    Sign up instead?
                  </button>
                </div>
              ) : null}
            </>
          ) : null
        }
      />
    </div>
  );
}

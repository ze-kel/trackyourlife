
import { auth } from "src/auth/lucia";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import { ZRegister } from "@t/user";

export const POST = async (request: NextRequest) => {
	const data = await request.json() as unknown
	
	try {
		const results = ZRegister.safeParse(data)
		if(!results.success){
			return NextResponse.json(
				{
					error:  results.error.message
				},
				{
					status: 400
				}
			);
		}
	
		const {email, password, username} = results.data;

		const user = await auth.createUser({
			key: {
				providerId: "username", // auth method
				providerUserId: email.toLowerCase(), // unique id when using "username" auth method
				password // hashed by Lucia
			},
			attributes: {
				email,
                username
			}
		});
		const session = await auth.createSession({
			userId: user.userId,
			attributes: {}
		});
		const authRequest = auth.handleRequest({
			request,
			cookies
		});
		authRequest.setSession(session);
		return new Response(null, {
			status: 302,
			headers: {
				Location: "/" // redirect to profile page
			}
		});
	} catch (e) {
		return NextResponse.json(
			{
				error: "An unknown error occurred"
			},
			{
				status: 500
			}
		);
	}
};

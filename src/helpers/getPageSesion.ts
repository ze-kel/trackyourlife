import {auth} from './../auth/lucia';
import {cache} from 'react';
import { cookies } from "next/headers";


 const getPageSession = cache(() => {
	const authRequest = auth.handleRequest({
		request: null,
		cookies
	});
	return authRequest.validate();
});

export default getPageSession
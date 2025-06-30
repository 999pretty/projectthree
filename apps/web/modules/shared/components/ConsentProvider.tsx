"use client";

import { createContext, useMemo, useState, useCallback } from "react";
import Cookies from "js-cookie";

export const ConsentContext = createContext<{
	userHasConsented: boolean;
	allowCookies: () => void;
	declineCookies: () => void;
}>({
	userHasConsented: false,
	allowCookies: () => {},
	declineCookies: () => {},
});

export const ConsentProvider = ({
	children,
	initialConsent,
}: Readonly<{
	children: React.ReactNode;
	initialConsent?: boolean;
}>) => {
	const [userHasConsented, setUserHasConsented] = useState(!!initialConsent);

	const allowCookies = useCallback(() => {
		Cookies.set("consent", "true", { expires: 30 });
		setUserHasConsented(true);
	}, []);

	const declineCookies = useCallback(() => {
		Cookies.set("consent", "false", { expires: 30 });
		setUserHasConsented(false);
	}, []);

	const contextValue = useMemo(
		() => ({ userHasConsented, allowCookies, declineCookies }),
		[userHasConsented, allowCookies, declineCookies],
	);

	return (
		<ConsentContext.Provider value={contextValue}>
			{children}
		</ConsentContext.Provider>
	);
};

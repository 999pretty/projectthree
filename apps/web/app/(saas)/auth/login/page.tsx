import { LoginForm } from "@saas/auth/components/LoginForm";
import { AuthWrapper } from "@saas/shared/components/AuthWrapper";

export const metadata = {
	title: "Login",
};

export default function LoginPage() {
	return (
		<AuthWrapper>
			<LoginForm />
		</AuthWrapper>
	);
}

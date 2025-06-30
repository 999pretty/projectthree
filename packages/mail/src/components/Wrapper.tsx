import type { PropsWithChildren } from "react";
import {
	Container,
	Font,
	Head,
	Html,
	Section,
	Tailwind,
} from "@react-email/components";

import { Logo } from "./Logo";

export const Wrapper = ({ children }: Readonly<PropsWithChildren>) => {
	return (
		<Html lang="en">
			<Head>
				<Font
					fallbackFontFamily="Arial"
					fontFamily="Inter"
					fontStyle="normal"
					fontWeight={400}
				/>
			</Head>
			<Tailwind
				config={{
					theme: {
						extend: {
							colors: {
								border: "#e3ebf6",
								background: "#fafafe",
								foreground: "#292b35",
								primary: {
									DEFAULT: "#4e6df5",
									foreground: "#f6f7f9",
								},
								secondary: {
									DEFAULT: "#292b35",
									foreground: "#ffffff",
								},
								card: {
									DEFAULT: "#ffffff",
									foreground: "#292b35",
								},
							},
						},
					},
				}}
			>
				<Section className="bg-background p-4">
					<Container className="rounded-lg bg-card p-6 text-card-foreground">
						<Logo />
						{children}
					</Container>
				</Section>
			</Tailwind>
		</Html>
	);
};

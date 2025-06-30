import type { OrganizationMemberRole } from "@repo/auth";
import { useOrganizationMemberRoles } from "@saas/organizations/hooks/member-roles";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";

export const OrganizationRoleSelect = ({
	value,
	onSelect,
	disabled,
}: Readonly<{
	value: OrganizationMemberRole;
	onSelect: (value: OrganizationMemberRole) => void;
	disabled?: boolean;
}>) => {
	const organizationMemberRoles = useOrganizationMemberRoles();

	const roleOptions = Object.entries(organizationMemberRoles).map(
		([value, label]) => ({
			value,
			label,
		}),
	);

	return (
		<Select disabled={disabled} value={value} onValueChange={onSelect}>
			<SelectTrigger>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{roleOptions.map((option) => (
					<SelectItem key={option.value} value={option.value}>
						{option.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
};

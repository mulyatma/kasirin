import { Checkbox } from "@/components/ui/checkbox";

interface Permission {
    name: string;
}

interface Props {
    permissionGroups: Record<string, Permission[]>;
    selected: string[];
    onChange: (permissions: string[]) => void;
}

export default function PermissionGroup({
    permissionGroups,
    selected,
    onChange,
}: Props) {

    const toggle = (permission: string) => {
        if (selected.includes(permission)) {
            onChange(selected.filter(p => p !== permission));
        } else {
            onChange([...selected, permission]);
        }
    };

    return (
        <div className="space-y-6">
            {Object.entries(permissionGroups).map(([group, permissions]) => (
                <div key={group}>

                    <h3 className="mb-3 text-lg font-semibold">
                        {group}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">

                        {permissions.map(permission => (

                            <label
                                key={permission.name}
                                className="flex items-center gap-2"
                            >
                                <Checkbox
                                    checked={selected.includes(permission.name)}
                                    onCheckedChange={() => toggle(permission.name)}
                                />

                                {permission.name}

                            </label>

                        ))}

                    </div>

                </div>
            ))}
        </div>
    );
}
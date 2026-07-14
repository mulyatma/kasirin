import { ReactNode } from "react";

interface Props {
    search?: ReactNode;
    action?: ReactNode;
}

export default function DataTableToolbar({
    search,
    action,
}: Props) {
    return (
        <div className="relative mb-6 max-w-sm">

            {search}

            {action}

        </div>
    );
}
import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface Props {
    children: ReactNode;
}

export default function DataTable({
    children,
}: Props) {
    return (
        <Card className="m-6">

            <CardContent>

                {children}

            </CardContent>

        </Card>
    );
}
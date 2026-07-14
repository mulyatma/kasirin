interface Props {
    title?: string;
}

export default function DataTableEmpty({
    title = "No data found.",
}: Props) {
    return (
        <div className="py-16 text-center text-muted-foreground">

            {title}

        </div>
    );
}
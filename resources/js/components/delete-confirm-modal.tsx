import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    processing?: boolean;
}

export default function DeleteConfirmModal({
    open,
    title,
    description,
    onConfirm,
    onCancel,
    processing = false,
}: DeleteConfirmModalProps) {
    if (!open) {
return null;
}

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg"
                onClick={(e) => e.stopPropagation()}
            >
                <Alert variant="destructive">
                    <AlertTriangle />
                    <AlertTitle>{title}</AlertTitle>
                    <AlertDescription>{description}</AlertDescription>
                </Alert>

                <div className="mt-6 flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={processing}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={processing}
                    >
                        {processing ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
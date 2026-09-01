import Button from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold">{title}</h2>

        <p className="mt-4 text-gray-600">{message}</p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onCancel}
            className="w-full rounded-xl border px-5 py-2 hover:bg-gray-100 sm:w-auto"
          >
            Annuler
          </button>

          <Button onClick={onConfirm} className="w-full sm:w-auto">
            Supprimer
          </Button>
        </div>
      </div>
    </div>
  );
}

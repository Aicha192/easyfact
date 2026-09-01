import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface SheetProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Sheet({
  isOpen,
  title,
  onClose,
  children,
  size = 'md',
}: SheetProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShow(true);
    } else {
      const timer = setTimeout(() => {
        setShow(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
  };

  return (
    <div
      className={`
        fixed
        inset-0
        z-50
        bg-black/40
        transition-opacity
        duration-300
        ${isOpen ? 'opacity-100' : 'opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          fixed
          right-0
          top-0
          h-full
          w-full
         ${sizeClasses[size]}
          bg-white
          shadow-2xl
          transition-transform
          duration-300
          ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            px-6
            py-5
          "
        >
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>

          <button
            onClick={onClose}
            className="
              rounded-lg
              p-2
              text-slate-500
              hover:bg-slate-100
            "
          >
            <X size={22} />
          </button>
        </div>

        {/* Contenu */}

        <div
          className="
            h-[calc(100%-80px)]
            overflow-y-auto
            p-6
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

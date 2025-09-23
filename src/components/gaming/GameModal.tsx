import { ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const GameModal = ({ isOpen, onClose, children }: GameModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
        {children}
      </DialogContent>
    </Dialog>
  );
};
import { Dialog } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";

interface ModalProps {
  open: boolean;
  closeModal?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const CustomModal = ({
  open,
  closeModal = () => null,
  className = "",
  children,
}: ModalProps) => (
  <Dialog static open={open} onClose={closeModal} className="relative z-50">
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", duration: 0.4 }}
          />
          <motion.div
            className="fixed inset-0 h-screen w-screen overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ type: "spring", duration: 0.2 }}
          >
            <div className="desktop:scrollbar-reserve flex min-h-screen items-center justify-center p-4">
              <Dialog.Panel
                className={`min-h-[200px] w-full rounded-md bg-white p-7 lg:w-[450px] ${className}`}
              >
                {children}
              </Dialog.Panel>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  </Dialog>
);

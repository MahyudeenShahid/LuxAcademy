import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Trash2, ShieldAlert, X } from "lucide-react";

const TYPE_CONFIG = {
  danger:  { icon: Trash2,      color: "text-red-400",    btn: "bg-red-600 hover:bg-red-500", border: "border-red-500/30" },
  warning: { icon: AlertTriangle, color: "text-amber-400", btn: "bg-amber-600 hover:bg-amber-500", border: "border-amber-500/30" },
  info:    { icon: ShieldAlert,  color: "text-violet-400", btn: "bg-violet-600 hover:bg-violet-500", border: "border-violet-500/30" },
};

export default function ConfirmModal({ isOpen, title, message, confirmLabel = "Confirm", onConfirm, onCancel, type = "danger" }) {
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.danger;
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={`bg-[#0A051A] border ${cfg.border} rounded-2xl shadow-2xl w-full max-w-md p-8 relative`}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onCancel} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
            <div className={`w-12 h-12 rounded-full bg-[#120B24] border ${cfg.border} flex items-center justify-center mb-5`}>
              <Icon className={`w-6 h-6 ${cfg.color}`} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">{message}</p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className={`flex-1 ${cfg.btn} text-white py-3 rounded-xl font-bold text-sm transition-all`}
              >
                {confirmLabel}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-[#120B24] hover:bg-white/5 border border-[#2A1B4E] text-slate-300 hover:text-white py-3 rounded-xl font-bold text-sm transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

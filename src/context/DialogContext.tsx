import React, { createContext, useContext, useState, ReactNode } from 'react';

type DialogType = 'alert' | 'confirm';

interface DialogOptions {
    type: DialogType;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface DialogContextProps {
    alertDialog: (message: string, onConfirm?: () => void) => void;
    confirmDialog: (message: string, onConfirm: () => void, onCancel?: () => void) => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const useDialog = () => {
    const context = useContext(DialogContext);
    if (!context) {
        throw new Error('useDialog must be used within a DialogProvider');
    }
    return context;
};

export const DialogProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [dialogState, setDialogState] = useState<DialogOptions | null>(null);

    const alertDialog = (message: string, onConfirm?: () => void) => {
        setDialogState({
            type: 'alert',
            message,
            onConfirm,
        });
    };

    const confirmDialog = (message: string, onConfirm: () => void, onCancel?: () => void) => {
        setDialogState({
            type: 'confirm',
            message,
            onConfirm,
            onCancel,
        });
    };

    const handleConfirm = () => {
        if (dialogState?.onConfirm) {
            dialogState.onConfirm();
        }
        setDialogState(null);
    };

    const handleCancel = () => {
        if (dialogState?.onCancel) {
            dialogState.onCancel();
        }
        setDialogState(null);
    };

    return (
        <DialogContext.Provider value={{ alertDialog, confirmDialog }}>
            {children}
            {dialogState && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[92%] max-w-sm p-6 transform transition-all scale-100 flex flex-col gap-4 mx-auto">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{dialogState.type === 'confirm' ? '❓' : 'ℹ️'}</span>
                            <h4 className="text-base font-bold text-slate-800">
                                {dialogState.type === 'confirm' ? 'Confirmação' : 'Aviso'}
                            </h4>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">{dialogState.message}</p>
                        <div className="flex justify-end gap-3 mt-2">
                            {dialogState.type === 'confirm' && (
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                onClick={handleConfirm}
                                className="px-5 py-2 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DialogContext.Provider>
    );
};

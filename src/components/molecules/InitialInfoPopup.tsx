import React, { useEffect, useState } from 'react';

const LS_HIDE_KEY = 'leafletZenHideInitialPopup';

const InitialInfoPopup: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        const isHidden = localStorage.getItem(LS_HIDE_KEY);
        const isSessionShown = sessionStorage.getItem('leafletZenSessionPopupShown');
        if (isHidden !== 'true' && isSessionShown !== 'true') {
            setIsOpen(true);
            sessionStorage.setItem('leafletZenSessionPopupShown', 'true');
        }
    }, []);

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem(LS_HIDE_KEY, 'true');
        }
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-[92%] max-w-md p-6 flex flex-col gap-4 mx-auto">
                <div className="flex items-center gap-3">
                    <span className="text-3xl">🗺️</span>
                    <h3 className="text-lg font-bold text-slate-800">Bem-vindo ao Leaflet-Zen!</h3>
                </div>

                <div className="text-sm text-slate-600 space-y-2 leading-relaxed">
                    <p>
                        Este sistema permite o gerenciamento interativo de <strong>Pontos de Interesse</strong>,
                        <strong>Áreas de Interesse</strong> e <strong>Perímetros de Atenção</strong> diretamente no
                        mapa.
                    </p>
                    <p>
                        💡 <strong>Como usar:</strong>
                    </p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>
                            Utilize a barra flutuante <strong>"Desenhar no Mapa"</strong> ou os botões de{' '}
                            <strong>"+"</strong> no menu lateral para adicionar novas formas geográficas.
                        </li>
                        <li>
                            Selecione qualquer item da lista no menu lateral para carregá-lo no modo de edição no painel
                            superior e voar até ele.
                        </li>
                        <li>Use o ícone do olho 👁️ para ocultar ou exibir individualmente as marcações no mapa.</li>
                    </ul>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-slate-100 pt-4 mt-2">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 cursor-pointer select-none">
                        <input
                            type="checkbox"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                            className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                        />
                        Não mostrar novamente
                    </label>

                    <button
                        onClick={handleClose}
                        className="px-6 py-2.5 text-xs font-bold text-white bg-primary hover:bg-primary/95 rounded-xl shadow-md transition w-full sm:w-auto"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InitialInfoPopup;

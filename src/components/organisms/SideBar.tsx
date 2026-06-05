/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReturnToInitialButton from '../molecules/ReturnToInitialButton';
import ListRenderer from '../organisms/ListRender';
import { setFormType } from '../../redux/slices/formType';
import { clearPointOfInterest, setSelectPointOfInterest } from '../../redux/slices/pointsOfInterest';
import { clearAreaOfInterest, setSelectAreaOfInterest } from '../../redux/slices/areasOfInterest';
import { clearPerimetersAttention, setSelectPerimeterAttention } from '../../redux/slices/perimetersAttention';

const SideBar: React.FC = () => {
    const dispatch = useDispatch();
    const pointsOfInterest = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);
    const areasOfInterest = useSelector((state: any) => state.areasOfInterest.areasOfInterest);
    const perimetersAttention = useSelector((state: any) => state.perimetersAttention.perimetersAttention);

    const handleAddNew = (type: 'points' | 'areas' | 'perimeters') => {
        dispatch(clearPointOfInterest());
        dispatch(setSelectPointOfInterest(null as any));
        dispatch(clearAreaOfInterest());
        dispatch(setSelectAreaOfInterest(null as any));
        dispatch(clearPerimetersAttention());
        dispatch(setSelectPerimeterAttention(null as any));

        if (type === 'points') {
            dispatch(setFormType('AddPointForm'));
        } else if (type === 'areas') {
            dispatch(setFormType('AddAreaForm'));
        } else if (type === 'perimeters') {
            dispatch(setFormType('AddPerimeterForm'));
        }
    };

    return (
        <div className="flex flex-col items-center justify-start px-4 pt-[4rem] gap-4 h-full overflow-hidden">
            <div className="w-full">
                <ReturnToInitialButton />
            </div>

            <div className="flex-1 w-full overflow-y-auto pr-1 flex flex-col gap-6 mb-4">
                <div>
                    <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Pontos de Interesse
                        </h3>
                        <button
                            onClick={() => handleAddNew('points')}
                            className="text-primary hover:bg-slate-200/80 px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="Adicionar Novo Ponto"
                        >
                            ➕ Novo
                        </button>
                    </div>
                    <ListRenderer
                        key={`points-${pointsOfInterest.length}`}
                        data={pointsOfInterest}
                        endpoint="pointsOfInterest"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Áreas de Interesse
                        </h3>
                        <button
                            onClick={() => handleAddNew('areas')}
                            className="text-primary hover:bg-slate-200/80 px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="Adicionar Nova Área"
                        >
                            ➕ Novo
                        </button>
                    </div>
                    <ListRenderer
                        key={`areas-${areasOfInterest.length}`}
                        data={areasOfInterest}
                        endpoint="areasOfInterest"
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2 border-b border-slate-200 pb-1">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            Perímetros de Atenção
                        </h3>
                        <button
                            onClick={() => handleAddNew('perimeters')}
                            className="text-primary hover:bg-slate-200/80 px-2 py-0.5 rounded-lg text-xs font-bold transition flex items-center gap-1"
                            title="Adicionar Novo Perímetro"
                        >
                            ➕ Novo
                        </button>
                    </div>
                    <ListRenderer
                        key={`perimeters-${perimetersAttention.length}`}
                        data={perimetersAttention}
                        endpoint="perimetersAttention"
                    />
                </div>
            </div>
        </div>
    );
};

export default SideBar;

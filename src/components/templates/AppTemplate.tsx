/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Map from '../organisms/Map';
import { DataFetcher, InitialForm, AddPointForm, AddAreaForm, AddPerimeterForm } from '../molecules';
import { useSelector } from 'react-redux';
import SideBar from '../organisms/SideBar';
import InitialInfoPopup from '../molecules/InitialInfoPopup';

function App() {
    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);
    const currentForm = useSelector((state: any) => state.formType.currentForm);
    const areasOfInterest = useSelector((state: any) => state.areasOfInterest.areasOfInterest);
    const pointsOfInterest = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);
    const perimetersAttention = useSelector((state: any) => state.perimetersAttention.perimetersAttention);

    const [isLoading, setIsLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (
            initialPosition.latitude !== null &&
            initialPosition.longitude !== null &&
            initialPosition.zoomLevel !== null &&
            areasOfInterest.length !== 0 &&
            pointsOfInterest.length !== 0 &&
            perimetersAttention.length !== 0
        ) {
            setIsLoading(false);
        }
    }, [initialPosition, currentPosition, areasOfInterest, pointsOfInterest, perimetersAttention]);

    if (isLoading) {
        return (
            <div className="bg-lightBg h-[100vh] text-darkText pt-4 px-4 flex justify-center items-center">
                <h1 className="text-4xl font-bold animate-pulse">Carregando...</h1>
                <DataFetcher />
            </div>
        );
    } else {
        return (
            <div className="bg-lightBg h-screen text-darkText flex flex-col md:flex-row overflow-hidden relative">
                <DataFetcher />
                <InitialInfoPopup />

                <header className="bg-darkBg text-white px-4 py-3 flex justify-between items-center md:hidden z-30 shadow-md">
                    <h1 className="font-bold text-lg">Leaflet-Zen</h1>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-1 text-2xl focus:outline-none hover:text-highlight transition"
                    >
                        ☰
                    </button>
                </header>

                <nav
                    className={`bg-white/95 backdrop-blur-sm macro-sidebar fixed md:static inset-y-0 left-0 z-[4000] transform transition-transform duration-300 ease-in-out md:translate-x-0 w-72 flex flex-col h-full md:h-[calc(100vh-2rem)] md:m-4 md:rounded-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                >
                    <div className="relative h-full flex flex-col">
                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="absolute top-4 right-4 text-slate-700 text-xl md:hidden hover:text-highlight transition z-50"
                        >
                            ✕
                        </button>
                        <SideBar />
                    </div>
                </nav>

                {isSidebarOpen && (
                    <div
                        onClick={() => setIsSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 z-[3999] md:hidden transition-opacity"
                    />
                )}

                <main className="flex-1 flex flex-col p-4 overflow-hidden h-[calc(100vh-56px)] md:h-screen">
                    <div className="mb-4 bg-white/70 backdrop-blur-md p-4 rounded-xl macro-panel max-h-48 overflow-y-auto">
                        {currentForm === 'InitialForm' && <InitialForm />}
                        {currentForm === 'AddPointForm' && <AddPointForm />}
                        {currentForm === 'AddAreaForm' && <AddAreaForm />}
                        {currentForm === 'AddPerimeterForm' && <AddPerimeterForm />}
                    </div>

                    <div className="flex-1 rounded-xl overflow-hidden macro-map relative">
                        <Map />
                    </div>
                </main>
            </div>
        );
    }
}

export default App;

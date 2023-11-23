/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Map from '../organisms/Map';
import { DataFetcher, InitialForm, AddPointForm } from '../molecules';
import { useSelector } from 'react-redux';
import SideBar from '../organisms/SideBar';
import AddAreaForm from '../molecules/AddAreaForm';

function App() {
    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);
    const currentForm = useSelector((state: any) => state.formType.currentForm);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (
            initialPosition.latitude !== null &&
            initialPosition.longitude !== null &&
            initialPosition.zoomLevel !== null
        ) {
            setIsLoading(false);
        }
    }, [initialPosition, currentPosition]);

    if (isLoading) {
        return (
            <div className="bg-lightBg h-[100vh] text-darkText pt-4 px-4 flex justify-center items-center">
                <h1 className="text-4xl font-bold">Loading...</h1>
                <DataFetcher />
            </div>
        );
    } else {
        return (
            <div className="bg-lightBg h-[100vh] text-darkText flex">
                <nav className="bg-darkBg w-1/4">
                    <SideBar />
                </nav>
                <main className="w-9/12 mt-3">
                    <div className="ml-3">
                        {currentForm === 'InitialForm' && <InitialForm />}
                        {currentForm === 'AddPointForm' && <AddPointForm />}
                        {currentForm === 'AddAreaForm' && <AddAreaForm />}
                    </div>
                    <Map />
                </main>
            </div>
        );
    }
}

export default App;

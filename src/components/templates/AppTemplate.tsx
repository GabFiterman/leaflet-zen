/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Map from '../organisms/Map';
import { DataFetcher, InitialForm } from '../molecules';
import { useSelector } from 'react-redux';

function App() {
    const currentPosition = useSelector((state: any) => state.currentPosition);
    const initialPosition = useSelector((state: any) => state.initialPosition);
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
            <main className="bg-lightBg h-[100vh] text-darkText pt-4 px-4">
                <nav className="">
                    <h3 className="text-2xl font-bold">Initial Position</h3>
                    <InitialForm />
                </nav>
                <Map />
            </main>
        );
    }
}

export default App;

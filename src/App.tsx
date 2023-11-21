/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import Map from './components/Map';
import DataFetcher from './components/DataFetcher';
import DataInput from './components/InputForm';
import { useSelector } from 'react-redux/es/hooks/useSelector';

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
            <div className="text-center bg-rose-950 h-[100vh] pt-16 text-white">
                <h1 className="text-4xl font-bold">Loading...</h1>
                <DataFetcher />
            </div>
        );
    } else {
        return (
            <div className="text-center bg-rose-950 h-[100vh] pt-16 text-white">
                <DataInput />
                <Map />
            </div>
        );
    }
}

export default App;

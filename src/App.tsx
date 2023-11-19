// src/components/App.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { increment, decrement } from './redux/slices/counterSlice';
import CountDisplay from './CountDisplay';
import DataFetcher from './components/DataFetcher';

function App() {
    const dispatch = useDispatch();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentCount = useSelector((state: any) => state.counter.currentCount);

    const handleIncrement = () => {
        dispatch(increment());
    };

    const handleDecrement = () => {
        dispatch(decrement());
    };

    return (
        <div className="text-center bg-rose-950 h-[100vh] pt-16 text-white">
            <div>
                <div className="flex items-center justify-center w-[100vw] gap-x-4 mb-10">
                    <button
                        onClick={handleIncrement}
                        className="text-4xl bg-green-700 p-2 rounded-2xl caret-purple-5 text-white font-bold"
                    >
                        +
                    </button>
                    <button
                        onClick={handleDecrement}
                        className="text-4xl bg-red-700 p-2 rounded-2xl caret-purple-5 text-white font-bold"
                    >
                        -
                    </button>
                </div>
                <CountDisplay currentCount={currentCount} />
            </div>

            <div>
                <h1>Leaflet-Zen App</h1>
                <DataFetcher endpoint="/pointsOfInterest" />
            </div>
        </div>
    );
}

export default App;

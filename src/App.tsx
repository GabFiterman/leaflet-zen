// src/components/App.tsx
import React from 'react';
import DataFetcher from './components/DataFetcher';
import AddNewItem from './components/AddNewItem';

function App() {
    return (
        <div className="text-center bg-rose-950 h-[100vh] pt-16 text-white">
            <div>
                <h1>Leaflet-Zen App</h1>
                <AddNewItem />
                <DataFetcher endpoint="/pointsOfInterest" />
            </div>
        </div>
    );
}

export default App;

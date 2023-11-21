import Map from './components/Map';
import DataFetcher from './components/DataFetcher';

function App() {
    return (
        <div className="text-center bg-rose-950 h-[100vh] pt-16 text-white">
            <DataFetcher endpoint="/pointsOfInterest" />
            <Map />
        </div>
    );
}

export default App;

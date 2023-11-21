import Map from './components/Map';
import DataFetcher from './components/DataFetcher';
import DataInput from './components/InputForm';

function App() {
    return (
        <div className="text-center bg-rose-950 h-[100vh] pt-16 text-white">
            <DataFetcher endpoint="/pointsOfInterest" />
            <DataInput />
            <Map />
        </div>
    );
}

export default App;

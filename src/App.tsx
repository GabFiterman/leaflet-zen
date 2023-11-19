import React from 'react';
import CountDisplay from './CountDisplay';

type State = {
    currentCount: number;
};

type Props = {};

class App extends React.Component<Props, State> {
    state: State = {
        currentCount: 0,
    };

    handleIncrement = () => {
        this.setState((prevState) => ({
            currentCount: prevState.currentCount + 1,
        }));
    };

    handleDecrement = () => {
        this.setState((prevState) => ({
            currentCount: prevState.currentCount - 1,
        }));
    };

    render() {
        return (
            <div className='text-center bg-rose-950 h-[100vh] pt-16'>
                <div className='flex items-center justify-center w-[100vw] gap-x-4 mb-10'>
                    <button onClick={this.handleIncrement} className='text-4xl bg-green-700 p-2 rounded-2xl caret-purple-5 text-white font-bold'>+</button>
                    <button onClick={this.handleDecrement} className='text-4xl bg-red-700 p-2 rounded-2xl caret-purple-5 text-white font-bold'>-</button>
                </div>
                <CountDisplay currentCount={this.state.currentCount} />
            </div>
        );
    }
}

export default App;

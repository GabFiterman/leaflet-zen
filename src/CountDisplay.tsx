import React from 'react';

type Props = {
    currentCount: number;
};

function CountDisplay({ currentCount }: Props) {
    return <h1 className="text-3xl font-bold underline text-yellow-300">{currentCount}</h1>;
}

export default CountDisplay;

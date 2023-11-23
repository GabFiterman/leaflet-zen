import { useEffect, useRef } from 'react';
import ReturnToInitialButton from '../molecules/ReturnToInitialButton';
const SideBar: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center pt-10">
            <div>
                <ReturnToInitialButton />
            </div>
            <div></div>
        </div>
    );
};

export default SideBar;

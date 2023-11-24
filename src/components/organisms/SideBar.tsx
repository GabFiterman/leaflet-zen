/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSelector } from 'react-redux';
import ReturnToInitialButton from '../molecules/ReturnToInitialButton';
import AddPointOfInterestButton from '../molecules/AddPointOfInterestButton';
import AddAreaOfInterestButton from '../molecules/AddAreaOfInterestButton';
import AddPerimeterAttentionButton from '../molecules/AddPerimeterAttentionButton';
import ListRenderer from '../organisms/ListRender';

const SideBar: React.FC = () => {
    const pointsOfInterest = useSelector((state: any) => state.pointsOfInterest.pointsOfInterest);
    const areasOfInterest = useSelector((state: any) => state.areasOfInterest.areasOfInterest);
    const perimetersAttention = useSelector((state: any) => state.perimetersAttention.perimetersAttention);

    const buttonsData = [
        { buttonText: 'Add Point of Interest', listData: pointsOfInterest, endpoint: 'pointsOfInterest' },
        { buttonText: 'Add Area of Interest', listData: areasOfInterest, endpoint: 'areasOfInterest' },
        { buttonText: 'Add Perimeter Attention', listData: perimetersAttention, endpoint: 'perimetersAttention' },
    ];

    return (
        <div className="flex flex-col items-center justify-start px-6 pt-[5rem] gap-6 max-h-screen overflow-y-auto">
            <div className="w-full">
                <ReturnToInitialButton />
            </div>
            {buttonsData.map((button) => (
                <div className="flex flex-col items-center justify-center text-center w-full" key={button.buttonText}>
                    {button.buttonText === 'Add Point of Interest' && <AddPointOfInterestButton />}
                    {button.buttonText === 'Add Area of Interest' && <AddAreaOfInterestButton />}
                    {button.buttonText === 'Add Perimeter Attention' && <AddPerimeterAttentionButton />}

                    <ListRenderer key={button.listData} data={button.listData} endpoint={button.endpoint} />
                </div>
            ))}
        </div>
    );
};

export default SideBar;

import ReturnToInitialButton from '../molecules/ReturnToInitialButton';
import AddPointOfInterestButton from '../molecules/AddPointOfInterestButton';
import AddAreaOfInterestButton from '../molecules/AddAreaOfInterestButton';
import AddPerimeterAtentionButton from '../molecules/AddPerimeterAtentionButton';

const SideBar: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center pt-10 gap-6">
            <div>
                <ReturnToInitialButton />
            </div>
            <div>
                <AddPointOfInterestButton />
            </div>
            <div>
                <AddAreaOfInterestButton />
            </div>
            <div>
                <AddPerimeterAtentionButton />
            </div>
        </div>
    );
};

export default SideBar;

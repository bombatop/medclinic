import { CgSpinner } from "react-icons/cg";
import './LoadingOverlay.css'

function LoadingOverlay({ className }) {
    return (
        <div className={`${className} loading-overlay`}>
            <CgSpinner className="loader" />
        </div>
    );
}

export default LoadingOverlay;
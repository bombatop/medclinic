import { CgSpinner } from "react-icons/cg";
import './LoadingOverlay.css'

function LoadingOverlay({ className, size }) {
    return (
        <div className={`${className} loading-overlay`}>
            <CgSpinner size={size} className="loader" />
        </div>
    );
}

export default LoadingOverlay;
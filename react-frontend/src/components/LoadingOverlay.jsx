import { CgSpinner } from "react-icons/cg";
import '../styles/LoadingOverlay.css'

function LoadingOverlay() {
    return (
        <div className="loading-overlay">
            <CgSpinner className="loader" />
        </div>
    );
}

export default LoadingOverlay;
import { CgSpinner } from "react-icons/cg";
import '../styles/LoadingOverlay.css'

function LoadingOverlay({ className }) {
    return (
        <div className={`${className} loading-overlay`}>
            <CgSpinner className="loader" />
        </div>
    );
}

export default LoadingOverlay;
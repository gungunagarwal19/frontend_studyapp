import React from "react";
import Lottie from "lottie-react";
import loadingData from "../../animation/loading.json";
import "./loading.css";

const Loading = () => {
    return (
        <div className="learnmate-loading-wrapper">
            <div className="lottie-box">
                <Lottie
                    animationData={loadingData}
                    loop={true}
                    autoplay={true}
                    style={{ height: 200, width: 200 }}
                />
            </div>
            <span className="loading-text">Loading Learnmate...</span>
        </div>
    );
};

export default Loading;
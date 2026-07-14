import Lottie from "lottie-react"
import loadingData from "../../animation/loading.json"


const Loading = () => {
    return (
        <div className="loading">
            <Lottie
                animationData={loadingData}
                loop = {true}
                autoplay = {true}
                style={{ height: 250 }}
            />
        </div>
    )
}

export default Loading;
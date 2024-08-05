import Lottie from "react-lottie"
import animationData from '../assets/book.json'

//functional component to render Lottie Animation
const Loader = () => {
    return (
        <Lottie
            options={{
                loop: true,
                autoplay: true,
                animationData: animationData,
                rendererSettings: {
                    preserveAspectRatio: "xMidYMid slice"
                }
            }}
            height={400}
            width={400}
        />
    )
}

export default Loader;
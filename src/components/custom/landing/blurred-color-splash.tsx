import { FC } from "react";

const BlurredColorSplash: FC = () => {
  // Inspiration: https://youtu.be/Tmkr2kKUEgU
  return (
    <>
      <div className="absolute bg-purple-300 rounded-full opacity-70 animate-blob filter blur-xl -z-30 w-72 h-72 mix-blend-multiply "></div>
      <div className="absolute bg-yellow-300 rounded-full opacity-70 animation-delay-2000 animate-blob filter blur-xl -z-30 w-72 h-72 mix-blend-multiply"></div>
      <div className="absolute bg-pink-300 rounded-full opacity-70 animation-delay-4000 animate-blob filter blur-xl -z-30 w-72 h-72 mix-blend-multiply"></div>
    </>
  );
};

export default BlurredColorSplash;

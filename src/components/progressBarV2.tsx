import { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";

interface ProgressBarProps {
  progress: number;
}

const ProgressBar2: React.FC<ProgressBarProps> = ({ progress }) => {
  const [prevProgress, setPrevProgress] = useState(progress);

  useEffect(() => {
    setPrevProgress(progress);
  }, [progress]);

  return (
    <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="absolute bottom-0 left-0 top-0 bg-green-500 transition-all duration-500 ease-out"
        style={{
          width: `${progress}%`,
          transform: `translateX(${prevProgress - progress}%)`,
        }}
      >
        <Transition
          show={progress > 0 && progress < 6}
          enter="transition ease-in-out duration-500"
          enterFrom="w-0 opacity-0"
          enterTo="w-full opacity-100"
          leave="transition ease-in-out duration-500"
          leaveFrom="w-full opacity-100"
          leaveTo="w-0 opacity-0"
        >
          {(ref) => (
            <div
              ref={ref}
              className="absolute bottom-0 left-0 top-0 bg-green-700 opacity-50"
              style={{ width: `${prevProgress}%` }}
            ></div>
          )}
        </Transition>
      </div>
    </div>
  );
};

export default ProgressBar2;

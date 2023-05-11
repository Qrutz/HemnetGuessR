interface ProgressBarProps {
  progress: number; // a number between 0 and 100 representing the progress percentage
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="relative h-4 w-full rounded bg-gray-200">
      <div
        className="absolute left-0 top-0 h-full rounded bg-green-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

interface InputBarProps {
  value: string; // current value of the input bar
  onChange: (newValue: string) => void; // function to handle input change
  onSubmit: () => void; // function to handle form submission
}

export const InputBar: React.FC<InputBarProps> = ({
  value,
  onChange,
  onSubmit,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="relative flex items-center">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
          $
        </span>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="enter the price"
          className="w-full rounded-lg border-2 border-gray-300 py-2 pl-10 pr-3 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-opacity-50"
        />
      </div>
    </form>
  );
};

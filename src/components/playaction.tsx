
type Props = {
    onChangePlayAction: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  };

export const playAction = ({
    onChangePlayAction,
}:Props
) => {
  return (
    <div className='flex items-center justify-center min-h-screen from-teal-100 via-teal-300 to-teal-500 bg-gradient-to-br'>
        <select className="outline-none focus:outline-none p-2 bg-white rounded-3xl" value="{selectedValue}" 
              onChange={onChangePlayAction}
        >
            <option value="relaxed">Relaxed</option>
            <option value="neutral">Neutral</option>
            <option value="happy">Happy</option>
            <option value="angry">Angry</option>
            <option value="sad">Sad</option>
        </select>
    </div>
  );
};

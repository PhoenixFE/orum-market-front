import DaumPostcode from 'react-daum-postcode';

type DaumPostProps = {
  onSearchComplete: (data: any) => void;
};

const DaumPost: React.FC<DaumPostProps> = ({ onSearchComplete }) => {
  const handleComplete = (data: any) => {
    if (onSearchComplete) {
      onSearchComplete(data);
    }
  };

  return <DaumPostcode onComplete={handleComplete} />;
};

export default DaumPost;

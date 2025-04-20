interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
}

const PlaceholderImage = ({
  width = 600,
  height = 400,
  text = "Image",
  className = "",
}: PlaceholderImageProps) => {
  return (
    <div
      className={`flex items-center justify-center bg-gray-200 ${className}`}
      style={{ width, height }}
    >
      <span className="text-gray-500 text-center px-4">{text}</span>
    </div>
  );
};

export default PlaceholderImage;

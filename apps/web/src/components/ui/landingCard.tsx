interface Props {
  title: string;
  description: string;
  image: React.ReactNode; // Safer than 'any'; supports <img>, components, or URLs
}

export default function LandingCard({ title, description, image }: Props) {
  return (
    <div className="relative w-120 h-80 p-4 text-sm flex flex-col bg-blue-400 rounded-lg shadow-md">
      <div className="p-3 flex flex-col gap-2 w-96">
        <div className="text-xl font-bold text-white">
          {title}
        </div>
        <div className="text-md text-gray-100">
          {description}
        </div>
      </div>
      <div className="absolute bottom-4 right-4">
        {image}
      </div>
    </div>
  );
}
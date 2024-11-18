interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => (
  <div
    className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300
                   transform hover:-translate-y-1"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-gray-100 rounded-xl">{icon}</div>
      <div>
        <h4 className="text-gray-500 text-sm mb-1">{title}</h4>
        <p className="text-2xl font-bold text-gray-900">
          {value.toLocaleString()}
        </p>
      </div>
    </div>
  </div>
);

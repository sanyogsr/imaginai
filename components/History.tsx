import React from "react";
import { Clock, Trash2 } from "lucide-react";
import Image from "next/image";
import { useHistoryStore } from "@/store/useHistoryStore";

export const HistoryPanel: React.FC = () => {
  const { history, removeFromHistory } = useHistoryStore();

  return (
    <div className="bg-white rounded-2xl p-4 h-full overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">History</h2>
        <Clock size={20} className="text-gray-500" />
      </div>

      <div className="space-y-4 overflow-y-auto flex-1 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No history yet</p>
            <p className="text-sm">Start generating images to see them here</p>
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-all"
            >
              <div className="flex items-start space-x-3">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <Image
                    src={item.imageUrl}
                    alt={item.prompt}
                    fill
                    sizes="64px"
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800 line-clamp-2">{item.prompt}</p>
                  <span className="text-xs text-gray-500">{item.timestamp}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full text-xs">
                      {item.model}
                    </span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs">
                      {item.size}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => removeFromHistory(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-100 rounded-lg"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
// app/mymodels/page.tsx
import { fetchModels } from "@/app/actions/models.actions";
import ModelList from "@/components/MyModelList";
import React from "react";

const MyModels = async () => {
  const { data, error } = await fetchModels();

  return (
    <div className="w-full flex justify-center max-w-9xl">
      <div className="mt-8 mb-8">
        <h1 className="text-3xl font-extrabold">My Models</h1>
        {error && (
          <p className="text-red-500">Failed to load models: {error.message}</p>
        )}
        <ModelList models={data} />
      </div>
    </div>
  );
};

export default MyModels;

// app/mymodels/page.tsx
import { fetchModels } from "@/app/actions/models.actions";
import React from "react";
import ModelList from "./MyModelList";

const MyModels = async () => {
  const { data, error } = await fetchModels();

  return (
    <section className="container mx-auto">
      <div className="mt-8 mb-8">
        <h1 className="text-3xl font-extrabold">My Models</h1>
        {error && (
          <p className="text-red-500">Failed to load models: {error.message}</p>
        )}
        <ModelList models={data} />
      </div>
    </section>
  );
};

export default MyModels;

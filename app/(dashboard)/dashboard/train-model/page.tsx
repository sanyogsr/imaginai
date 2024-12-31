import { ModelTraining } from "@/components/ModelTraining";
import MyModels from "@/components/MyModels";

function TrainingModel() {
  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Header Section */}

          {/* Main Content */}
          <div className="grid gap-8">
            {/* Training Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className=" mb-12">
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900">
                  Train your model
                </h1>
              </div>
              <ModelTraining />
            </div>

            {/* Models Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <MyModels />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrainingModel;

import ModelGrid from "@/components/dashboard/ModelGrid";
import Footer from "@/components/DashboardFooter";
import MyModels from "@/components/MyModels";

export default function Home() {
  return (
    <main className="container max-w-7xl mx-auto px-4 py-8 space-y-12">
      {/* <ModelCategories /> */}
      <ModelGrid />
      <MyModels />
      <Footer />
    </main>
  );
}

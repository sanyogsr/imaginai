// import DashboardNavbar from "@/components/DashboardNavbar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     // <div className="flex flex-col">
//     <>
//       <DashboardNavbar />
//       {children}
//     </>
//     // </div>
//   );
// }
// DashboardLayout.tsx
// DashboardLayout.tsx
import DashboardNavbar from "@/components/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <DashboardNavbar />
      <div className="flex-grow w-full overflow-x-hidden">{children}</div>
    </div>
  );
}

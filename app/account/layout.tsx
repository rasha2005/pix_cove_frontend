import NavigationSidebar from "@/components/common/NavigationSideBar";
import Header from "@/components/common/Header"; 
export default function NavigationSideBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <Header />

      {/* Content Area */}
      <div className="flex w-full pt-4 px-4 gap-4">
        <NavigationSidebar />

        <main className="flex-1 bg-white rounded-lg p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  );
}


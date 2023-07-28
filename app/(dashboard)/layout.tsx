import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
const DashboardLayout = ({
    children
}:{
    children: React.ReactNode;
}) => {
    return(
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-gray-900"> 
            {/* so on small screen devices like mobile the sidebar will be hiiden but in medium device it will be shown */}
            <Sidebar />
             <div>
                hello
             </div>
            </div>
            <main className="md:pl-72">
                {/* so that the content in it doesnot overlap with the sidebar */}
                <Navbar />
                {children}
            </main>
        </div>
    )
}
export default DashboardLayout;
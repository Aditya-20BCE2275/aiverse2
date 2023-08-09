import Navbar from "@/components/navbar";
import Sidebar from "@/components/sidebar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
const DashboardLayout = async ({
    children
}:{
    children: React.ReactNode;
}) => {
    const apiLimitCount = await getApiLimitCount(); 
    const isPro=await checkSubscription();
    return(
        <div className="h-full relative">
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0  bg-gray-900"> 
            {/* so on small screen devices like mobile the sidebar will be hiiden but in medium device it will be shown */}
            <Sidebar apiLimitCount={apiLimitCount} isPro={isPro}/>
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
import { useState, useEffect } from "react";
import { FaUsers, FaCheckCircle, FaStar, FaChartLine } from "react-icons/fa";
import toast from "react-hot-toast";
import { apiStatsHandle } from "../../config/apiStatsHandle"; // apna axios instance ya fetch handler

const Stats = () => {
    const [stats, setStats] = useState(
        {
            users: 0,
            verified: 0,
            reviews: 0,
            growth: 0,
        }
    );

    // 🔥 Backend se stats fetch karo
    const getStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await apiStatsHandle.get("/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setStats({
                users: data.users || 0,
                verified: data.verified || 0,
                reviews: data.reviews || 0,
                growth: data.growth || 0,
            });

            toast.success("Stats fetched successfully ");
        } catch (error) {
            console.error("Error fetching stats:", error.response?.data || error.message);
            toast.error("Failed to fetch stats ");
        }
    };


    useEffect(() => {
        getStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            {/* Total Users */}
            <div className="bg-white shadow rounded-xl p-4 flex items-center space-x-4">
                <FaUsers className="text-green-600 text-3xl" />
                <div>
                    <p className="text-gray-500 text-sm">Total Users</p>
                    <h2 className="text-xl font-bold">{stats.users}</h2>
                </div>
            </div>

            {/* Verified Users */}
            <div className="bg-white shadow rounded-xl p-4 flex items-center space-x-4">
                <FaCheckCircle className="text-blue-600 text-3xl" />
                <div>
                    <p className="text-gray-500 text-sm">Verified Users</p>
                    <h2 className="text-xl font-bold">{stats.verified}</h2>
                </div>
            </div>

            {/* Reviews */}
            <div className="bg-white shadow rounded-xl p-4 flex items-center space-x-4">
                <FaStar className="text-yellow-500 text-3xl" />
                <div>
                    <p className="text-gray-500 text-sm">Reviews</p>
                    <h2 className="text-xl font-bold">{stats.reviews}</h2>
                </div>
            </div>

            {/* Growth */}
            <div className="bg-white shadow rounded-xl p-4 flex items-center space-x-4">
                <FaChartLine className="text-purple-600 text-3xl" />
                <div>
                    <p className="text-gray-500 text-sm">Growth</p>
                    <h2 className="text-xl font-bold">{stats.growth}%</h2>
                </div>
            </div>
        </div>
    );
};

export default Stats;

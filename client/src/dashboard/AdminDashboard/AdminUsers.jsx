import { useEffect, useState } from "react";
import { FaTrash, FaSearch, } from 'react-icons/fa';
import toast from "react-hot-toast";
import { apiAuthHandle } from "../../config/apiAuthHandle"; // apna API handler

// date formatting
function formatCustomDate(dateString) {
  const date = new Date(dateString);
  const day = date.getDate();
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'short' });
  return `${day}-${month}-${year}`;
}

const AdminUsers = () => {
  // ===== States =====
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // ===== Fetch Users =====
  const getUsersData = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await apiAuthHandle.get(`/getUserData`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(data?.data || []);
    } catch (error) {
      toast.error("Error fetching users");
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  // ===== Delete User =====
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await apiAuthHandle.delete(`/deleteUserData/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data?.message || "User deleted");

      // real-time update
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (error) {
      toast.error(error.message);
      console.error("Error in deleting user:", error);
    }
  };



  // ===== Search & Pagination =====
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);


  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* ===== Header + Search + Add Button ===== */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">All Users</h2>
        <div className="flex space-x-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="pl-10 pr-4  py-2 w-[300px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // reset page on new search
              }}
            />
          </div>

        </div>
      </div>



      {/* ===== User Table ===== */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentUsers.length > 0 ? (
              currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {user.isVerified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {formatCustomDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => deleteUser(user._id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Pagination ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${currentPage === i + 1
                ? "bg-green-600 text-white"
                : "bg-gray-200"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;



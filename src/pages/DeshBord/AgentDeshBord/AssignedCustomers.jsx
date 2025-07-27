import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";

import UseAuth from "../../../Hooks/UseAuth";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Modal from "../../ShardeComponents/Modal";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";

export default function AssignedCustomers() {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [selectedApp, setSelectedApp] = useState(null);

    // Get assigned customers
    const { data: assignedApps = [], refetch, isLoading, isError } = useQuery({
        queryKey: ["assignedApps", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/applications/assigned?agent=${user?.email}`);
            return res.data;
        },
    });
    console.log(assignedApps)

    
    // Update application status
    const handleStatusChange = async (id, newStatus, policyId) => {
        try {
            console.log("Updating application status:", id, newStatus);
            const statusRes = await axiosSecure.patch(`/applications/${id}/status`, { status: newStatus });
        

            if (newStatus === "Approved" && policyId) {
       
                const countRes = await axiosSecure.patch(`/policies/${policyId}/increase-count`);
          
            }

            Swal.fire("Updated!", `Application marked as ${newStatus}`, "success");
            refetch();
        } catch (error) {
            console.error("❌ Error updating application or purchase count:", error);
            Swal.fire("Error", "Failed to update status", "error");
        }
    };
 if (isLoading) return <Loading/>
    if (isError) return <p className="p-4 text-center text-red-600">Failed to load policies</p>;
    
  return (

    <>
          <PageTitle title="Assigned Customers" /> 
    
      <div className="p-6">

          <h2 className="text-2xl font-bold mb-6">Assigned Customers</h2>

          {/* Table view for large screens */}
          <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full bg-white shadow rounded-lg">
                  <thead>
                      <tr className="bg-gray-100 text-gray-700 text-left">
                          <th className="py-3 px-4">Customer Name</th>
                          <th className="py-3 px-4">Email</th>
                          <th className="py-3 px-4">Policy</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {assignedApps.map((app) => (
                          <tr key={app._id} className="border-b">
                              <td className="py-3 px-4">{app.name}</td>
                              <td className="py-3 px-4">{app.email}</td>
                              <td className="py-3 px-4">{app?.policyData?.title}</td>
                              <td className="py-3 px-4">
                                  <select
                                      className="border px-2 py-1 rounded"
                                      value={app.status}
                                      onChange={(e) =>
                                          handleStatusChange(app._id, e.target.value, app?.policyData?._id)
                                      }
                                  >
                                      <option value="Pending">Pending</option>
                                      <option value="Approved">Approved</option>
                                      <option value="Rejected">Rejected</option>
                                  </select>
                              </td>
                              <td className="py-3 px-4">
                                  <button
                                      onClick={() => setSelectedApp(app)}
                                      className="text-blue-600 hover:underline"
                                  >
                                      View Details
                                  </button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Card view for mobile screens */}
          <div className="md:hidden flex flex-col gap-4">
              {assignedApps.map((app) => (
                  <div
                      key={app._id}
                      className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
                  >
                      <p><strong>Name:</strong> {app.name}</p>
                      <p><strong>Email:</strong> {app.email}</p>
                      <p><strong>Policy:</strong> {app?.policyData?.title}</p>
                      <p className="mt-2"><strong>Status:</strong></p>
                      <select
                          className="mt-1 w-full border px-2 py-1 rounded"
                          value={app.status}
                          onChange={(e) =>
                              handleStatusChange(app._id, e.target.value, app?.policyData?._id)
                          }
                      >
                          <option value="Pending">Pending</option>
                          <option value="Approved">Approved</option>
                          <option value="Rejected">Rejected</option>
                      </select>
                      <button
                          onClick={() => setSelectedApp(app)}
                          className="mt-3 text-blue-600 hover:underline"
                      >
                          View Details
                      </button>
                  </div>
              ))}
          </div>

          {/* Modal */}
          {selectedApp && (
              <Modal
                  isOpen={!!selectedApp}
                  onClose={() => setSelectedApp(null)}
                  title="Application Details"
              >
                  <p><strong>Name:</strong> {selectedApp.name}</p>
                  <p><strong>Email:</strong> {selectedApp.email}</p>
                  <p><strong>Address:</strong> {selectedApp.address}</p>
                  <p><strong>Nominee:</strong> {selectedApp.nomineeName} ({selectedApp.nomineeRelation})</p>
                  <p><strong>Health Issues:</strong> {selectedApp.healthDisclosure?.join(", ")}</p>
              </Modal>
          )}
      </div>
    </>

    );
}

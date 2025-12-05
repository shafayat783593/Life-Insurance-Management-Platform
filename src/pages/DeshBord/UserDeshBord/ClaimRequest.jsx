// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useQuery } from "@tanstack/react-query";
// import Swal from "sweetalert2";
// import UseAuth from "../../../Hooks/UseAuth";
// import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
// import Loading from "../../../components/Loader/Loading";
// import PageTitle from "../../../Hooks/PageTItle";
// import axios from "axios";

// export default function ClaimRequest() {
//     const { user } = UseAuth();
//     const axiosSecure = UseAxiosSecure();
//     const [openModal, setOpenModal] = useState(false);
//     const [selectedPolicy, setSelectedPolicy] = useState(null);
//     // console.log(selectedPolicy)
//     const {
//         register,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm();

//     // Fetch approved application + claim info for user
//     const {
//         data: application = [],
//         refetch,
//         isLoading,
//     } = useQuery({
//         queryKey: ["approvedPolicies", user?.email],
//         queryFn: async () => {
//             const res = await axiosSecure.get(`/claims/user-approved?email=${user?.email}`);
//             return res.data;
//         },
//         enabled: !!user?.email,
//     });


//     const onSubmit = async (formData) => {
//         if (!selectedPolicy) return;

//         const file = formData.document[0];
//         const imgbbKey = import.meta.env.VITE_IMG_UPLODE_KEY;
//         const imgbbUrl = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;

//         try {
//             // 1. Upload image to ImgBB
//             const form = new FormData();
//             form.append("image", file);

//             const uploadRes = await axios.post(imgbbUrl, form);
//             const documentUrl = uploadRes.data.data.url;

//             // 2. Prepare payload with documentUrl
//             const payload = {
//                 applicationId: selectedPolicy._id,
//                 policyTitle: selectedPolicy?.policyData?.title,
//                 userEmail: user?.email,
//                 reason: formData.reason,
//                 status: "Pending",
//                 documentUrl,
//             };

//             // 3. Send claim data to backend
//             const res = await axiosSecure.post("/claims", payload);
//             if (res.data?.insertedId) {
//                 Swal.fire("✅ Success!", "Your claim request has been submitted.", "success");
//                 setOpenModal(false);
//                 reset();
//                 refetch();
//             }
//         } catch (error) {
//             console.error("❌ Error submitting claim:", error);
//             Swal.fire("Error", "Failed to submit your claim. Please try again.", "error");
//         }
//     };

//     if (isLoading) return <Loading />;

//     return (
//         <div className="p-6 max-w-6xl mx-auto">
//             <PageTitle title="Claim Request" /> 
//             <h2 className="text-2xl font-bold mb-4">📋 Claim Your Approved Policies</h2>

//             {application.length === 0 ? (
//                 <p>No approved  police found.</p>
//             ) : (
//                 <div className="overflow-x-auto  shadow rounded">
//                     <table className="table w-full text-sm">
//                         <thead className=" ">
//                             <tr>
//                                 <th className="p-3 text-left">Policy Title</th>
//                                 <th className="p-3">Coverage</th>
//                                 <th className="p-3">Duration</th>
//                                 <th className="p-3">Claim Status</th>
//                                 <th className="p-3">Action</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {application.map((appli) => (
//                                 <tr key={appli._id} className="border-t">
//                                     <td className="p-3">{appli.policyData?.title}</td>
//                                     <td className="p-3">{appli.quote?.coverageAmount || "-"}</td>
//                                     <td className="p-3">{appli.quote?.duration || "-"}</td>
//                                     <td className="p-3 font-semibold">
//                                         {appli.claimStatus ? (
//                                             <span
//                                                 className={`text-${appli.claimStatus === "Approved" ? "green" : "orange"
//                                                     }-600`}
//                                             >
//                                                 {appli.claimStatus}
//                                             </span>
//                                         ) : (
//                                             "Not Claimed"
//                                         )}
//                                     </td>
//                                     <td className="p-3">
//                                         {(!appli.claimStatus || appli.claimStatus === "Not Claimed") && (
//                                             <button
//                                                 onClick={() => {
//                                                     setSelectedPolicy(appli);
//                                                     setOpenModal(true);
//                                                 }}
//                                                 className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
//                                             >
//                                                 Claim
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}

//             {/* Modal */}
//             {openModal && selectedPolicy && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//                     <div className="bg-white w-full max-w-lg p-6 rounded shadow-lg relative">
//                         <button
//                             onClick={() => setOpenModal(false)}
//                             className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
//                             aria-label="Close modal"
//                         >
//                             ×
//                         </button>
//                         <h3 className="text-xl font-bold mb-4">Submit Claim</h3>

//                         <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
//                             <div>
//                                 <label className="block font-medium mb-1">Policy Name</label>
//                                 <input
//                                     type="text"
//                                     value={selectedPolicy.policyData?.title}
//                                     readOnly
//                                     className="w-full border px-3 py-2 rounded bg-gray-100"
//                                 />
//                             </div>

//                             <div>
//                                 <label className="block font-medium mb-1">Reason for Claim</label>
//                                 <textarea
//                                     {...register("reason", { required: true })}
//                                     rows={3}
//                                     placeholder="Why are you submitting a claim?"
//                                     className="w-full border px-3 py-2 rounded"
//                                 />
//                                 {errors.reason && <p className="text-red-500 text-sm">Reason is required</p>}
//                             </div>

//                             <div>
//                                 <label className="block font-medium mb-1">Upload Document (PDF/Image)</label>
//                                 <input
//                                     type="file"
//                                     accept="application/pdf,image/*"
//                                     {...register("document", { required: false })}
//                                     className="w-full"
//                                 />
//                                 {/* {errors.document && <p className="text-red-500 text-sm">Document is required</p>} */}
//                             </div>

//                             <button
//                                 type="submit"
//                                 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//                             >
//                                 Submit Claim
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }






























import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
    FaFileAlt,
    FaUpload,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaExclamationCircle,
    FaInfoCircle,
    FaPaperclip,
    FaShieldAlt,
    FaRegFilePdf,
    FaImage
} from "react-icons/fa";
import { MdOutlineRequestQuote, MdClose } from "react-icons/md";
import Swal from "sweetalert2";
import UseAuth from "../../../Hooks/UseAuth";
import UseAxiosSecure from "../../../Hooks/UseAxiosSecure";
import Loading from "../../../components/Loader/Loading";
import PageTitle from "../../../Hooks/PageTItle";
import axios from "axios";

export default function ClaimRequest() {
    const { user } = UseAuth();
    const axiosSecure = UseAxiosSecure();
    const [openModal, setOpenModal] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [uploading, setUploading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    // Fetch approved application + claim info for user
    const {
        data: application = [],
        refetch,
        isLoading,
    } = useQuery({
        queryKey: ["approvedPolicies", user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/claims/user-approved?email=${user?.email}`);
            return res.data;
        },
        enabled: !!user?.email,
    });

    const onSubmit = async (formData) => {
        if (!selectedPolicy) return;

        const file = formData.document[0];
        const imgbbKey = import.meta.env.VITE_IMG_UPLODE_KEY;
        const imgbbUrl = `https://api.imgbb.com/1/upload?key=${imgbbKey}`;

        setUploading(true);

        try {
            // 1. Upload image to ImgBB
            const form = new FormData();
            form.append("image", file);

            const uploadRes = await axios.post(imgbbUrl, form);
            const documentUrl = uploadRes.data.data.url;

            // 2. Prepare payload with documentUrl
            const payload = {
                applicationId: selectedPolicy._id,
                policyTitle: selectedPolicy?.policyData?.title,
                userEmail: user?.email,
                reason: formData.reason,
                status: "Pending",
                documentUrl,
                submittedAt: new Date().toISOString(),
            };

            // 3. Send claim data to backend
            const res = await axiosSecure.post("/claims", payload);
            if (res.data?.insertedId) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your claim request has been submitted.',
                    showConfirmButton: false,
                    timer: 2000,
                    customClass: {
                        popup: 'border-2 border-green-500 shadow-xl'
                    }
                });
                setOpenModal(false);
                reset();
                refetch();
            }
        } catch (error) {
            console.error("❌ Error submitting claim:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to submit your claim. Please try again.',
                customClass: {
                    popup: 'border-2 border-red-500 shadow-xl'
                }
            });
        } finally {
            setUploading(false);
        }
    };

    const formatAmount = (amount) => {
        if (!amount) return "N/A";
        if (amount >= 10000000) return (amount / 10000000).toFixed(2) + " কোটি";
        if (amount >= 100000) return (amount / 100000).toFixed(2) + " লাখ";
        if (amount >= 1000) return (amount / 1000).toFixed(2) + " হাজার";
        return amount + " ৳";
    };

    const getClaimStatusIcon = (status) => {
        switch (status) {
            case "Approved": return <FaCheckCircle className="text-green-500" />;
            case "Pending": return <FaClock className="text-yellow-500" />;
            case "Rejected": return <FaTimesCircle className="text-red-500" />;
            default: return <FaExclamationCircle className="text-blue-500" />;
        }
    };

    const getClaimStatusColor = (status) => {
        switch (status) {
            case "Approved": return "border-green-500 text-green-700";
            case "Pending": return "border-yellow-500 text-yellow-700";
            case "Rejected": return "border-red-500 text-red-700";
            default: return "border-blue-500 text-blue-700";
        }
    };

    if (isLoading) return <Loading />;

    // Calculate statistics
    const claimedPolicies = application.filter(app => app.claimStatus);
    const pendingClaims = application.filter(app => app.claimStatus === "Pending");

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            <PageTitle title="Claim Request" />

            {/* Header with Stats */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl sm:text-3xl font-bold mb-2 flex items-center gap-3">
                    <FaShieldAlt className="text-blue-500" /> Claim Request
                </h1>
                <p className="text-gray-600 mb-6">Submit and track your insurance claims</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-blue-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-blue-700">Available Policies</h3>
                                <p className="text-2xl font-bold">{application.length}</p>
                            </div>
                            <FaFileAlt className="text-3xl text-blue-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-yellow-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-yellow-700">Pending Claims</h3>
                                <p className="text-2xl font-bold">{pendingClaims.length}</p>
                            </div>
                            <FaClock className="text-3xl text-yellow-500" />
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        className="p-4 rounded-xl border-2 border-green-500 shadow-lg"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-green-700">Total Claims</h3>
                                <p className="text-2xl font-bold">{claimedPolicies.length}</p>
                            </div>
                            <FaCheckCircle className="text-3xl text-green-500" />
                        </div>
                    </motion.div>
                </div>
            </motion.div>

            {/* Policies List */}
            {application.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                >
                    <div className="text-5xl mb-4">🛡️</div>
                    <h3 className="text-xl font-semibold mb-2">No Approved Policies</h3>
                    <p className="text-gray-600">You don't have any approved policies to claim.</p>
                </motion.div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden lg:block overflow-x-auto rounded-xl border-2 border-gray-200 shadow-lg">
                        <table className="table w-full">
                            <thead>
                                <tr className="border-b-2 border-gray-300">
                                    <th className="font-bold text-gray-700">Policy Details</th>
                                    <th className="font-bold text-gray-700">Coverage</th>
                                    <th className="font-bold text-gray-700">Duration</th>
                                    <th className="font-bold text-gray-700">Claim Status</th>
                                    <th className="font-bold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {application.map((appli, index) => (
                                        <motion.tr
                                            key={appli._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            whileHover={{
                                                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                                                borderLeft: "4px solid #3b82f6"
                                            }}
                                            className="border-b border-gray-100"
                                        >
                                            <td className="p-4">
                                                <div className="font-semibold">{appli.policyData?.title}</div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    ID: <span className="font-mono">{appli._id.slice(-8)}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-lg text-blue-600">
                                                    {formatAmount(appli.quote?.coverageAmount)}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{appli.quote?.duration || "-"}</span>
                                                    <span className="text-gray-600">Years</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {appli.claimStatus ? (
                                                    <span className={`flex items-center gap-2 px-3 py-1 rounded-full border-2 ${getClaimStatusColor(appli.claimStatus)}`}>
                                                        {getClaimStatusIcon(appli.claimStatus)}
                                                        <span className="font-semibold">{appli.claimStatus}</span>
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-gray-400 text-gray-600">
                                                        <FaExclamationCircle /> Not Claimed
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                {(!appli.claimStatus || appli.claimStatus === "Not Claimed") ? (
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            setSelectedPolicy(appli);
                                                            setOpenModal(true);
                                                        }}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-blue-500 text-blue-600 hover:shadow-lg transition-shadow"
                                                    >
                                                        <MdOutlineRequestQuote /> Submit Claim
                                                    </motion.button>
                                                ) : (
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <FaInfoCircle />
                                                        <span className="text-sm">Claim submitted</span>
                                                    </div>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="lg:hidden space-y-4">
                        <AnimatePresence>
                            {application.map((appli, index) => (
                                <motion.div
                                    key={appli._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    className="rounded-xl border-2 border-gray-200 shadow-lg p-4 hover:shadow-xl transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-lg">{appli.policyData?.title}</h3>
                                            <p className="text-gray-600 text-sm mt-1">
                                                ID: <span className="font-mono">{appli._id.slice(-6)}</span>
                                            </p>
                                        </div>
                                        {appli.claimStatus ? (
                                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full border-2 ${getClaimStatusColor(appli.claimStatus)}`}>
                                                {getClaimStatusIcon(appli.claimStatus)}
                                                <span className="text-sm font-semibold">{appli.claimStatus}</span>
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 px-3 py-1 rounded-full border-2 border-gray-400 text-gray-600">
                                                <FaExclamationCircle className="text-sm" />
                                                <span className="text-sm font-semibold">Not Claimed</span>
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div className="text-center p-3 rounded-lg border border-gray-200">
                                            <div className="text-sm font-semibold text-gray-600">Coverage</div>
                                            <div className="font-bold text-blue-600">{formatAmount(appli.quote?.coverageAmount)}</div>
                                        </div>
                                        <div className="text-center p-3 rounded-lg border border-gray-200">
                                            <div className="text-sm font-semibold text-gray-600">Duration</div>
                                            <div className="font-bold">{appli.quote?.duration || "-"} Years</div>
                                        </div>
                                    </div>

                                    {(!appli.claimStatus || appli.claimStatus === "Not Claimed") ? (
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSelectedPolicy(appli);
                                                setOpenModal(true);
                                            }}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 border-blue-500 text-blue-600 hover:shadow-lg transition-shadow"
                                        >
                                            <MdOutlineRequestQuote /> Submit Claim Request
                                        </motion.button>
                                    ) : (
                                        <div className="p-3 rounded-lg border-2 border-gray-300 text-center text-gray-600">
                                            <FaInfoCircle className="inline mr-2" />
                                            Claim request already submitted
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}

            {/* Claim Modal */}
            <AnimatePresence>
                {openModal && selectedPolicy && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="absolute inset-0 bg-black/30"
                            onClick={() => !uploading && setOpenModal(false)}
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-2xl rounded-2xl border-4 border-blue-500 shadow-2xl overflow-hidden"
                        >
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold flex items-center gap-2">
                                            <FaUpload className="text-blue-500" /> Submit Claim Request
                                        </h3>
                                        <p className="text-gray-600 mt-1">Policy: <span className="font-semibold">{selectedPolicy.policyData?.title}</span></p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => !uploading && setOpenModal(false)}
                                        disabled={uploading}
                                        className="p-2 rounded-full border-2 border-gray-400 text-gray-600 hover:border-red-500 hover:text-red-600 disabled:opacity-50"
                                    >
                                        <MdClose size={24} />
                                    </motion.button>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" encType="multipart/form-data">
                                    {/* Policy Info */}
                                    <div className="p-4 rounded-xl border-2 border-blue-200">
                                        <h4 className="font-semibold text-blue-700 mb-2 flex items-center gap-2">
                                            <FaInfoCircle /> Policy Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <span className="text-gray-600">Coverage Amount:</span>
                                                <p className="font-semibold">{formatAmount(selectedPolicy.quote?.coverageAmount)}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Duration:</span>
                                                <p className="font-semibold">{selectedPolicy.quote?.duration || "-"} Years</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Policy ID:</span>
                                                <p className="font-mono">{selectedPolicy._id.slice(-8)}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600">Premium:</span>
                                                <p className="font-semibold">{selectedPolicy.premiumAmount || "-"} ৳</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Claim Reason */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                            <FaFileAlt /> Reason for Claim
                                        </label>
                                        <textarea
                                            {...register("reason", { required: "Reason is required" })}
                                            rows={4}
                                            placeholder="Describe why you are submitting this claim (accident details, medical reasons, etc.)..."
                                            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                        />
                                        {errors.reason && (
                                            <p className="text-red-500 text-sm mt-1">{errors.reason.message}</p>
                                        )}
                                    </div>

                                    {/* Document Upload */}
                                    <div>
                                        <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                                            <FaPaperclip /> Supporting Documents
                                        </label>
                                        <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition">
                                            <input
                                                type="file"
                                                accept="application/pdf,image/*"
                                                {...register("document", {
                                                    required: "Document is required",
                                                    validate: {
                                                        fileSize: (files) =>
                                                            files[0]?.size <= 5 * 1024 * 1024 || "File size must be less than 5MB",
                                                        fileType: (files) =>
                                                            ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'].includes(files[0]?.type) ||
                                                            "Only PDF, JPEG, PNG files are allowed"
                                                    }
                                                })}
                                                className="w-full"
                                            />
                                            <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                                                <FaRegFilePdf /> <FaImage />
                                                <span>Upload PDF or image files (max 5MB)</span>
                                            </div>
                                            {errors.document && (
                                                <p className="text-red-500 text-sm mt-1">{errors.document.message}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Form Actions */}
                                    <div className="flex gap-3 pt-4">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            disabled={uploading}
                                            className="flex-1 px-6 py-3 rounded-lg border-2 border-blue-500 text-blue-600 font-semibold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {uploading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                                                    />
                                                    Uploading...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center gap-2">
                                                    <FaUpload /> Submit Claim Request
                                                </span>
                                            )}
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button"
                                            onClick={() => !uploading && setOpenModal(false)}
                                            disabled={uploading}
                                            className="px-6 py-3 rounded-lg border-2 border-gray-400 text-gray-600 font-semibold hover:shadow-lg transition-shadow disabled:opacity-50"
                                        >
                                            Cancel
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Claim Guidelines */}
            {application.length > 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 p-4 rounded-xl border-2 border-yellow-500 shadow-lg"
                >
                    <div className="flex items-start gap-4">
                        <div className="p-3 rounded-full border-2 border-yellow-500">
                            <FaInfoCircle className="text-2xl text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-yellow-700 mb-2">Claim Submission Guidelines</h3>
                            <ul className="text-gray-600 space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500">•</span>
                                    <span>Provide detailed and accurate information about your claim</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500">•</span>
                                    <span>Upload clear copies of supporting documents (medical reports, police reports, photos, etc.)</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500">•</span>
                                    <span>Claims are typically processed within 7-14 business days</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-500">•</span>
                                    <span>You will be notified via email about your claim status</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
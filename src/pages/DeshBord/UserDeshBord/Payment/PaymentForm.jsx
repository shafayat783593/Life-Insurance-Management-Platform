import {
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";


import UseAxiosSecure from "../../../../Hooks/UseAxiosSecure";
import UseAuth from "../../../../Hooks/UseAuth";
import Loading from "../../../../components/Loader/Loading";

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = UseAxiosSecure();
    const { user } = UseAuth();
    const { id } = useParams();
    console.log(id)
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState("");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);

    // Get parcel info
    const { isPending, data: application = {} } = useQuery({
        queryKey: ["application", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/application/${id}`);
            return res.data?.data;
        },
        enabled: !!id,
    });

    const amount = application?.premiumAmount || 0;
    const amountInCents = Math.round(amount * 100);

    // Create payment intent
    // useEffect(() => {
    //     if (amountInCents > 0) {
    //         axiosSecure
    //             .post("/create-payment-intent", {
    //                 amount: amountInCents, // ✅ FIXED
    //                 id,
    //             })
    //             .then((res) => setClientSecret(res.data.clientSecret))
    //             .catch((err) => setError(err.message));
    //     }
    // }, [amountInCents, id, axiosSecure]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setProcessing(true);
        setError(null);

        try {
            // 1. Create PaymentIntent from backend
            const result = await axiosSecure.post("/create-payment-intent", {
                amount: amountInCents,
                id,
            });

            const clientSecret = result.data.clientSecret;

            // 2. Confirm card payment with billing details
            const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user?.displayName || "Customer",
                        email: user?.email,
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
                return;
            }

            // 3. Save payment info to your backend
            const paymentData = {
                id,
                email: user.email,
                amount,
                transactionId: paymentIntent.id,
            };
            console.log(paymentData)
            const paymentRes = await axiosSecure.post("/payments", paymentData);

            if (paymentRes.data.paymentHistoryResult?.insertedId) {
                Swal.fire({
                    title: "Payment Successful!",
                    text: `Transaction ID: ${paymentIntent.id}`,
                    icon: "success",
                    confirmButtonText: "Go to My Parcel",
                    confirmButtonColor: "#2563eb",
                }).then(() => {
                    navigate("/dashbord/paymentHistory");
                });
            }

        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setProcessing(false);
        }
    };


    if (isPending) return <Loading />;

    return (
        <div className="max-w-3xl mx-auto mt-16 bg-white shadow-2xl rounded-2xl p-10 animate-fade-in">
            <h2 className="text-4xl font-extrabold text-center text-indigo-600 mb-8 tracking-wide">
                Secure Payment
            </h2>

            <div className="grid md:grid-cols-2 gap-6 bg-indigo-50 p-6 rounded-xl shadow-inner mb-10">
                <div>
                    <p className="text-gray-600 font-medium mb-1">📦 Parcel:</p>
                    <p className="text-lg font-semibold text-gray-800">{application?.policyData?.title}</p>
                </div>
                <div>
                    <p className="text-gray-600 font-medium mb-1">💰 Total Cost:</p>
                    <p className="text-lg font-semibold text-gray-800">${amount}</p>
                </div>
                <div>
                    <p className="text-gray-600 font-medium mb-1">🏢 Service Center:</p>
                    <p className="text-lg font-semibold text-gray-800">{application?.senderServiceCenter}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 hover:border-indigo-500 transition-colors duration-300">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#32325d",
                                    '::placeholder': {
                                        color: "#aab7c4",
                                    },
                                },
                                invalid: {
                                    color: "#fa755a",
                                },
                            },
                        }}
                        className="bg-white"
                    />
                </div>

                {error && (
                    <p className="text-red-500 text-sm font-medium animate-pulse">
                        ⚠️ {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!stripe  || processing}
                    className="w-full py-4 text-lg bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
                >
                    {processing ? "Processing..." : `Pay $${amount}`}
                </button>
            </form>
        </div>


    );
};

export default PaymentForm;

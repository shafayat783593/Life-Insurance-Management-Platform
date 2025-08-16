import React from "react";
import { Link } from "react-router";

const faqs = [
    {
        question: "How do I purchase a life insurance policy?",
        answer:
            "You can purchase a policy by selecting a plan, filling out the application form, and paying the first premium. Once approved, your policy will be active immediately.",
    },
    {
        question: "What documents are required for a claim?",
        answer:
            "Typically, beneficiaries need to submit a death certificate, policy document, and proof of identity. Additional documents may be required based on the policy type.",
    },
    {
        question: "Can I update my personal information on my policy?",
        answer:
            "Yes, you can update details like your address, phone number, and nominee details by contacting customer support or through your account dashboard.",
    },
    {
        question: "What happens if I miss a premium payment?",
        answer:
            "Missing a payment may result in policy lapse after the grace period. Some policies offer a grace period to make up payments without losing coverage.",
    },
    {
        question: "How do I contact customer support?",
        answer:
            "You can contact our support team via email, phone, or live chat. All contact details are available on the 'Contact Us' page.",
    },
];

export default function HelpCenter() {
    return (
        <div className="max-w-3xl mx-auto p-6 mt-10">
            <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                🛠 Help Center
            </h2>

            {faqs.map((faq, index) => (
                <div
                    key={index}
                    className="collapse collapse-arrow  shadow-xl rounded-2xl border border-blue-200 mt-5"
                >
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title text-lg font-semibold text-blue-400">
                        {faq.question}
                    </div>
                    <div className="collapse-content  peer-checked:animate-fade-in">
                        <p>{faq.answer}</p>
                    </div>
                </div>
            ))}

            <div className="mt-6 text-center">
                <p className="">
                    Can’t find an answer?{" "}
                    <Link to="/helpCenter" className="text-blue-600 font-semibold hover:underline">
                        Contact Support
                    </Link>
                </p>
            </div>
        </div>
    );
}

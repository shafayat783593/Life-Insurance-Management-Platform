import { FaQuestionCircle } from "react-icons/fa";
import PageTitle from "../Hooks/PageTItle";

const FAQs = () => {
    const faqData = [
        {
            question: "What is the Life Insurance Management Platform?",
            answer:
                "It's a digital solution for managing insurance policies, claims, agents, and payments — built to streamline the entire process for both customers and admins.",
        },
        {
            question: "Who can use this platform?",
            answer:
                "Customers, agents, and admins — each with role-specific dashboards for managing their responsibilities.",
        },
        {
            question: "How do I purchase a policy?",
            answer:
                "Browse the policies, click 'Apply Now', submit your info, and wait for agent approval. Then complete payment via Stripe.",
        },
        {
            question: "How are claims handled?",
            answer:
                "Customers submit a claim with reason & document, agents review it, and upon approval, the status is updated to Approved.",
        },
        {
            question: "Is my data safe?",
            answer:
                "Yes. We use modern encryption, secure login, and Stripe integration to protect your personal and payment data.",
        },
        {
            question: "Can I track my payments and status?",
            answer:
                "Yes! Go to your dashboard to view application status, download policy PDFs, and check full payment history.",
        },
    ];

    return (

        <>
            <PageTitle title="FAQ" /> 
        
        <div className="max-w-4xl mx-auto my-10 px-4">
            <h2 className="text-4xl font-bold text-center text-indigo-600 mb-8">
                <FaQuestionCircle className="inline mr-2 text-pink-500" />
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {faqData.map((faq, index) => (
                    <div
                        key={index}
                        className="collapse collapse-arrow bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 text-base-content shadow-lg rounded-xl"
                    >
                        <input type="checkbox" className="peer" />
                        <div className="collapse-title text-lg font-semibold text-indigo-700">
                            {faq.question}
                        </div>
                        <div className="collapse-content text-gray-700 peer-checked:animate-fade-in">
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </>
    );
};

export default FAQs;

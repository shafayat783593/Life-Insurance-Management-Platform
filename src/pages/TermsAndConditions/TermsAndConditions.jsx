import React from "react";

const terms = [
    {
        title: "1. Policy Coverage",
        content:
            "Your life insurance policy provides financial protection to your beneficiaries in the event of your death, as specified in your policy document. Coverage is subject to the terms, exclusions, and limitations stated herein.",
    },
    {
        title: "2. Premium Payments",
        content:
            "Premiums must be paid on or before the due date to maintain continuous coverage. Failure to pay premiums within the grace period may result in policy lapse.",
    },
    {
        title: "3. Claim Process",
        content:
            "To file a claim, beneficiaries must submit the required documents, including a death certificate and proof of policy ownership. Claims will be processed within the timeframe mentioned in the policy.",
    },
    {
        title: "4. Exclusions",
        content:
            "The policy does not cover death due to suicide within the first two years, acts of war, criminal activity, or any exclusions listed in the policy schedule.",
    },
    {
        title: "5. Policy Cancellation",
        content:
            "You may cancel your policy at any time by submitting a written request. Refunds, if applicable, will be processed as per the surrender value guidelines.",
    },
];

export default function TermsAndConditions() {
    return (
        <div className="max-w-3xl mx-auto p-6 mt-10">
            <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
                📜 Terms & Conditions
            </h2>

            {terms.map((term, index) => (
                <div
                    key={index}
                    className="collapse collapse-arrow bg-gradient-to-br  shadow-xl rounded-2xl border border-blue-200 mt-5"
                >
                    <input type="checkbox" className="peer" />
                    <div className="collapse-title text-lg font-semibold text-indigo-700">
                        {term.title}
                    </div>
                    <div className="collapse-content  peer-checked:animate-fade-in">
                        <p>{term.content}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

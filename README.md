# 🛡️ Life Insurance Management Platform


###  Live Website
[🌐 Visit Live Site](https://insurance-management-8aa90.web.app/)

---

 👨‍💼 Admin Login Credentials


 Email: sshapa17@gmail.com
Password: 1234567890Qq




1. 🔐 **Authentication & Role Management**
   - Firebase email/password and Google sign-in
   - Role-based access: Admin, Agent, Customer
   - First-time users get the `customer` role by default

2. 🏠 **Dynamic Home Page**
   - Hero slider with taglines like *"Secure Your Tomorrow Today"*
   - Popular Policies (Top 6), Customer Reviews, Latest Blogs
   - Newsletter subscription saves data to the database
   - Featured Agents section with profile data

3. 📄 **Policy Management**
   - All Policies page shows available policies with filters by type
   - Pagination with 9 policies per page
   - Each card links to a detailed view

4. 📋 **Policy Details Page**
   - Full policy info including eligibility, benefits, term, etc.
   - "Get Quote" CTA that leads to the premium estimator

5. 📈 **Quote Estimation Page (Private)**
   - Inputs: Age, Gender, Smoker, Duration, Amount
   - Calculates estimated monthly/yearly premiums

6. 📝 **Policy Application Page (Private)**
   - Collects personal info, nominee, health details
   - Submits data with a `Pending` status

7. 💬 **Customer Reviews**
   - Customers can submit a star rating and feedback
   - Reviews appear dynamically on the homepage

8. 📰 **Blogs/Articles Section**
   - Latest 4 blogs on homepage + All Blogs page
   - Read more opens modal → full blog page
   - Total visit counter increases per view

9. 🧑‍💼 **Admin Dashboard**
   - Manage Applications: View, assign agent, approve/reject
   - Manage Users: Promote/Demote, filter by role
   - Manage Policies: Add/Edit/Delete via modal form
   - Manage Transactions: View Stripe payments, optional graph

10. 🧑‍💼 **Agent Dashboard**
    - View assigned customers and approve their applications
    - Manage & write blogs (Create/Edit/Delete)
    - Policy Clearance: Approve customer claim requests

11. 👨‍👩‍👧‍👦 **Customer Dashboard**
    - View applied policies with status
    - Pay premium (Stripe) for approved policies
    - Submit claim request for purchased policies

12. 💳 **Stripe Payment Integration**
    - Secure checkout for premium payments
    - Auto update status after successful payment

13. 📤 **Claim Request System**
    - Approved users can claim policies with reason + file upload
    - Track claim status: Pending / Approved

14. 👤 **User Profile Page**
    - View and update profile photo and name
    - Role-based badge + last login info

15. 📦 **Modern Tech Stack**
    - React, Tailwind CSS, DaisyUI, Firebase, MongoDB, Node.js, Express, Stripe, React Query v5



import React from 'react'
import HeroSection from './HeroSection'
import PopularPolicies from './PopularPolicies'
import BenefitsOfLifeSure from './BenefitsLifeSure'
import AllReviews from './Review/Review'
import LatestBlogs from './Blogs/LatestBlogs'
import NewsletterSubscription from './NewsletterSubscription'
import AssignedCustomers from '../DeshBord/AgentDeshBord/AssignedCustomers'

function Home() {
  return (
    <div>
        <HeroSection/>
        <PopularPolicies/>
        <AllReviews/>
        <LatestBlogs/>
        <BenefitsOfLifeSure/>
        <AssignedCustomers/>
        <NewsletterSubscription/>
        
 
    </div>
  )
}

export default Home

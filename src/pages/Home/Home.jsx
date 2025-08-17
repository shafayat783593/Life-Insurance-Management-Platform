import React from 'react'
import HeroSection from './HeroSection'
import PopularPolicies from './PopularPolicies'
import BenefitsOfLifeSure from './BenefitsLifeSure'
import AllReviews from './Review/Review'
import LatestBlogs from './Blogs/LatestBlogs'
import NewsletterSubscription from './NewsletterSubscription'
import AssignedCustomers from '../DeshBord/AgentDeshBord/AssignedCustomers'
import FeaturedAgents from './FeaturedAgents'
import PageTitle from '../../Hooks/PageTItle'
import TrustBadges from './TrustBadges'


function Home() {
  return (
    <div>
      <PageTitle title="Home" /> 
        <HeroSection/>
        <PopularPolicies/>
        <LatestBlogs/>
        <BenefitsOfLifeSure/>
        <AllReviews/>
        <FeaturedAgents/>
        <TrustBadges/>
        <NewsletterSubscription/>
        
 
    </div>
  )
}

export default Home

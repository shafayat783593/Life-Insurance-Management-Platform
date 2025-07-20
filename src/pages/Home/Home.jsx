import React from 'react'
import HeroSection from './HeroSection'
import PopularPolicies from './PopularPolicies'
import BenefitsOfLifeSure from './BenefitsLifeSure'
import AllReviews from './Review/Review'
import LatestBlogs from './Blogs/LatestBlogs'

function Home() {
  return (
    <div>
        <HeroSection/>
        <PopularPolicies/>
        <AllReviews/>
        <LatestBlogs/>
        <BenefitsOfLifeSure/>
        
 
    </div>
  )
}

export default Home

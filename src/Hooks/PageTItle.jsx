import React from 'react'
import { Helmet } from 'react-helmet'

function PageTitle({ title }) {
    return (
        <div>

            <Helmet>

                <title> {title}</title>

            </Helmet>

        </div>
    )
}

export default PageTitle

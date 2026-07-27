import { Pagination, Stack } from '@mui/material'
import React from 'react'
import { Helmet } from 'react-helmet-async'

import ResourceImage from '@/assets/resource.png'

export const Resources = () => {
  const resourcePost = {
    title: 'How to boost sales',
    image: ResourceImage,
    description:
      'Elit nisi in eleifend sed nisi. Pulvinar at orci, proin imperdiet commodo consectetur convallis risus. Sed condimentum enim dignissim adipiscing faucibus consequat, ',
    action: 'Read More',
  }

  const resourcePosts = Array.from({ length: 12 }, () => ({ ...resourcePost }))

  return (
    <>
      <Helmet>
        <title>Resources — AuxHR</title>
        <meta
          name="description"
          content="Guides and resources to help you streamline your hiring process with AuxHR."
        />
        <link rel="canonical" href="https://auxhr.com/resources" />
        <meta property="og:title" content="Resources — AuxHR" />
        <meta
          property="og:description"
          content="Guides and resources to help you streamline your hiring process with AuxHR."
        />
        <meta property="og:url" content="https://auxhr.com/resources" />
        <meta property="og:type" content="website" />
      </Helmet>
      <div className="solution-header">
        <div className="content">
          <div className="main-texts">
            <h3 data-testId="heading">Business Resources</h3>
          </div>
          <p className="supporting-text">
            Streamline Your Hiring Process and Make Confident Decisions with
            AuxHR&apos;s Comprehensive Platform. Check back at intervals for
            more resources
          </p>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto px-4 my-28">
        <div className="text-4xl text-grey-900 mb-4">Business Resources</div>
        <p className="text-sm text-grey-500 mb-8">
          Build your tech stack with confidence and guidance, selecting from our
          resources
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {resourcePosts.map((item, index) => (
            <div key={index} className="w-full max-w-[529px]">
              <img
                src={item.image}
                alt="Resource"
                className="w-full h-[309px] mb-9"
              />
              <div className="text-2xl font-semibold mb-3">{item.title}</div>
              <div className="flex-grow text-base text-grey-500 mb-6">
                {item.description}
              </div>
              <div className="text-base text-primary-strong">{item.action}</div>
            </div>
          ))}
        </div>
      </div>
      <Stack>
        <Pagination
          count={10}
          shape="rounded"
          color="primary"
          className="m-auto my-5"
        />
      </Stack>
    </>
  )
}

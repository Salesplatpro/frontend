import { Pagination, Stack } from '@mui/material'
import React from 'react'

import ResourceImage from '../assets/resource.png'

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
      <div className="solution-header">
        <div className="content">
          <div className="main-texts">
            <h3 data-testId="heading">Business Resources</h3>
          </div>
          <p className="supporting-text">
            Streamline Your Hiring Process and Make Confident Decisions with
            SupportPro&apos;s Comprehensive Platform. Check back at intervals
            for more resources
          </p>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto px-4 my-28">
        <div className="text-4xl text-[#101828] mb-4">Business Resources</div>
        <p className="text-sm text-[#667085] mb-8">
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
              <div className="flex-grow text-base text-[#667085] mb-6">
                {item.description}
              </div>
              <div className="text-base text-[#3C6FD4]">{item.action}</div>
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

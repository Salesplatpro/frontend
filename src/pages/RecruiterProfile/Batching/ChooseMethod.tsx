import React from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { useNavigate, useParams } from 'react-router-dom'

import { ChooseMethodCard } from '../../../components/Cards'
import { PageHeaderTitle } from '../../../components/PageHeaderTitle'
import styles from './chooseMethod.module.scss'

export const description = (
  <div>
    <span>Click to upload</span> or drag and drop SVG,PNG, JPG or GIF (max
    800px, 400px)
  </div>
)

export const ChooseMethod = () => {
  const params = useParams()
  console.log(params.id)
  const navigate = useNavigate()

  const chooseMethodArray = [
    {
      id: 1,
      name: 'Upload CV',
      description,
      icon: <AiOutlineCloudUpload size={20} />,
      link: `/recruiterDashboard/scout/upload-cv/${params.id}`,
      toolTip: false,
    },
    {
      id: 2,
      name: 'Upload CV and Cover letter',
      description,
      icon: <AiOutlineCloudUpload size={20} />,
      link: `/recruiterDashboard/scout/upload-cv-cover-letter/${params.id}`,
      toolTip: true,
    },
    {
      id: 3,
      name: 'Search Talent DB',
      icon: <CiSearch size={20} />,
      description: <span>Search here</span>,
      link: `/recruiterDashboard/scout/search-talent/${params.id}`,
      toolTip: false,
    },
  ]

  return (
    <div className={styles.topContainer}>
      <PageHeaderTitle
        paramsId={params}
        description="Upload cv in batch for collective AI assesment"
      />
      <div className={styles.parent}>
        {chooseMethodArray.map((item, index) => (
          <ChooseMethodCard
            key={index}
            item={item}
            onClick={() => navigate(item.link)}
          />
        ))}
      </div>
    </div>
  )
}

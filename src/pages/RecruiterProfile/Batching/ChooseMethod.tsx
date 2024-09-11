import React from 'react'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { CiSearch } from 'react-icons/ci'
import { useNavigate } from 'react-router-dom'

import { FileDesign } from '../../../components/Cards/FileDesign'
import { PageHeaderTitle } from '../../../components/PageHeaderTitle'
import styles from './chooseMethod.module.scss'

const description = (
  <div>
    <span>Click to upload</span> or drag and drop SVG,PNG, JPG or GIF (max
    800px, 400px)
  </div>
)

export const ChooseMethod = () => {
  const navigate = useNavigate()

  const chooseMethodArray = [
    {
      id: 1,
      name: 'Upload CV',
      description,
      icon: <AiOutlineCloudUpload size={20} />,
      link: '/recruiterDashboard/scout/upload-cv',
    },
    {
      id: 2,
      name: 'Upload CV and Cover letter',
      description,
      icon: <AiOutlineCloudUpload size={20} />,
      link: '/recruiterDashboard/scout/cv-upload',
    },
    {
      id: 3,
      name: 'Search Talent DB',
      icon: <CiSearch size={20} />,
      description: <span>Search here</span>,
      link: '/recruiterDashboard/scout/search-talent',
    },
  ]

  return (
    <div className={styles.topContainer}>
      <PageHeaderTitle
        title="Choose Assessment method"
        description="Upload cv in batch for collective AI assesment"
      />
      <div className={styles.parent}>
        {chooseMethodArray.map((item, index) => (
          <div className={styles.container} onClick={() => navigate(item.link)}>
            {item.name}
            <div className={styles.innerContainer}>
              <FileDesign icon={item.icon} />
              <div className={styles.description}>{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

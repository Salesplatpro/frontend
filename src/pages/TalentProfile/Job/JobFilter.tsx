import './JobFilter.scss'

import React, { useState } from 'react'

import {
  Button,
  CheckBox,
  DropDownList,
  SearchBox,
  SelectItem,
} from '../../../components'
import { JobFiltersTypes } from './Job'
import { countries, experienceLevels, jobTypes, roles } from './JobData'
import { SalaryRange } from './SalaryRange'

type JobFiltersProps = {
  filters: JobFiltersTypes
  handleSalaryChange: (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => void
  handleCountryChange: (value: string) => void
  handleRoleChange: (role: string) => void
  handleExperienceChange: (experience: string) => void
  handleJobTypeChange: (job: string) => void
  onClose: () => void
}

export const JobFilter = ({
  filters,
  handleCountryChange,
  handleSalaryChange,
  handleRoleChange,
  handleExperienceChange,
  handleJobTypeChange,
  onClose,
}: JobFiltersProps) => {
  const [selectItemToggle, setSelectItemToggle] = useState(false)

  return (
    <div className="filter">
      <div className="filter-top">
        <div className="title">Filter</div>
        <div className="clear" onClick={onClose}>
          Clear/Close
        </div>
      </div>
      <SearchBox />
      <div>
        <div className="line" />
        <DropDownList title="Roles">
          <div className="each-list-gap">
            {roles.map((role, index) => (
              <CheckBox
                key={index}
                name={role.name}
                label={role.label}
                color="#3d3d4e"
                checked={filters.roles.includes(role.name)}
                onChange={() => handleRoleChange(role.name)}
              />
            ))}
          </div>
        </DropDownList>
        <div className="line" />
        <DropDownList title="Experience Level">
          <div className="each-list-gap">
            {experienceLevels.map((experience, index) => (
              <CheckBox
                key={index}
                name={experience.name}
                label={experience.label}
                color="#3d3d4e"
                checked={filters.experienceLevel.includes(experience.name)}
                onChange={() => handleExperienceChange(experience.name)}
              />
            ))}
          </div>
        </DropDownList>
        <div className="line" />
        <DropDownList title="Job Type">
          <div className="each-list-gap">
            {jobTypes.map((job, index) => (
              <CheckBox
                key={index}
                name={job.name}
                label={job.label}
                color="#3d3d4e"
                checked={filters.jobType.includes(job.name)}
                onChange={() => handleJobTypeChange(job.name)}
              />
            ))}
          </div>
        </DropDownList>
        <div className="line" />
        <DropDownList title="Location">
          <div className="each-list-gap">
            <SelectItem
              title="Country"
              value={filters.location}
              toggle={selectItemToggle}
              onClick={() => setSelectItemToggle(!selectItemToggle)}>
              {countries.map((country) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
                <ul
                  key={country.code}
                  onClick={() => {
                    handleCountryChange(country.name)
                    setSelectItemToggle(!selectItemToggle)
                  }}>
                  <li>{country.name}</li>
                </ul>
              ))}
            </SelectItem>
            <SelectItem title="States" disabled />
            <SelectItem title="City" disabled />
          </div>
        </DropDownList>
        <div className="line" />
        <DropDownList title="Salary Range">
          <SalaryRange
            salary={filters.salary}
            handleSalaryChange={handleSalaryChange}
          />
        </DropDownList>
        <div className="btn">
          <Button title="Apply" variant="primary" />
          <Button title="Clear" variant="secondary" />
        </div>
      </div>
    </div>
  )
}

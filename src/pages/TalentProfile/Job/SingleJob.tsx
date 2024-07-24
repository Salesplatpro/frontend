import React from 'react';
import { PiBuildingOfficeBold } from "react-icons/pi";
import { JobDetails } from "./JobDetails";
import { Button } from "../../../components";
import './SingleJob.scss';
import { GoDotFill } from "react-icons/go";


export type SingleJobProps = {
  jobTitle: string;
  jobCategory: string;
  jobDescription: string;
  details: {
    location: string;
    type: string;
    level: string;
    salary: string;
  }[]
}

export const SingleJob = ({ jobTitle, jobCategory, jobDescription, details}: SingleJobProps) => {
  return (
    <div className="singlejob-container">
      <PiBuildingOfficeBold size={36} />
      <div className="title-container">
        <div className="jobtitle">
          <div className="title">{jobTitle}</div>
          <span className="category"><GoDotFill color="#2e90fa" />{jobCategory}</span>
        </div>
        <div className="description">{jobDescription}</div>
        <div className="details-container">
          <div className="jobdetails">
            {details.map((detail, index) => (
              <JobDetails key={index} location={detail.location} type={detail.type} level={detail.level} salary={detail.salary} />
            ))}
          </div>
          <div>
            <Button title="Apply Now" />
          </div>
        </div>

      </div>
    </div>
  );
}

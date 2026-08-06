import React from 'react'
import { Link } from 'react-router-dom'

import applicationPipeline from '@/assets/application_pipeline.png'
import avatar from '@/assets/Avatar.png'
import profile from '@/assets/profile.jpeg'
import profilePics from '@/assets/profilePics.png'
import { paths } from '@/paths'

export const LandingHero = () => (
  <section className="hero">
    <h1>Fill roles twice as fast with people who actually fit.</h1>
    <p className="hero-lead">
      Auxhr is your AI-powered recruitment platform built to streamline hiring,
      match top-tier candidates, and scale your team with confidence.
    </p>
    <div className="hero-cta">
      <Link className="btn-primary" to={`/${paths.register}`}>
        Try it Free
      </Link>
    </div>

    <div className="stage">
      <div className="stage-visual">
        <img src={applicationPipeline} alt="Auxhr application pipeline" />
      </div>
      <div className="flow" aria-hidden="true">
        <div className="chip">
          <img src={avatar} alt="" />
          <span>
            <b>Ada</b> <em>is hiring a</em> <b>Head of Design</b>
          </span>
        </div>
        <div className="chip">
          <img src={profilePics} alt="" />
          <span>
            <b>Brian</b> <em>shared</em> <b>Ada’s search</b>
          </span>
        </div>
        <div className="chip">
          <img src={profile} alt="" />
          <span>
            <b>Maya</b> <em>· Recommended match</em>
          </span>
        </div>
        <div className="match">
          <div>
            <strong>Maya Lopez</strong>
            <span>Product designer · Strong fit</span>
          </div>
          <span className="pill-ok">Interested</span>
        </div>
      </div>
    </div>
  </section>
)

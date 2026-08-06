import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import avatar from '@/assets/Avatar.png'
import employer from '@/assets/employer.png'
import profile from '@/assets/profile.jpeg'
import profilePics from '@/assets/profilePics.png'
import profilePics2 from '@/assets/profilePics2.webp'
import testimonial from '@/assets/testimonial.png'
import { paths } from '@/paths'

type Tab = 'hiring' | 'talent'

export const HowItWorks = () => {
  const [tab, setTab] = useState<Tab>('hiring')

  return (
    <section className="ds-how" id="how">
      <h2 className="ds-how__title">How Auxhr works</h2>
      <p className="ds-how__lead">
        Your recruitment workflow, reinvented — for teams hiring and talent
        looking for roles that fit.
      </p>

      <div className="ds-how__tabs" role="tablist">
        <button
          type="button"
          role="tab"
          className={`ds-how__tab${tab === 'hiring' ? ' is-active' : ''}`}
          aria-selected={tab === 'hiring'}
          onClick={() => setTab('hiring')}>
          For recruiters
        </button>
        <button
          type="button"
          role="tab"
          className={`ds-how__tab${tab === 'talent' ? ' is-active' : ''}`}
          aria-selected={tab === 'talent'}
          onClick={() => setTab('talent')}>
          For talents
        </button>
      </div>

      <div
        className={`ds-how__panel${tab === 'hiring' ? ' is-active' : ''}`}
        id="panel-hiring"
        role="tabpanel"
        hidden={tab !== 'hiring'}>
        <article className="ds-how-step">
          <div className="ds-how-step__visual">
            <div className="ds-gradient-panel ds-gradient-panel--a">
              <div className="ds-card">
                <div className="ds-card__label">Role focus</div>
                <div className="ds-mock-row">
                  <span className="ds-pill ds-pill--soft">Engineering</span>
                  <span className="ds-pill ds-pill--soft">A.I.</span>
                  <span className="ds-pill ds-pill--soft">Product</span>
                </div>
              </div>
              <div className="ds-card">
                <div className="ds-card__title">Pipeline ready</div>
                <div className="ds-mock-list">
                  <div className="ds-mock-list-item">
                    <strong>Senior Frontend</strong>
                    <div className="ds-avatar-stack">
                      <img
                        className="ds-avatar ds-avatar--sm"
                        src={avatar}
                        alt=""
                      />
                      <img
                        className="ds-avatar ds-avatar--sm"
                        src={profilePics}
                        alt=""
                      />
                      <img
                        className="ds-avatar ds-avatar--sm"
                        src={profile}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="ds-mock-list-item">
                    <strong>Product Designer</strong>
                    <div className="ds-avatar-stack">
                      <img
                        className="ds-avatar ds-avatar--sm"
                        src={profilePics2}
                        alt=""
                      />
                      <img
                        className="ds-avatar ds-avatar--sm"
                        src={testimonial}
                        alt=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-how-step__copy">
            <span className="ds-step-badge">1</span>
            <h3>Post a role</h3>
            <p>
              Publish once with clarity on skills, seniority, and context. Auxhr
              structures the brief so matching starts clean.
            </p>
          </div>
        </article>

        <article className="ds-how-step ds-how-step--flip">
          <div className="ds-how-step__visual">
            <div className="ds-gradient-panel ds-gradient-panel--b">
              <div className="ds-card">
                <div
                  className="ds-mock-list-item"
                  style={{ marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '0.65rem',
                      alignItems: 'center',
                    }}>
                    <img className="ds-avatar" src={avatar} alt="" />
                    <span>
                      <strong>Ada</strong> is hiring for
                      <br />
                      <strong>Head of Design</strong> at{' '}
                      <strong>SeedTech</strong>
                    </span>
                  </div>
                </div>
                <div className="ds-mock-cta-bar">
                  I know a potential fit
                  <span className="ds-pill ds-pill--brand">Suggest →</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-how-step__copy">
            <span className="ds-step-badge">2</span>
            <h3>AI talent matching</h3>
            <p>
              Leverage AI to match candidates with roles based on skills and
              experience — then boost reach across your pipeline.
            </p>
          </div>
        </article>

        <article className="ds-how-step">
          <div className="ds-how-step__visual">
            <div className="ds-gradient-panel ds-gradient-panel--c">
              <div className="ds-card">
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                    marginBottom: '0.85rem',
                  }}>
                  <img
                    className="ds-avatar ds-avatar--lg"
                    src={profile}
                    alt=""
                  />
                  <div>
                    <strong>Maya Lopez</strong>
                    <br />
                    <span
                      style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                      }}>
                      Product designer · Strong fit
                    </span>
                  </div>
                </div>
                <div className="ds-bubble">
                  Context: “Maya ships design systems fast and collaborates
                  cleanly with engineering.”
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                  <span className="ds-pill ds-pill--brand">Shortlisted</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-how-step__copy">
            <span className="ds-step-badge">3</span>
            <h3>Review matches &amp; shortlist</h3>
            <p>
              Share recommended people with your hiring team and align on the
              best fits — discreetly and fast.
            </p>
          </div>
        </article>

        <article className="ds-how-step ds-how-step--flip">
          <div className="ds-how-step__visual">
            <div className="ds-gradient-panel ds-gradient-panel--a">
              <div className="ds-card">
                <div
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    marginBottom: '0.75rem',
                  }}>
                  <img className="ds-avatar" src={avatar} alt="" />
                  <img className="ds-avatar" src={profile} alt="" />
                  <strong>You hired Maya</strong>
                </div>
                <div className="ds-bubble">
                  “Auxhr gave us back weeks. Three top-tier hires in half the
                  usual time.”
                </div>
              </div>
            </div>
          </div>
          <div className="ds-how-step__copy">
            <span className="ds-step-badge">4</span>
            <h3>Shortlist, fast — then hire</h3>
            <p>
              Move from shortlist to offer without the pile-up. Build
              relationships that grow into future hires.
            </p>
            <Link className="ds-btn ds-btn--solid" to={`/${paths.register}`}>
              Try it Free
            </Link>
          </div>
        </article>
      </div>

      <div
        className={`ds-how__panel${tab === 'talent' ? ' is-active' : ''}`}
        id="panel-talent"
        role="tabpanel"
        hidden={tab !== 'talent'}>
        <article className="ds-how-step">
          <div className="ds-how-step__visual">
            <div className="ds-gradient-panel ds-gradient-panel--b">
              <div className="ds-card">
                <div className="ds-card__label">I&apos;m open to</div>
                <div className="ds-mock-row">
                  <span className="ds-pill ds-pill--soft">Remote</span>
                  <span className="ds-pill ds-pill--soft">Design</span>
                  <span className="ds-pill ds-pill--soft">Startups</span>
                </div>
              </div>
              <div className="ds-card">
                <div className="ds-card__title">Profile strength</div>
                <div className="ds-mock-list">
                  <div className="ds-mock-list-item">
                    <strong>Skills verified</strong>
                    <span className="ds-pill ds-pill--brand">92%</span>
                  </div>
                  <div className="ds-mock-list-item">
                    <strong>Portfolio linked</strong>
                    <span className="ds-pill ds-pill--soft">Done</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-how-step__copy">
            <span className="ds-step-badge">1</span>
            <h3>Build your profile</h3>
            <p>
              Show what you’re great at and the kinds of roles worth your time —
              so matching stays relevant.
            </p>
          </div>
        </article>

        <article className="ds-how-step ds-how-step--flip">
          <div className="ds-how-step__visual">
            <div className="ds-gradient-panel ds-gradient-panel--c">
              <div className="ds-card">
                <div className="ds-card__label">New match</div>
                <div
                  className="ds-mock-list-item"
                  style={{ marginBottom: '0.75rem' }}>
                  <div>
                    <strong>Head of Design</strong>
                    <br />
                    <span
                      style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                      }}>
                      SeedTech · Remote
                    </span>
                  </div>
                  <span className="ds-pill ds-pill--brand">Fit</span>
                </div>
                <div className="ds-mock-cta-bar">
                  Interested in this role?
                  <span className="ds-pill ds-pill--soft">View →</span>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-how-step__copy">
            <span className="ds-step-badge">2</span>
            <h3>Get matched to real roles</h3>
            <p>
              Receive opportunities through Auxhr matching — not cold spam from
              every job board.
            </p>
          </div>
        </article>

        <article className="ds-how-step">
          <div className="ds-how-step__visual">
            <div className="ds-gradient-panel ds-gradient-panel--a">
              <div className="ds-card">
                <div
                  style={{
                    display: 'flex',
                    gap: '0.75rem',
                    alignItems: 'center',
                    marginBottom: '0.85rem',
                  }}>
                  <img
                    className="ds-avatar ds-avatar--lg"
                    src={employer}
                    alt=""
                  />
                  <div>
                    <strong>Warm intro requested</strong>
                    <br />
                    <span
                      style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '0.85rem',
                      }}>
                      Hiring manager at SeedTech
                    </span>
                  </div>
                </div>
                <div className="ds-bubble">
                  “We’d love to talk about your design systems work.”
                </div>
              </div>
            </div>
          </div>
          <div className="ds-how-step__copy">
            <span className="ds-step-badge">3</span>
            <h3>Get introduced with context</h3>
            <p>
              Conversations start warm — teams already know why you’re a match
              before the first call.
            </p>
          </div>
        </article>

        <article className="ds-how-step ds-how-step--flip">
          <div className="ds-how-step__visual">
            <div className="ds-gradient-panel ds-gradient-panel--b">
              <div className="ds-card">
                <div className="ds-card__title">Offer path</div>
                <div className="ds-mock-list">
                  <div className="ds-mock-list-item">
                    <strong>Interview scheduled</strong>
                    <span className="ds-pill ds-pill--soft">Tue</span>
                  </div>
                  <div className="ds-mock-list-item">
                    <strong>Team loop</strong>
                    <span className="ds-pill ds-pill--brand">3/3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="ds-how-step__copy">
            <span className="ds-step-badge">4</span>
            <h3>Land roles that fit</h3>
            <p>
              Move from shortlist to offer with teams that already know why
              you’re a match.
            </p>
            <Link className="ds-btn ds-btn--primary" to={`/${paths.register}`}>
              Create profile
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}

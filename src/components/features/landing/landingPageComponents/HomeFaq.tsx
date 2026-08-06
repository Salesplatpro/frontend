import React from 'react'

const faqs = [
  {
    q: 'Who is Auxhr designed for?',
    a: 'Auxhr is built for SMEs, startups, companies without HR departments, and large enterprises — from micro teams to 500+ organisations.',
  },
  {
    q: 'What problems does Auxhr solve?',
    a: 'Slow hiring, unqualified applicant volume, and fragmented workflows. Auxhr streamlines posting, matching, and shortlisting in one place.',
  },
  {
    q: 'What makes Auxhr different from other HR tools?',
    a: 'Most tools only track applicants. Auxhr combines automation, smart matching, collaboration, and scalability — valuable for both SMEs and enterprises.',
  },
  {
    q: 'Do I need a dedicated HR department?',
    a: 'No. Auxhr is designed for companies with and without HR teams. If you don’t have HR, we act as your partner. If you do, we streamline their process.',
  },
]

export const HomeFaq = () => (
  <section className="faq" id="faq">
    <h2>Frequently asked questions</h2>
    {faqs.map((item, index) => (
      <details key={item.q} open={index === 0}>
        <summary>{item.q}</summary>
        <p>{item.a}</p>
      </details>
    ))}
  </section>
)

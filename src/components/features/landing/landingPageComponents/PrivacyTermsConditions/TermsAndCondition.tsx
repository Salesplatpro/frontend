import React from 'react'

import { BaseText } from '@/components/ui/Typography'

import { PolicyItem } from './PrivacyPolicy'
import styles from './PrivacyPolicy.module.scss'

export const TermsAndCondition = () => {
  return (
    <div>
      <div className={styles.topContent}>
        <BaseText fontSize="fs-4xl" fontColor="white" fontWeight="bold">
          Terms and Conditions
        </BaseText>
        <BaseText
          fontSize="fs-xl"
          fontColor="white"
          fontWeight="bold"
          className={styles.text}
        >
          By accessing our website, you are agreeing to be bound by these terms
          of service, all applicable laws and regulations, and agree that you
          are responsible for compliance with any applicable local laws.
        </BaseText>
      </div>

      <div className={styles.content}>
        <BaseText
          fontSize="fs-lg"
          fontColor="primary"
          className={styles.policy}
        >
          By accessing our website, mobile application, and related services,
          you agree to be bound by these Terms of Service, all applicable laws
          and regulations, and agree that you are responsible for compliance
          with any applicable local laws. If you do not agree, please do not use
          our services.
        </BaseText>

        <PolicyItem title="What information do we collect?">
          AuxHR collects information to provide, improve, and secure our
          services. This may include:
          <br />
          - Personal Information: Name, email, phone number, company details,
          and payment details.
          <br />
          - Account Data: Login credentials, profile details, and user
          preferences.
          <br />
          - Usage Data: Device information, IP addresses, browser type,
          operating system, and activity on our platform.
          <br />- HR & Talent Information: Resumes, employment records, job
          applications, performance data, and documents shared by organizations
          or individuals.
        </PolicyItem>

        <PolicyItem title="How do we use your information?">
          AuxHR may use the information we collect to:
          <br />
          - Provide access to AuxHR services and features.
          <br />
          - Personalize user experience and recommendations.
          <br />
          - Process transactions and manage customer accounts.
          <br />
          - Communicate with you regarding updates, promotions, or policy
          changes.
          <br />
          - Improve security, detect fraudulent activity, and ensure compliance
          with the law.
          <br />- Enhance our analytics, reporting, and performance
          optimization.
        </PolicyItem>

        <PolicyItem title="Do we use cookies and other tracking technologies?">
          Yes. AuxHR uses cookies, pixels, and other tracking technologies to:
          <br />
          - Authenticate users and maintain sessions.
          <br />
          - Remember user settings and preferences.
          <br />
          - Monitor platform performance and usage statistics.
          <br />- Deliver targeted marketing and measure campaign effectiveness.
        </PolicyItem>

        <PolicyItem title="How long do we keep your information?">
          We retain information for as long as is reasonably necessary:
          <br />
          - To deliver our services and maintain customer accounts.
          <br />
          - To comply with legal, tax, and regulatory obligations.
          <br />- To resolve disputes, enforce agreements, and protect AuxHR’s
          rights.
        </PolicyItem>

        <PolicyItem title="User Responsibilities">
          By using AuxHR, you agree to:
          <br />
          - Provide accurate and truthful information.
          <br />
          - Keep your account credentials confidential.
          <br />
          - Use the services only for lawful purposes.
          <br />
          - Not upload or share harmful, abusive, or unlawful content.
          <br />- Not interfere with or disrupt the security or functionality of
          the platform.
        </PolicyItem>

        <PolicyItem title="Intellectual Property">
          All logos, trademarks, service names, platform designs, software, and
          content remain the exclusive property of AuxHR or its licensors. Users
          may not reproduce, distribute, or exploit any part of the platform
          without prior written consent.
        </PolicyItem>

        <PolicyItem title="Limitation of Liability">
          AuxHR shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages resulting from:
          <br />
          - The use or inability to use our services.
          <br />
          - Unauthorized access to or alteration of user information.
          <br />- Content, actions, or services of third parties.
        </PolicyItem>

        <PolicyItem title="Third Party Links and Services">
          Our platform may include links or integrations with third-party
          services. AuxHR does not control these external sites and is not
          responsible for their content, policies, or practices.
        </PolicyItem>

        <PolicyItem title="Termination of Use">
          AuxHR reserves the right to suspend or terminate accounts at our
          discretion, without prior notice, if users:
          <br />
          - Breach these Terms and Conditions.
          <br />
          - Engage in fraudulent, unlawful, or abusive activity.
          <br />- Misuse or disrupt the services.
        </PolicyItem>

        <PolicyItem title="Governing Law">
          These Terms and Conditions shall be governed by and construed under
          the laws of [Insert Jurisdiction]. Any disputes will be resolved
          exclusively in the courts of [Insert Location].
        </PolicyItem>

        <PolicyItem title="Changes to These Terms">
          AuxHR may update or revise these Terms and Conditions at any time.
          Updates will be posted on this page, and continued use of our services
          indicates acceptance of the updated Terms.
        </PolicyItem>
      </div>
    </div>
  )
}

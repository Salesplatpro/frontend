import 'react-responsive-modal/styles.css'

import React, { useEffect, useMemo, useState } from 'react'
import { BsBuilding, BsCheck2Circle } from 'react-icons/bs'
import { Modal } from 'react-responsive-modal'

import { Alert } from '@/components/feedback/Alert'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useJoinOrganization } from '@/features/organizations/hooks/useJoinOrganization'
import { fetchVerifiedOrganizations } from '@/features/organizations/services/organizationService'
import { Organization } from '@/features/organizations/types'

import { CompanyLogo } from './CompanyLogo'
import styles from './JoinCompanyModal.module.scss'

interface JoinCompanyModalProps {
  open: boolean
  onClose: () => void
}

const extractDomain = (email?: string | null) =>
  email?.split('@')[1]?.toLowerCase() ?? ''

export const JoinCompanyModal: React.FC<JoinCompanyModalProps> = ({
  open,
  onClose,
}) => {
  const { requestJoin, isRequesting } = useJoinOrganization()

  const [searchTerm, setSearchTerm] = useState('')
  const [companies, setCompanies] = useState<Organization[]>([])
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false)
  const [selectedOrgId, setSelectedOrgId] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!open) {
      setSearchTerm('')
      setSelectedOrgId('')
      setWorkEmail('')
      setSubmitted(false)
      return
    }

    let isMounted = true
    setIsLoadingCompanies(true)
    fetchVerifiedOrganizations(searchTerm)
      .then((res) => {
        if (isMounted) {
          setCompanies(res.data.organizations || [])
        }
      })
      .catch(() => {
        if (isMounted) setCompanies([])
      })
      .finally(() => {
        if (isMounted) setIsLoadingCompanies(false)
      })

    return () => {
      isMounted = false
    }
  }, [open, searchTerm])

  const selectedOrg = useMemo(
    () => companies.find((c) => c.id === selectedOrgId) ?? null,
    [companies, selectedOrgId],
  )

  const requiredDomain = extractDomain(selectedOrg?.email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrgId || !workEmail.trim()) return

    const success = await requestJoin(selectedOrgId, {
      workEmail: workEmail.trim(),
    })
    if (success) {
      setSubmitted(true)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      classNames={{ overlay: 'dashboard-modal-overlay', modal: styles.modal }}>
      {submitted ? (
        <div className={styles.successState}>
          <div className={styles.successIcon}>
            <BsCheck2Circle size={28} />
          </div>
          <h2 className={styles.successTitle}>Request sent</h2>
          <p className={styles.successCopy}>
            Your request to join {selectedOrg?.name ?? 'the company'} has been
            submitted. The company owner will review it and approve you if your
            work email matches their organization.
          </p>
          <Button type="button" onClick={onClose}>
            Done
          </Button>
        </div>
      ) : (
        <>
          <div className={styles.header}>
            <h2 className={styles.title}>Join a verified company</h2>
            <p className={styles.subtitle}>
              Choose a company with a corporate email domain, then submit your
              matching work email. The company owner must approve your request.
            </p>
          </div>

          <Alert variant="info" className={styles.callout}>
            Companies registered with personal emails (Gmail, Yahoo, etc.) do
            not accept team join requests.
          </Alert>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="company-search">
                Search companies
              </label>
              <div className={styles.searchWrap}>
                <input
                  id="company-search"
                  type="text"
                  placeholder="Search by name, website, or industry..."
                  className={styles.input}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {isLoadingCompanies ? (
                <Spinner />
              ) : companies.length === 0 ? (
                <p className={styles.emptyList}>
                  No joinable verified companies found. Only companies with a
                  corporate work email domain appear here.
                </p>
              ) : (
                <div
                  className={styles.companyList}
                  role="listbox"
                  aria-label="Verified companies">
                  {companies.map((org) => {
                    const isSelected = org.id === selectedOrgId
                    return (
                      <button
                        key={org.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        className={`${styles.companyOption} ${
                          isSelected ? styles.companyOptionSelected : ''
                        }`}
                        onClick={() => setSelectedOrgId(org.id)}>
                        <CompanyLogo
                          name={org.name}
                          logoUrl={org.logoUrl}
                          size="sm"
                        />
                        <div className={styles.companyOptionBody}>
                          <p className={styles.companyOptionName}>{org.name}</p>
                          <p className={styles.companyOptionMeta}>
                            {org.industry || 'Industry not set'}
                            {org.website ? ` · ${org.website}` : ''}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {selectedOrg && (
              <div className={styles.selectedCard}>
                <BsBuilding size={18} />
                <div className={styles.selectedCardBody}>
                  <p className={styles.selectedCardName}>{selectedOrg.name}</p>
                  <p className={styles.selectedCardMeta}>
                    Company domain: @{requiredDomain || 'unknown'}
                  </p>
                </div>
              </div>
            )}

            <div className={styles.field}>
              <label className={styles.label} htmlFor="work-email">
                Your work email
              </label>
              <input
                id="work-email"
                type="email"
                placeholder={
                  requiredDomain ? `name@${requiredDomain}` : 'name@company.com'
                }
                className={styles.input}
                value={workEmail}
                onChange={(e) => setWorkEmail(e.target.value)}
                required
              />
              {requiredDomain && (
                <p className={styles.domainHint}>
                  Must use @{requiredDomain} to join this company.
                </p>
              )}
            </div>

            <div className={styles.actions}>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isRequesting}
                disabled={!selectedOrgId || !workEmail.trim()}>
                Submit join request
              </Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  )
}

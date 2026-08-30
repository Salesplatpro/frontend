import React from 'react'
import { BsChatDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { PageHero } from '@/components/layout/PageHero'
import { PagePanel } from '@/components/layout/PagePanel'
import { PageShell } from '@/components/layout/PageShell'
import { CountBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useChatSessions } from '@/features/messaging/hooks/useChatSessions'
import { calculateDaysFromCreation } from '@/utils'

import styles from './Chat.module.scss'

export const Chat = () => {
  const { sessions, isLoading } = useChatSessions()

  return (
    <PageShell>
      <PageHero
        compact
        title="Chat"
        lead="Message talents directly from your dashboard"
      />

      {isLoading ? (
        <Spinner fullPage />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={<BsChatDots size={28} />}
          title="No conversations yet"
          description="Messages you send to talents will appear here, grouped by job."
        />
      ) : (
        <PagePanel>
          <div className={styles.groups}>
            {sessions.map((group) => (
              <section key={group.jobId} className={styles.group}>
                <h3 className={styles.jobTitle}>{group.jobTitle}</h3>
                <div className={styles.threads}>
                  {group.threads.map((thread) => (
                    <Link
                      key={thread.applicationId}
                      to={`/recruiterDashboard/singleJobPost/${group.jobId}/${thread.applicationId}`}
                      className={styles.thread}>
                      <span className={styles.talentName}>
                        {thread.talentName}
                      </span>
                      <span className={styles.meta}>
                        {calculateDaysFromCreation(thread.lastMessageAt)} days
                        ago
                      </span>
                      <CountBadge item={thread.unreadCount} />
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </PagePanel>
      )}
    </PageShell>
  )
}

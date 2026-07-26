import React from 'react'
import { BsChatDots } from 'react-icons/bs'
import { Link } from 'react-router-dom'

import { PageHeaderTitle } from '@/components/layout/PageHeaderTitle'
import { CountBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { Spinner } from '@/components/ui/Spinner'
import { useChatSessions } from '@/features/messaging/hooks/useChatSessions'
import { calculateDaysFromCreation } from '@/utils'

import styles from './Chat.module.scss'

export const Chat = () => {
  const { sessions, isLoading } = useChatSessions()

  return (
    <div className={styles.page}>
      <PageHeaderTitle
        title="Chat"
        description="Message talents directly from your dashboard"
      />

      {isLoading ? (
        <Spinner fullPage />
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={<BsChatDots size={48} />}
          title="No conversations yet"
          description="Messages you send to talents will appear here, grouped by job."
        />
      ) : (
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
                      {calculateDaysFromCreation(thread.lastMessageAt)} days ago
                    </span>
                    <CountBadge item={thread.unreadCount} />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

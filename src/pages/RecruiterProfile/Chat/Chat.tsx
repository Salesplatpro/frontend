import React, { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

import { InboxLayout } from '@/components/features/messaging/Inbox'
import { PageHero } from '@/components/layout/PageHero'
import { PageShell } from '@/components/layout/PageShell'
import { useChatSessions } from '@/features/messaging/hooks/useChatSessions'
import { useMessages } from '@/features/messaging/hooks/useMessages'
import { useSendMessage } from '@/features/messaging/hooks/useSendMessage'

export const Chat = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const applicationId = searchParams.get('applicationId')
  const { sessions, isLoading, mutate: mutateSessions } = useChatSessions()
  const {
    messages,
    isLoading: messagesLoading,
    mutate: mutateMessages,
  } = useMessages(applicationId ?? undefined)
  const { send, isSending } = useSendMessage(applicationId ?? '')

  const selected = sessions
    .flatMap((group) =>
      group.threads.map((thread) => ({ ...thread, jobId: group.jobId })),
    )
    .find((thread) => thread.applicationId === applicationId)

  useEffect(() => {
    if (!applicationId || messagesLoading) return
    void mutateSessions()
  }, [applicationId, messagesLoading, messages.length, mutateSessions])

  const sections = sessions.map((group) => ({
    id: group.jobId,
    heading: group.jobTitle,
    conversations: group.threads.map((thread) => ({
      applicationId: thread.applicationId,
      counterpartId: thread.talentId,
      title: thread.talentName,
      subtitle: group.jobTitle,
      lastMessageAt: thread.lastMessageAt,
      lastMessagePreview: thread.lastMessagePreview,
      unreadCount: thread.unreadCount,
    })),
  }))

  return (
    <PageShell wide>
      <PageHero
        compact
        title="Chat"
        lead="Message talents directly from your dashboard"
      />
      <InboxLayout
        sections={sections}
        selectedApplicationId={applicationId}
        onSelect={(id) => {
          if (!id) {
            setSearchParams({})
            return
          }
          setSearchParams({ applicationId: id })
        }}
        isLoading={isLoading}
        emptyTitle="No conversations yet"
        emptyDescription="Messages you send to talents will appear here, grouped by job."
        emptyThreadHint="Choose a talent on the left to continue the conversation."
        composerPlaceholder="Type a message…"
        messages={messages}
        messagesLoading={messagesLoading}
        isSending={isSending}
        threadAction={
          selected ? (
            <Link
              to={`/recruiterDashboard/singleJobPost/${selected.jobId}?applicationId=${selected.applicationId}`}>
              View candidate
            </Link>
          ) : null
        }
        onSend={async (html) => {
          if (!selected) return
          await send({ content: html, recipient: selected.talentId })
          await Promise.all([mutateMessages(), mutateSessions()])
        }}
      />
    </PageShell>
  )
}

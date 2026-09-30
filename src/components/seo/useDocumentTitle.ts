import { useEffect } from 'react'

/**
 * Sets document.title to a value only the page itself knows, such as a fetched
 * job title, overriding the path-derived default from <DocumentTitle />.
 *
 * Pass undefined while the data is still loading and the path-derived title
 * stays in place. The previous title is restored on unmount so navigating away
 * does not strand a stale title in the brief window before <DocumentTitle />
 * re-runs for the new route.
 */
export const useDocumentTitle = (title?: string | null) => {
  useEffect(() => {
    if (!title) return

    const previous = document.title
    document.title = title

    return () => {
      document.title = previous
    }
  }, [title])
}

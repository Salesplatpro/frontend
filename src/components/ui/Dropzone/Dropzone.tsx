import React, { useCallback, useRef, useState } from 'react'
import { HiOutlineCloudArrowUp, HiOutlineDocumentText } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'

import styles from './Dropzone.module.scss'

export type DropzoneProps = {
  /** Files currently selected, owned by the caller. */
  files: File[]
  onAdd: (files: File[]) => void
  onRemove: (index: number) => void
  /** Comma-separated accept string for the native picker, e.g. '.pdf,.docx'. */
  accept?: string
  maxFiles?: number
  label?: string
  hint?: string
  disabled?: boolean
  /** Per-file rejection messages to show beneath the zone. */
  rejections?: Array<{ name: string; reason: string }>
  onDismissRejections?: () => void
}

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${Math.round((bytes / (1024 * 1024)) * 10) / 10} MB`
}

/**
 * A real drag-and-drop file picker. The previous scout upload screen promised
 * drag-and-drop in its copy but had no drag handlers at all, and reopening the
 * picker replaced the selection instead of adding to it.
 *
 * Validation lives with the caller (it owns the file list), so this component only
 * reports what was dropped and renders whatever rejections come back.
 */
export const Dropzone = ({
  files,
  onAdd,
  onRemove,
  accept,
  maxFiles,
  label = 'Drag CVs here, or click to choose files',
  hint,
  disabled = false,
  rejections = [],
  onDismissRejections,
}: DropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  // Drag events fire on every child element, so a plain boolean flickers as the
  // pointer moves across the zone. Counting enter/leave pairs keeps it steady.
  const dragDepth = useRef(0)

  const atCapacity = maxFiles !== undefined && files.length >= maxFiles

  const openPicker = useCallback(() => {
    if (disabled) return
    inputRef.current?.click()
  }, [disabled])

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return
      onAdd(Array.from(fileList))
      // Clearing the input means picking the same file twice still fires onChange.
      if (inputRef.current) inputRef.current.value = ''
    },
    [onAdd],
  )

  const onDragEnter = (event: React.DragEvent) => {
    event.preventDefault()
    if (disabled) return
    dragDepth.current += 1
    setIsDragging(true)
  }

  const onDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    dragDepth.current -= 1
    if (dragDepth.current <= 0) {
      dragDepth.current = 0
      setIsDragging(false)
    }
  }

  const onDragOver = (event: React.DragEvent) => {
    // Without this the browser navigates to the dropped file instead.
    event.preventDefault()
  }

  const onDrop = (event: React.DragEvent) => {
    event.preventDefault()
    dragDepth.current = 0
    setIsDragging(false)
    if (disabled) return
    handleFiles(event.dataTransfer?.files ?? null)
  }

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        className={[
          styles.zone,
          isDragging ? styles.dragging : '',
          disabled ? styles.disabled : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onClick={openPicker}
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        disabled={disabled}
        aria-label={label}>
        <span className={styles.icon} aria-hidden>
          <HiOutlineCloudArrowUp />
        </span>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
        {maxFiles !== undefined && (
          <span className={styles.counter}>
            {files.length} of {maxFiles} added
          </span>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className={styles.input}
        onChange={(event) => handleFiles(event.target.files)}
        tabIndex={-1}
        aria-hidden
      />

      {rejections.length > 0 && (
        <div className={styles.rejections} role="alert">
          <div className={styles.rejectionsHead}>
            <span>
              {rejections.length === 1
                ? "1 file couldn't be added"
                : `${rejections.length} files couldn't be added`}
            </span>
            {onDismissRejections && (
              <button
                type="button"
                className={styles.dismiss}
                onClick={onDismissRejections}>
                Dismiss
              </button>
            )}
          </div>
          <ul className={styles.rejectionList}>
            {rejections.map((rejection) => (
              <li key={`${rejection.name}-${rejection.reason}`}>
                <strong>{rejection.name}</strong> — {rejection.reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {files.length > 0 && (
        <ul className={styles.fileList}>
          {files.map((file, index) => (
            <li
              key={`${file.name}-${file.size}-${index}`}
              className={styles.file}>
              <span className={styles.fileIcon} aria-hidden>
                <HiOutlineDocumentText />
              </span>
              <span className={styles.fileMeta}>
                <span className={styles.fileName}>{file.name}</span>
                <span className={styles.fileSize}>{formatSize(file.size)}</span>
              </span>
              <button
                type="button"
                className={styles.remove}
                onClick={() => onRemove(index)}
                aria-label={`Remove ${file.name}`}>
                <IoClose aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      {atCapacity && (
        <p className={styles.capacity}>
          That&apos;s the maximum for one batch. Remove a file to swap in
          another.
        </p>
      )}
    </div>
  )
}

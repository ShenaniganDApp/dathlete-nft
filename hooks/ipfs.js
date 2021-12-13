import { uploadImage } from '@self.id/framework'
import { useCallback, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { IPFS_API_URL } from '../constants'

const UPLOAD_MAX_SIZE = 2500000


export function useImageUpload(
  onUpload,
  options = {}
) {
  const maxSize = options.maxSize ?? UPLOAD_MAX_SIZE
  const [state, setState] = useState('idle')
  const sourcesRef = useRef(null)
  const inputRef = useRef(null)

  function resetInput() {
    if (inputRef.current != null) {
      inputRef.current.value = ''
    }
  }

  const trigger = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const onChange = useCallback(
    (e) => {
      sourcesRef.current = null

      const file = e.target?.files?.[0]
      if (file == null || file.size > maxSize) {
        toast.error('Selected image exceeds maximum allowed size')
        resetInput()
        return
      }

      setState('uploading')

      uploadImage(IPFS_API_URL, file, options.dimensions).then(
        (imageSources) => {
          resetInput()
          sourcesRef.current = imageSources
          onUpload(imageSources)
          setState('done')
        },
        (err) => {
          console.warn('Failed to upload image to IPFS', err)
          setState('failed')
        }
      )
    },
    [maxSize, options.dimensions, onUpload]
  )

  const input = (
    <input
      accept="image/png, image/jpeg, video/mp4, video/ogg"
      onChange={onChange}
      ref={inputRef}
      style={{ display: 'none' }}
      type="file"
    />
  )

  return { input, state, trigger, value: sourcesRef.current }
}
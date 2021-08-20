import React from 'react'
import { useAppSelector, useToast } from 'state/hooks'
import ToastContainer from './ToastContainer'
import { Toast } from './types'

const ToastListener = () => {
  const toasts: Toast[] = useAppSelector((state) => state.toasts.data)
  const { remove } = useToast()

  const handleRemove = (id: string) => remove(id)

  return <ToastContainer toasts={toasts} onRemove={handleRemove} />
}

export default ToastListener

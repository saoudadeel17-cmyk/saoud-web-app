'use client'

import Icon from '@/components/ui/Icon'
import type { OrderStatus } from '@/types'
import { timelineStepIndex, TIMELINE_STEPS } from '@/lib/dashboard/helpers'

export default function OrderTimeline({ status }: { status: OrderStatus }) {
  const doneThrough = timelineStepIndex(status)
  const isCancelled = status === 'cancelled' || status === 'refunded'

  return (
    <div className="order-timeline" role="list" aria-label="Order progress">
      {TIMELINE_STEPS.map((label, index) => {
        const done = !isCancelled && index <= doneThrough
        const connectorDone = !isCancelled && index < doneThrough
        return (
          <div key={label} className="order-timeline-item">
            <div className={`timeline-step${done ? ' done' : ''}`} role="listitem">
              <div className={`timeline-dot${done ? ' done' : ''}`}>
                {done && <Icon name="check" size={12} />}
              </div>
              <span>{label}</span>
            </div>
            {index < TIMELINE_STEPS.length - 1 && (
              <div
                className={`timeline-connector${connectorDone ? ' done' : ''}`}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

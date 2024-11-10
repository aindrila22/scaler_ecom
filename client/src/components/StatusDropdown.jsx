import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { backendUrl, cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-react'
import axios from 'axios'
import { useState } from 'react'
import PropTypes from 'prop-types'

const LABEL_MAP = {
  awaiting_shipment: 'Awaiting Shipment',
  fulfilled: 'Fulfilled',
  shipped: 'Shipped',
}

const StatusDropdown = ({ id, orderStatus}) => {
  const [currentStatus, setCurrentStatus] = useState(orderStatus)
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus) => {
    if (newStatus === currentStatus) return

    setLoading(true)
    try {
      await axios.patch(`${backendUrl}/api/orders/${id}/status`, { status: newStatus })
      setCurrentStatus(newStatus)
    } catch (error) {
      console.error("Error updating status:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          className='w-52 flex justify-between items-center'
          disabled={loading}
        >
          {LABEL_MAP[currentStatus]}
          <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-0'>
        {Object.keys(LABEL_MAP).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              'flex text-sm gap-1 items-center p-2.5 cursor-pointer hover:bg-zinc-100',
              {
                'bg-zinc-100': currentStatus === status,
              }
            )}
            onClick={() => handleStatusChange(status)}
          >
            <Check
              className={cn(
                'mr-2 h-4 w-4 text-primary',
                currentStatus === status ? 'opacity-100' : 'opacity-0'
              )}
            />
            {LABEL_MAP[status]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
StatusDropdown.propTypes = {
    id: PropTypes.string.isRequired,
    orderStatus: PropTypes.oneOf(Object.keys(LABEL_MAP)).isRequired,
  }
export default StatusDropdown
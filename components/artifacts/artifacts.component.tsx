'use client'

import {
  Chip,
  Selection,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  User,
} from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React, { Key } from 'react'
import { DeleteIcon } from './DeleteIcon'
import { EditIcon } from './EditIcon'
import { EyeIcon } from './EyeIcon'
import { columns, users } from './data'

const statusColorMap: {
  [key: string]: 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary' | undefined
  active: 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary' | undefined
  paused: 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary' | undefined
  vacation: 'success' | 'danger' | 'warning' | 'default' | 'primary' | 'secondary' | undefined
} = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
}

export default function ArtifactsComponent() {
  console.log('ArtifactsComponent: Starting...')

  const router = useRouter()
  const defaultSelection = new Set('') as Selection
  const [selectedKeys, setSelectedKeys] = React.useState(defaultSelection)

  const renderCell = React.useCallback(
    (
      user: {
        [key: string]: string | number
        id: number
        name: string
        role: string
        team: string
        status: string
        age: string
        avatar: string
        email: string
      },
      columnKey: Key,
    ) => {
      // console.log(`columnKey = ${columnKey}`)
      // console.log(`typeof columnKey = ${typeof columnKey}`)
      if (typeof columnKey !== 'string') {
        // console.error(`columnKey is not a string: ${columnKey}`)
        return <p>ERROR</p>
      }
      const cellValue = user[columnKey]

      switch (columnKey) {
        case 'name':
          return (
            <User avatarProps={{ radius: 'lg', src: user.avatar }} description={user.email} name={cellValue}>
              {user.email}
            </User>
          )
        case 'role':
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
              <p className="text-bold text-sm capitalize text-default-400">{user.team}</p>
            </div>
          )
        case 'status':
          return (
            <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
              {cellValue}
            </Chip>
          )
        case 'actions':
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip content="Details">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EyeIcon />
                </span>
              </Tooltip>
              <Tooltip content="Edit user">
                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                  <EditIcon />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete user">
                <span className="text-lg text-danger cursor-pointer active:opacity-50">
                  <DeleteIcon />
                </span>
              </Tooltip>
            </div>
          )
        default:
          return cellValue
      }
    },
    [],
  )

  return (
    <Table
      aria-label="Example table with custom cells"
      color="success"
      selectionMode="single"
      selectionBehavior="toggle"
      // onRowAction={(key) => {
      //   console.log('onRowAction')
      //   router.push(`/artifacts/${key}`)
      // }}
      selectedKeys={selectedKeys}
      onSelectionChange={(value) => {
        console.log(`onSelectionChange: value = ${value}`)
        console.log(value)
        const testValue = value as Set<string>
        console.log(testValue.size)
        console.log(testValue.entries().next().value)
        console.log(testValue.entries().next().value[0])
        setSelectedKeys(value)
        // const selectedUser = users.find((user) => user.id === testValue.entries().next().value[0])
        const selectedUser = users[testValue.entries().next().value[0]]
        console.log(selectedUser)
        // router.push(`/artifacts/breakdown?id=${testValue.entries().next().value[0]}`)
        router.push(`/artifacts/breakdown/${selectedUser.name}`)
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={users}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                <p>Column Key = {columnKey}</p>
                {renderCell(item, columnKey)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

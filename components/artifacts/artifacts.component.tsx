'use client'

import { Selection, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from '@nextui-org/react'
import { useRouter } from 'next/navigation'
import React, { Key, PropsWithChildren } from 'react'
import { ArtifactsResponse } from './artifacts-response'

const columns: {
  name: string
  uid: string
}[] = [
  { name: 'NAME', uid: 'name' },
  { name: 'EFFECT', uid: 'effect' },
]

function buildImageUrl(imageUrl: string | null | undefined) {
  if (!imageUrl) {
    return ''
  }
  return `http://localhost:9002/api/${imageUrl}`
}

export default function ArtifactsComponent(
  props: PropsWithChildren<{
    artifacts: ArtifactsResponse[]
  }>,
) {
  const router = useRouter()
  const defaultSelection = new Set('') as Selection
  const [selectedKeys, setSelectedKeys] = React.useState(defaultSelection)

  const renderCell = React.useCallback((artifact: ArtifactsResponse, columnKey: Key) => {
    if (typeof columnKey !== 'string') {
      return <p>ERROR</p>
    }
    const cellValue = artifact[columnKey]

    switch (columnKey) {
      case 'name':
        return <User avatarProps={{ radius: 'lg', src: buildImageUrl(artifact.imageUrl) }} name={cellValue} />
      case 'effect':
        if (artifact.onePieceSetEffect) {
          return <p>{artifact.onePieceSetEffect}</p>
        }
        if (artifact.twoPieceSetEffect && artifact.fourPieceSetEffect) {
          return (
            <div>
              <p>{artifact.twoPieceSetEffect}</p>
              <p>{artifact.fourPieceSetEffect}</p>
            </div>
          )
        }
        if (artifact.twoPieceSetEffect) {
          return <p>{artifact.twoPieceSetEffect}</p>
        }
        if (artifact.fourPieceSetEffect) {
          return <p>{artifact.fourPieceSetEffect}</p>
        }
        return <p>No Effect Available</p>
      default:
        return cellValue
    }
  }, [])

  return (
    <Table
      aria-label="Example table with custom cells"
      color="success"
      selectionMode="single"
      selectionBehavior="toggle"
      selectedKeys={selectedKeys}
      onSelectionChange={(value) => {
        const testValue = value as Set<string>
        setSelectedKeys(value)
        const selectedUser = props.artifacts.find((artifact) => artifact.id === testValue.entries().next().value[0])
        if (selectedUser) {
          router.push(`/artifacts/breakdown/${selectedUser.name ?? 'error/error'}`)
        } else {
          alert('ERROR: Could not find artifact')
        }
      }}
    >
      <TableHeader columns={columns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={props.artifacts}>
        {(item) => (
          <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}</TableRow>
        )}
      </TableBody>
    </Table>
  )
}

'use client'

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
  Listbox,
  ListboxItem,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import React from 'react'
import useSWR from 'swr'
import { ArtifactBreakdownCharacter, ArtifactBreakdownMap } from './artifact-breakdown'

interface TableData {
  [key: string]: string | number | ArtifactBreakdownCharacter[]
  id: number
  stat: string
  characters: ArtifactBreakdownCharacter[]
}

function createTableData(artifactBreakdownMap: ArtifactBreakdownMap | null | undefined): TableData[] {
  if (!artifactBreakdownMap) {
    return []
  }
  let returnValue: TableData[] = []
  let i = 0
  for (const [key, value] of Object.entries(artifactBreakdownMap)) {
    let characters: ArtifactBreakdownCharacter[] = []
    for (let character of value) {
      characters.push(character)
    }
    returnValue.push({ id: i, stat: key, characters: characters })
    i += 1
  }
  return returnValue
}

const columns = [
  { name: 'STAT', uid: 'stat' },
  { name: 'CHARACTERS', uid: 'characters' },
]

function build_substats_string(substats: string[] | null | undefined): string {
  if (!substats) {
    return 'No Substats to Display!'
  }
  let returnValue = ''
  for (let substat of substats) {
    returnValue += substat + ', '
  }
  return returnValue.slice(0, -2)
}

const artifactDepths = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
]

const fetcher = (artifactId: string, artifactDepth: string) => {
  const url = `http://localhost:9002/api/v2/artifactBreakdown?artifactId=${artifactId}&artifactDepth=${artifactDepth}`
  return fetch(url).then((res) => res.json())
}

export default function ArtifactBreakdownComponent(props: { artifactId: string }) {
  // URL -> `/dashboard?search=my-project`
  // `search` -> 'my-project'
  const [artifactDepth, setArtifactDepth] = React.useState('1')

  const handleSelectionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target) {
      setArtifactDepth(e.target.value)
    }
  }

  const {
    data: artifactBreakdown,
    error,
    isLoading,
  } = useSWR([props.artifactId, artifactDepth], ([artifactId, artifactDepth]) => fetcher(artifactId, artifactDepth))

  const renderCell = React.useCallback((item: TableData, columnKey: string | number) => {
    const cellValue = item[columnKey]

    switch (columnKey) {
      case 'stat':
        let typedValue = cellValue as string
        return <p>{typedValue}</p>
      case 'characters':
        let typedValueCharacters = cellValue as ArtifactBreakdownCharacter[]
        return (
          <div className="w-full max-w-[100%] border-small px-1 py-2 rounded-small border-default-200 dark:border-default-100">
            <Listbox items={typedValueCharacters} aria-label="Dynamic Actions" onAction={(key) => alert(key)}>
              {(item) => (
                <ListboxItem
                  key={item.id}
                  color={item.name === 'delete' ? 'danger' : 'default'}
                  className={item.name === 'delete' ? 'text-danger' : ''}
                  textValue={item.name}
                >
                  {item.name} | Substats: {build_substats_string(item.substats)}
                </ListboxItem>
              )}
            </Listbox>
          </div>
        )
      default:
        return <p>Default</p>
    }
  }, [])

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return (
    <Card className="max-w-[100%]">
      <CardHeader className="flex gap-3">
        <Image
          alt="artifact logo"
          height={40}
          radius="sm"
          src={artifactBreakdown.imageUrl ?? 'https://avatars.githubusercontent.com/u/86160567?s=200&v=4'}
          width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">{artifactBreakdown.name}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <p>1-Piece: {artifactBreakdown.onePieceSetEffect ?? 'null'}</p>
        <p>2-Piece: {artifactBreakdown.twoPieceSetEffect ?? 'null'}</p>
        <p>4-Piece: {artifactBreakdown.fourPieceSetEffect ?? 'null'}</p>
        <Select
          // items={artifactDepths}
          label="Select Artifact Depth"
          selectedKeys={[artifactDepth]}
          className="max-w-xs"
          onChange={handleSelectionChange}
        >
          {/* {(artifactDepth) => <SelectItem key={artifactDepth}>{artifactDepth}</SelectItem>} */}
          {artifactDepths.map((artifactDepth) => (
            <SelectItem key={artifactDepth.value} value={artifactDepth.value}>
              {artifactDepth.label}
            </SelectItem>
          ))}
        </Select>
      </CardBody>
      <Divider className="my-4" />
      <CardFooter>
        <Table isStriped aria-label="Example static collection table">
          <TableHeader>
            <TableColumn>STAT TYPE</TableColumn>
            <TableColumn>BREAKDOWN</TableColumn>
          </TableHeader>
          <TableBody emptyContent={'No rows to display.'}>
            <TableRow key="1">
              <TableCell>Sands Stats</TableCell>
              <TableCell>
                <Table aria-label="Example table with custom cells">
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody items={createTableData(artifactBreakdown.sandsStats)} emptyContent={'No rows to display.'}>
                    {(item) => (
                      <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell>Goblet Stats</TableCell>
              <TableCell>
                <Table aria-label="Example table with custom cells">
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={createTableData(artifactBreakdown.gobletStats)}
                    emptyContent={'No rows to display.'}
                  >
                    {(item) => (
                      <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell>Circlet Stats</TableCell>
              <TableCell>
                <Table aria-label="Example table with custom cells">
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                        {column.name}
                      </TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    items={createTableData(artifactBreakdown.circletStats)}
                    emptyContent={'No rows to display.'}
                  >
                    {(item) => (
                      <TableRow key={item.id}>
                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardFooter>
    </Card>
  )
}

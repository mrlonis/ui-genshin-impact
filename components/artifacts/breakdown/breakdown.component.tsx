'use client'

import {
  Accordion,
  AccordionItem,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Image,
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
import { ArtifactBreakdown, ArtifactBreakdownCharacter, ArtifactBreakdownMap } from './artifact-breakdown.model'
import { build_substats_string, getImageUrl } from './utils'

interface AccordionData {
  [key: string]: string | number | ArtifactBreakdownCharacter[]
  id: number
  stat: string
  characters: ArtifactBreakdownCharacter[]
}

function createAccordionData(artifactBreakdownMap: ArtifactBreakdownMap | null | undefined): AccordionData[] {
  if (!artifactBreakdownMap) {
    return []
  }
  let returnValue: AccordionData[] = []
  let i = 0
  for (const [key, value] of Object.entries(artifactBreakdownMap)) {
    if (value !== null && value !== undefined) {
      returnValue.push({ id: i, stat: key, characters: value })
      i += 1
    }
  }
  return returnValue
}

const substatColumns = [
  { name: 'NAME', uid: 'name' },
  { name: 'SUBSTATS', uid: 'substats' },
]

const artifactDepths = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3 },
  { label: '4', value: 4 },
  { label: '5', value: 5 },
]

const fetcher = (artifactId: string, artifactDepth: string) => {
  const url = `http://localhost:9002/api/v2/artifactBreakdown?artifactId=${artifactId}&artifactDepth=${artifactDepth}`
  return fetch(url, { next: { revalidate: 1 } }).then((res) => res.json())
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
  } = useSWR<ArtifactBreakdown, any, string[]>([props.artifactId, artifactDepth], ([artifactId, artifactDepth]) =>
    fetcher(artifactId, artifactDepth),
  )

  const renderSubstatsCell = React.useCallback((item: ArtifactBreakdownCharacter, columnKey: string | number) => {
    switch (columnKey) {
      case 'name':
        return (
          <p>
            <b>{item.name}</b>
          </p>
        )
      case 'substats':
        return (
          <p>
            <b>Substats:</b> {build_substats_string(item.substats)}
          </p>
        )
      default:
        return <p>Default</p>
    }
  }, [])

  const renderPieceEffect = React.useCallback((artifactBreakdown: ArtifactBreakdown | null | undefined) => {
    if (!artifactBreakdown) {
      return <p>No Artifact to Display</p>
    }
    if (artifactBreakdown.onePieceSetEffect) {
      return (
        <p>
          <b>1-Piece:</b> {artifactBreakdown.onePieceSetEffect}
        </p>
      )
    }
    if (artifactBreakdown.twoPieceSetEffect && artifactBreakdown.fourPieceSetEffect) {
      return (
        <p>
          <b>2-Piece:</b> {artifactBreakdown.twoPieceSetEffect}
          <br />
          <b>4-Piece:</b> {artifactBreakdown.fourPieceSetEffect}
        </p>
      )
    }
    return <p>Default</p>
  }, [])

  const buildAccordion = React.useCallback(
    (accordionData: AccordionData[]) => {
      if (!accordionData || accordionData.length === 0) {
        return <p>No Artifact to Display</p>
      }
      const accordionItems = accordionData.map((data) => {
        return (
          <AccordionItem key={data.id} aria-label={data.stat} title={data.stat}>
            <Table hideHeader aria-label="Example static collection table">
              <TableHeader columns={substatColumns}>
                {(column) => (
                  <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                    {column.name}
                  </TableColumn>
                )}
              </TableHeader>
              <TableBody items={data.characters} emptyContent={'No rows to display.'}>
                {(artifactBreakdownCharacter) => (
                  <TableRow key={artifactBreakdownCharacter.id}>
                    {(columnKey) => (
                      <TableCell className={columnKey === 'name' ? 'text-right w-[20%]' : 'text-left w-[85%]'}>
                        {renderSubstatsCell(artifactBreakdownCharacter, columnKey)}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </AccordionItem>
        )
      })
      return (
        <Accordion variant="splitted" selectionMode="multiple">
          {accordionItems}
        </Accordion>
      )
    },
    [renderSubstatsCell],
  )

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>
  return (
    <Card className="max-w-[100%]">
      <CardHeader className="flex gap-3">
        <Image alt="artifact logo" height={40} radius="sm" src={getImageUrl(artifactBreakdown?.imageUrl)} width={40} />
        <div className="flex flex-col">
          <p className="text-md">{artifactBreakdown?.name}</p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {renderPieceEffect(artifactBreakdown)}
        <br />
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
              <TableCell className="w-[20%]">
                <b>Flower & Plume Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(
                  createAccordionData({
                    Substats: artifactBreakdown?.characters,
                  } as ArtifactBreakdownMap),
                )}
              </TableCell>
            </TableRow>
            <TableRow key="2">
              <TableCell className="w-[20%]">
                <b>Sands Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(createAccordionData(artifactBreakdown?.sandsStats))}
              </TableCell>
            </TableRow>
            <TableRow key="3">
              <TableCell className="w-[20%]">
                <b>Goblet Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(createAccordionData(artifactBreakdown?.gobletStats))}
              </TableCell>
            </TableRow>
            <TableRow key="4">
              <TableCell className="w-[20%]">
                <b>Circlet Stats</b>
              </TableCell>
              <TableCell className="w-[80%]">
                {buildAccordion(createAccordionData(artifactBreakdown?.circletStats))}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardFooter>
    </Card>
  )
}

import "./styles.css"
import React, { useState } from 'react'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  type SortingState
} from '@tanstack/react-table'
import { Link } from '@tanstack/react-router'
import type { PlatformCountType } from '../../types'

/*
export type PlatformCountType = {
    Platform: string
    Count: number
    FirstSubmission: string
    LastSubmission: string
    FirstCollection: string
    LastCollection: string
    UniqueId: string
    
}
*/

type AppProps = {
    data: Array<PlatformCountType>
    provider: string 
}

const columnHelper = createColumnHelper<PlatformCountType>()

const columns = [
  columnHelper.accessor('Platform', {}),
  columnHelper.accessor('UniqueId', {
    header: () => <span>Unique Id</span>
  }),
  columnHelper.accessor('Count', {
    header: () => <span>Number of Soundings</span>,
    cell: (info) => Number(info.getValue()).toLocaleString()
  })
]

export default function PlatformsTable({ data, provider }: AppProps ) {
    const [sorting, setSorting] = useState<SortingState>([])
    console.log({data})
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
        },
    })

    return (
        <div className="flex flex-row mt-5 pr-5 border-solid border-2 w-fit">
      <table>
        <thead>
        {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          header.column.getCanSort()
                            ? 'cursor-pointer select-none'
                            : ''
                        }
                        onClick={header.column.getToggleSortingHandler()}
                        title={
                          header.column.getCanSort()
                            ? header.column.getNextSortingOrder() === 'asc'
                              ? 'Sort ascending'
                              : header.column.getNextSortingOrder() === 'desc'
                                ? 'Sort descending'
                                : 'Clear sort'
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: ' 🔼',
                          desc: ' 🔽',
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                )
              })}
            </tr>
          ))}
          {/* {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th className='' key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))} */}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className='ml-2 mr-2' key={row.id}>
              {row.getVisibleCells().map((cell) => (
                cell.column.id === 'UniqueId' ? 
                    <td className='pl-2 pr-6' key={cell.id}>
                                <Link
                                    to="/providers/$providerId/$platformId"
                                    params={{ providerId: provider, platformId: cell.getValue() }}
                                    className="block py-1 hover:opacity-75 px-5"
                                    activeProps={{ className: 'font-bold underline' }}
                                >
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </Link>
                    </td>
                :
                    <td className='pl-2 pr-6' key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
              ))}
            </tr>
          ))}
        </tbody>
        </table>
        </div>
    )
}


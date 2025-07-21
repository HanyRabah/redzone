"use client";

import React from 'react';

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Edit,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMemo, useState } from "react";
import { Chip, Typography } from "@mui/material";


const filterField = 'name'

export function TableList<T extends { id: string }>({ data, editItem, deleteItem }: { data: T[], editItem: (item: T) => void, deleteItem: (id: string) => void }) {
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns: ColumnDef<T>[] =  useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "sortOrder",
      header: () => {
        return <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px" }} >Order</Typography>;
      },
      cell: ({ row }) => <Typography variant="body2" align="left" sx={{ fontWeight: "normal", fontSize: "14px" }} className="lowercase">{row.getValue("sortOrder")}</Typography>,
    },
    {
      accessorKey: "avatar",
      header: () => {
        return <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px" }} >Avatar</Typography>;
      },
      cell: ({ row }) => (
        <Image
          src={
            row.getValue("avatar") ||
            "/images/avatars/adult-blur-brick-walls-846741.jpg"
          }
          alt="Client Avatar"
          width={32}
          height={32}
        />
      ),
    },
    
    {
      accessorKey: "name",
      header: () => {
        return <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px" }} >Name</Typography>;
      },
      cell: ({ row }) => <Typography variant="body2" align="left" sx={{ fontWeight: "normal", fontSize: "14px" }} className="lowercase">{row.getValue("name")}</Typography>,
    },
    {
      accessorKey: "role",
      header: () => {
        return <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px" }} >Role</Typography>;
      },
      cell: ({ row }) => <Typography variant="body2" align="left" sx={{ fontWeight: "normal", fontSize: "14px" }} className="capitalize">{row.getValue("role")}</Typography>,
    },
    {
      accessorKey: "isActive",
      header: () => {
        return <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px" }} >Active</Typography>;
      },
      cell: ({ row }) => <Chip color={row.getValue("isActive") ? "success" : "error"} label={row.getValue("isActive") ? "Yes" : "No"} />,
    },
    {
      accessorKey: "createdAt",
      header: () => <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px" }} >Created At</Typography>,
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt");
  
        // Format the amount as a dollar amount
        const formatted = new Intl.DateTimeFormat("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(createdAt as Date);
  
        return <Typography variant="body2" align="left" sx={{ fontWeight: "normal", fontSize: "14px" }} className="lowercase">{formatted}</Typography>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      header: () => <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: "14px" }} >Actions</Typography>,
      cell: ({ row }) => {
         return (
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0" 
              onClick={() => editItem(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              className="h-8 w-8 p-0" 
              onClick={() => deleteItem(row.original.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ], [editItem, deleteItem]);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter ..."
          value={(table.getColumn(filterField)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filterField)?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client"
import { RiFileExcel2Fill } from "react-icons/ri";
import { SlOptions } from "react-icons/sl";
import { IoReceiptOutline } from "react-icons/io5";
import { FiPackage, FiPrinter } from "react-icons/fi";
import { GrDocumentPdf } from "react-icons/gr";
import { TbSettingsFilled, TbExternalLink, TbReload, TbPhone } from "react-icons/tb";
import { BiSearchAlt2 } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es)
import { generateXLSX } from "../utils/funciones.js"
import { usePDF } from 'react-to-pdf';

import dynamic from "next/dynamic";
import React, { ChangeEventHandler, ComponentType, Dispatch, Fragment, InputHTMLAttributes, MouseEventHandler, RefObject, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Menu } from "../components/Menu";
import { MenuButton } from "../components/MenuButton";
import { SectionSwiper } from "../components/SectionSwiper";
import { ModuloSubida } from "../components/ModuloSubida";
import { fetchApiBodas, fetchApiJaihom, queries } from "../utils/Fetching";
import Link from "next/link";
import { IconAddCircleLine, IconFolderArrowDown } from "../icons";
import { ListFileZip } from "../components/ListFileZip";
import { TasasBCV } from "../components/TasasBCV";
import { PaymentReportResult, FetchPaymentReportResults } from "../interfaces";

const formasPagoReport = [
  {
    "id": 37407,
    "nombre": "BOTON DE PAGO BDV"
  },
  {
    "id": 37524,
    "nombre": "PAGO MOVIL PORTAL DEL PAGO"
  },
  {
    "id": 37515,
    "nombre": "TRANSFERENCIA PORTAL PAGO"
  },
  {
    "id": 37516,
    "nombre": "SELLE PORTAL PAGO"
  },
]

const getFormaPagoNombre = (id: number): string => {
  const formaPago = formasPagoReport.find(fp => fp.id === id)
  return formaPago ? formaPago.nombre : `ID: ${id}`
}
import { Column, ColumnDef, ColumnFiltersState, FilterFn, SortingFn, Table, createColumnHelper, flexRender, getCoreRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, sortingFns, useReactTable } from "@tanstack/react-table";
import { RankingInfo, rankItem, compareItems } from '@tanstack/match-sorter-utils'
import { getDate, getDateTime, obtenerPrimerYUltimoDiaSemana } from "../utils/time";
import { get } from "http";
import ClickAwayListener from "react-click-away-listener";
import { PDFViewer } from "@react-pdf/renderer";
import { TreeItem } from "../components/TreeItem";

const columnHelperPaymentReport = createColumnHelper<PaymentReportResult>()

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank,
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
  let dir = 0

  // Only sort by rank if the column has ranking information
  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank!,
      rowB.columnFiltersMeta[columnId]?.itemRank!
    )
  }

  // Provide an alphanumeric fallback for when the item ranks are equal
  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export default function PaymentsReports() {
  const { toPDF, targetRef } = usePDF({ filename: 'payment-reports.pdf' })
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const [showPreviewPdf, setShowPreviewPdf] = useState<any>({ state: false, title: "", payload: {} })
  const [selectRow, setSelectRow] = useState<string | null>(null)
  const [searchColumn, setSearchColumn] = useState<string | null>(null)
  const [search, setSearch] = useState<boolean>(false)
  const [columnsView, setColumnsView] = useState<boolean>(false)
  const [inputView, setInputView] = useState<boolean>(false)
  const [showTable, setShowTable] = useState<boolean>(true)
  const [data, setData] = useState<PaymentReportResult[]>([])
  const rerender = useReducer(() => ({}), {})[1]
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = useState('')

  const [estadoFilter, setEstadoFilter] = useState<"all" | "procesado" | "no procesado">("no procesado")
  const [dateFilter, setDateFilter] = useState("month")
  const [rangeFilter, setRangeFilter] = useState(null)
  const d = new Date()
  const [startDateFilter, setStartDateFilter] = useState<Date>(new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`));
  const [endDateFilter, setEndDateFilter] = useState<Date>(new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`));
  const inputRef = useRef(null);
  const [updated, setUpdated] = useState('');
  const [showSpinner, setShowSpinner] = useState<boolean>(false)
  const [columnVisibility, setColumnVisibility] = React.useState({
    id_factura: true,
    estado: true,
    total_cobrado: true,
    accion: false,
    messages: true,
    referencia: true,
    fecha_pago: false,
    saldo: true,
    total: true,
    forma_pago: true,
    telefono: false,
    createdAt: true,
    updatedAt: false,
    acciones: true
  })
  const [tableMaster, setTableMaster] = useState<any>()

  const handleChange = (event) => {
    if (event.key === 'Enter') {
      setUpdated(inputRef.current.value);
    }
  };

  const onOptionChangeEstado: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEstadoFilter(e.target.value as "all" | "procesado" | "no procesado")
  }

  const onOptionChangeDate: ChangeEventHandler<HTMLInputElement> = (e) => {
    setDateFilter(e.target.value)
  }

  const handleReloadInvoice = async (id_factura: string, rowIndex: number) => {
    try {
      const result = await fetchApiJaihom({
        query: queries.reloadInvoice,
        variables: { id_factura },
      })

      if (result && result.estado === "procesado") {
        // Actualizar la fila completa con la respuesta
        setData(prevData => {
          const newData = [...prevData]
          newData[rowIndex] = result
          return newData
        })
      }
    } catch (error) {
      console.error('Error al recargar factura:', error)
    }
  }

  const handleCopyPhone = async (telefono: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(telefono)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = telefono
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (fallbackError) {
          console.error('Error en fallback de copia:', fallbackError)
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (error) {
      console.error('Error al copiar teléfono:', error)
    }
  }

  const columnsPaymentReport = useMemo<ColumnDef<PaymentReportResult>[]>(() => [
    columnHelperPaymentReport.accessor('id_factura', {
      id: 'id_factura',
      header: () => <span>ID Factura</span>,
      cell: info => <div className="text-center">{info.getValue()}</div>,
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('estado', {
      header: () => <span>Estado</span>,
      cell: info => <div className="text-center">{info.getValue()}</div>,
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('total_cobrado', {
      header: () => <span>Total Cobrado</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-right">{value ? value.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</div>
      },
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('accion', {
      header: () => <span>Acción</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-center">{value || '-'}</div>
      },
      footer: info => info.column.id,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('messages', {
      header: () => <span>Mensajes</span>,
      cell: info => {
        if (info.getValue().length) {
          return (
            <div className="w-full flex flex-wrap space-x-2 justify-start">
              {info.getValue().map((message, idx) =>
                <span key={idx} className="text-xs bg-gray-100 px-1 rounded py-1">
                  {message}
                </span>)}
            </div>
          )
        }
      },
      footer: info => info.column.id,
      enableColumnFilter: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('referencia', {
      header: () => <span>Referencia</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-center">{value || '-'}</div>
      },
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('fecha_pago', {
      header: () => <span>Fecha Pago</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-center">{value ? getDate(new Date(value)) : '-'}</div>
      },
      footer: info => info.column.id,
      enableColumnFilter: false,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('saldo', {
      header: () => <span>Saldo</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-right">{value ? value.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</div>
      },
      footer: info => info.column.id,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('total', {
      header: () => <span>Total</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-right">{value ? value.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}</div>
      },
      footer: info => info.column.id,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('forma_pago', {
      header: () => <span>Forma Pago</span>,
      cell: info => {
        const value = info.getValue()
        if (!value) return <div className="text-center">-</div>
        return <div className="text-center">{getFormaPagoNombre(value)}</div>
      },
      footer: info => info.column.id,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('telefono', {
      header: () => <span>Teléfono</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-center">{value || '-'}</div>
      },
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('createdAt', {
      header: () => <span>Creado</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-center">{value ? getDateTime(value) : '-'}</div>
      },
      footer: info => info.column.id,
      enableColumnFilter: false,
      enableHiding: false,
      size: 120,
    }),
    columnHelperPaymentReport.accessor('updatedAt', {
      header: () => <span>Actualizado</span>,
      cell: info => {
        const value = info.getValue()
        return <div className="text-center">{value ? getDateTime(value) : '-'}</div>
      },
      footer: info => info.column.id,
      enableColumnFilter: false,
      size: 120,
    }),
    columnHelperPaymentReport.display({
      id: 'acciones',
      header: () => (
        <div className="flex justify-center">
          <SlOptions className="w-4 h-4" />
        </div>
      ),
      cell: info => {
        const row = info.row.original
        const hasPhone = row.telefono && row.telefono.trim() !== ''
        return (
          <div className="flex justify-center items-center space-x-2 w-20">
            <button
              onClick={() => hasPhone && handleCopyPhone(row.telefono)}
              className={`${hasPhone ? 'text-purple-600 hover:text-purple-800 cursor-pointer' : 'text-gray-400 cursor-not-allowed'}`}
              title={hasPhone ? "Copiar teléfono al portapapeles" : "No hay teléfono disponible"}
              disabled={!hasPhone}
            >
              <TbPhone className="w-4 h-4" />
            </button>
            {row.estado === "no procesado" && (
              <>
                <a
                  href={`https://wisphub.io/registrar/pago/4fournet/${row.id_factura}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 cursor-pointer"
                  title="Ver factura en WispHub"
                >
                  <TbExternalLink className="w-4 h-4" />
                </a>
                <button
                  onClick={() => handleReloadInvoice(row.id_factura, info.row.index)}
                  className="text-green-600 hover:text-green-800 cursor-pointer"
                  title="Recargar factura"
                >
                  <TbReload className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )
      },
      enableColumnFilter: false,
      enableSorting: false,
      enableHiding: false,
      size: 80,
    }),
  ], [])

  const table = useReactTable({
    data,
    columns: columnsPaymentReport,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  })

  useEffect(() => {
    table?.setPageSize(250)
  }, [])

  useEffect(() => {
    if (startDateFilter && endDateFilter) {
      setRangeFilter({ startDateFilter, endDateFilter: new Date(endDateFilter.getTime() + 86399000) })
    } else {
      setRangeFilter(null)
    }
  }, [startDateFilter, endDateFilter])

  useEffect(() => {
    let args: any = {}

    // Filtros de fecha
    if (dateFilter === "lastmonth") {
      const dt = new Date()
      const y = dt.getFullYear()
      const m = dt.getMonth()
      args = {
        rangeDate: {
          gt: new Date(`${y}-${m}-1`).toISOString(),
          lt: new Date(new Date(`${y}-${m + 1}-1 23:59:59`).getTime() - 86400000).toISOString(),
        }
      }
    }
    if (dateFilter === "month") {
      const dt = new Date()
      const y = dt.getFullYear()
      const m = dt.getMonth()
      args = {
        rangeDate: {
          gt: new Date(`${y}-${m + 1}-1`).toISOString(),
          lt: new Date(new Date(`${y}-${m + 2}-1 23:59:59`).getTime() - 86400000).toISOString(),
        }
      }
    }
    if (dateFilter === "week") {
      const r = obtenerPrimerYUltimoDiaSemana()
      args = {
        rangeDate: {
          gt: r.primero.toISOString(),
          lt: r.ultimo.toISOString(),
        }
      }
    }
    if (dateFilter === "day") {
      const dt = new Date()
      const y = dt.getFullYear()
      const m = dt.getMonth()
      const d = dt.getDate()
      args = {
        rangeDate: {
          gt: new Date(`${y}-${m + 1}-${d}`).toISOString(),
          lt: new Date(`${y}-${m + 1}-${d} 23:59:59`).toISOString(),
        }
      }
    }
    if (rangeFilter && dateFilter === "range") {
      args = {
        rangeDate: {
          gt: new Date(rangeFilter.startDateFilter).toISOString(),
          lt: new Date(rangeFilter.endDateFilter).toISOString(),
        }
      }
    }

    // Filtros de estado
    if (estadoFilter !== "all") {
      args = { ...args, estado: estadoFilter }
    }

    fetchApiJaihom({
      query: queries.getPaymentReportResults,
      variables: {
        args,
        skip: 0,
        limit: 0
      },
    }).then((resp: FetchPaymentReportResults) => {
      setData(resp?.results || [])
    })
  }, [estadoFilter, dateFilter, rangeFilter])

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  return (
    <div className="flex w-full text-xs capitalize">
      {showPreviewPdf.state &&
        <div className="absolute w-full h-[calc(100%-100px)] z-50 justify-center flex">
          <div className="bg-gray-200 flex flex-col w-[764px] h-[615px] translate-y-[46px] rounded-xl shadow-lg border-[1px] border-gray-300">
            <div className="bg-white flex w-full h-10 rounded-xl rounded-b-none items-center px-2 border-b-[1px] border-gray-300 shadow-sm">
              <div className="flex-1 flex items-center" >
                <span className="capitalize text-lg font-semibold text-gray-700">Vista Previa PDF</span>
                <div className="flex-1" />
              </div>
              <div onClick={() => setShowPreviewPdf(false)} className="bg-gray-50 w-8 h-8 hover:bg-gray-200 rounded-full flex justify-center cursor-pointer text-lg text-gray-700 pt-0">x</div>
            </div>
            <div className="w-full h-[555px]">
              <div className="w-[980px] h-[740px] scale-75 bg-white -translate-x-[109px] -translate-y-[84px] border-[1px] rounded-none ">
              </div>
            </div>
          </div>
        </div>
      }

      {
        showSpinner && <div className="absolute z-50 w-full top-0 left-0 h-full bg-gray-600 opacity-50 flex items-center justify-center ">
          <div id="loader" className="absolute"></div>
        </div>
      }
      <input id="child" type="number" onKeyDown={handleChange} className={`${!inputView && "hidden"} h-4 text-right text-xs font-medium`} />
      <div className="w-full h-[calc(100vh-120px)]">
        <div className="bg-white flex flex-col w-[calc(1280px-40px)] xl:w-[calc(100%-64px)] h-[calc(100vh-160px)] border border-gray-300 rounded-xl mt-10 p-2 mx-2 xl:ml-8">
          <div className="flex space-x-4">
            <div className="inline-flex items-center space-x-3">
              <IoReceiptOutline className="w-10 h-10" />
              <span className="font-display text-xl font-medium">Reportes de Pagos</span>
            </div>

            <div className="flex-1 flex justify-end py-1">
              <div className="w-72 flex flex-col px-2 pb-1">
                {/* filtrar por estado */}
                <div className="border-[1px] border-gray-300 flex-1 rounded-xl inline-flex flex-col px-1 pt-2 pb-1 space-y-1">
                  <div className="space-x-3">
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="estado" value="all" id="all" onChange={onOptionChangeEstado} checked={"all" === estadoFilter} />
                      <label htmlFor="all">todos</label>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="estado" value="procesado" id="procesado" onChange={onOptionChangeEstado} checked={"procesado" === estadoFilter} />
                      <label htmlFor="procesado">procesados</label>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="estado" value="no procesado" id="no_procesado" onChange={onOptionChangeEstado} checked={"no procesado" === estadoFilter} />
                      <label htmlFor="no_procesado">no procesados</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-72 flex flex-col px-2 pb-1">
                {/* filtrar por fecha de pago */}
                <div className="border-[1px] border-gray-300 flex-1 rounded-xl inline-flex flex-col px-1 py-2 space-y-2">
                  <div className="space-x-3">
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="date" value="lastmonth" id="lastmonth" onChange={onOptionChangeDate} checked={"lastmonth" === dateFilter} />
                      <label htmlFor="lastmonth">mes anterior</label>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="date" value="month" id="month" onChange={onOptionChangeDate} checked={"month" === dateFilter} />
                      <label htmlFor="month">mes</label>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="date" value="week" id="week" onChange={onOptionChangeDate} checked={"week" === dateFilter} />
                      <label htmlFor="week">semana</label>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="date" value="day" id="day" onChange={onOptionChangeDate} checked={"day" === dateFilter} />
                      <label htmlFor="day">dia</label>
                    </div>
                  </div>
                  <div className="flex w-full text-xs">
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="date" value="range" id="range" onChange={onOptionChangeDate} checked={"range" === dateFilter} />
                      <label htmlFor="range">rango</label>
                    </div>
                    <DatePicker
                      selected={dateFilter === "range" ? startDateFilter : null}
                      onChange={(date: Date) => setStartDateFilter(date)}
                      popperClassName="!text-xs"
                      calendarClassName="rasta-stripes scale-75 -translate-x-10 -translate-y-8"
                      disabled={dateFilter !== "range"}
                      locale="es"
                      dateFormat="P"
                      className="text-xs w-24 h-6 ml-2" />
                    <DatePicker
                      selected={dateFilter === "range" ? endDateFilter : null}
                      onChange={(date: Date) => setEndDateFilter(date)}
                      popperClassName="!text-xs"
                      calendarClassName="rasta-stripes scale-75 -translate-x-10 -translate-y-8"
                      disabled={dateFilter !== "range"}
                      locale="es"
                      dateFormat="P"
                      className="text-xs w-24 h-6 ml-2" />
                  </div>
                </div>
              </div>
            </div>
            <div className="h-10 py-1 space-y-4 text-gray-600 items-center justify-center">
              <div className="space-x-3 flex px-2">
                <div onClick={() => generateXLSX({ data, tableMaster, filename: 'reportes-de-pagos' })} className="w-6 h-6" >
                  <label className={`hover:scale-120 transform  flex flex-col items-center justify-center gap-1 cursor-pointer relative`} >
                    <RiFileExcel2Fill className="w-6 h-6 text-green-700" />
                  </label>
                </div>
                <div onClick={() => {
                  setShowPreviewPdf({ state: true })
                }} className="w-6 h-6" >
                  <label className={`hover:scale-120 transform  flex flex-col items-center justify-center gap-1 cursor-pointer relative`} >
                    <GrDocumentPdf className="w-6 h-6 text-red-700" />
                  </label>
                </div>
                <ClickAwayListener onClickAway={() => setColumnsView(false)}>
                  <div className="relative ">
                    <TbSettingsFilled onClick={() => setColumnsView(!columnsView)} className="w-6 h-6 cursor-pointer" />
                    <div className="bg-gray-200 shadow-lg rounded-xl absolute -translate-x-[132px] translate-y-2" >
                      {columnsView && <div className="bg-white w-48  m-2 inline-block border border-black shadow rounded space-y-1">
                        <div className="px-1 border-b border-black sticky top-0 bg-white">
                          <label>
                            <input
                              {...{
                                type: 'checkbox',
                                checked: table.getIsAllColumnsVisible(),
                                onChange: table.getToggleAllColumnsVisibilityHandler(),
                              }}
                            />{' '}
                            Toggle All
                          </label>
                        </div>
                        {table.getAllLeafColumns().map(column => {
                          return (
                            <div key={column.id} className="px-1 py-1">
                              <label className="text-xs">
                                <input
                                  {...{
                                    type: 'checkbox',
                                    checked: column.getIsVisible(),
                                    onChange: column.getToggleVisibilityHandler(),
                                  }}
                                />{' '}
                                {column.id}
                              </label>
                            </div>
                          )
                        })}
                      </div>}
                    </div>
                  </div>
                </ClickAwayListener>
              </div>
            </div>
          </div>
          {showTable && <div ref={targetRef} className="flex flex-col flex-1 border-[1px] border-gray-300 !rounded-xl">
            <table className="w-full">
              <thead className="top-0 left-0">
                {table.getHeaderGroups().map(headerGroup => {
                  return (
                    <tr key={headerGroup.id} className="border-b-[1px] border-gray-300">
                      <TableForward table={table} setTableMaster={setTableMaster} />
                      {headerGroup.headers.map((header, idx) => (
                        <th
                          key={header.id}
                          // colSpan={header.colSpan}
                          // style={{ width: `${header.getSize()}px` }}
                          className={`h-6 ${idx !== 0 && "border-l-[1px] border-gray-300"}`}>
                          {header.isPlaceholder
                            ? null
                            : (<div className="space-y-1 flex flex-col justify-start h-full">
                              <div className="flex items-center">
                                {idx === 0 && <BiSearchAlt2
                                  onClick={() => {
                                    setSearch(!search)
                                  }}
                                  className="w-3.5 h-3.5 ml-1 cursor-pointer" />}
                                <div
                                  {...{
                                    className: header.column.getCanSort()
                                      ? 'cursor-pointer select-none flex flex-1 justify-center items-center px-1 space-x-1 uppercase'
                                      : '',
                                    onClick: header.column.getToggleSortingHandler(),
                                  }} >
                                  <div className="flex-1">
                                    <div>
                                      {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )}
                                    </div>
                                  </div>
                                  {{
                                    asc: <TiArrowSortedDown />,
                                    desc: <TiArrowSortedUp />,
                                  }[header.column.getIsSorted() as string] ?? <span className="w-3" />}
                                </div>
                              </div>
                              {search
                                ? header.column.getCanFilter() ? (
                                  <div className="flex-1 px-1 flex items-center">
                                    <Filter column={header.column} table={table} />
                                  </div>
                                ) : null
                                : null
                              }
                            </div>
                            )}
                        </th>
                      )
                      )}
                    </tr>
                  )
                })}
              </thead>
              <tbody className="block overflow-y-scroll w-[calc(100%+8px)] h-[calc(100vh-340px)]">
                {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id} onClick={() => setSelectRow(row.id === selectRow ? null : row.id)} className={`${row.id === selectRow && "bg-gray-300"} hover:bg-gray-200 select-none border-b-[1px] border-gray-300`}>
                      {row.getVisibleCells().map(cell => {
                        return (
                          <td className="px-2" key={cell.id}
                            onDoubleClick={(e: any) => {
                              console.log(e)
                              const lastElem = document.getElementById("select")
                              if (lastElem) {
                                lastElem.style.userSelect = "none"
                                lastElem.removeAttribute("id")
                              }
                              e.target.id = "select"
                              e.target.style.userSelect = "text"
                              e.stopPropagation()
                            }}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="hidden">
                {table.getFooterGroups().map(footerGroup => (
                  <tr key={footerGroup.id}>
                    {footerGroup.headers.map(header => (
                      <th key={header.id} className="">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                      </th>
                    ))}
                  </tr>
                ))}
              </tfoot>
            </table>
            <hr className="" />
            <div className="flex flex-1 items-center gap-2 justify-between px-4 bg-gray-100">
              <select
                value={table.getState().pagination.pageSize}
                onChange={e => {
                  table.setPageSize(Number(e.target.value))
                }}
                className="h-8 text-xs rounded-lg border-[1px] border-gray-300"
              >
                {[25, 50, 100, 250].map(pageSize => (
                  <option key={pageSize} value={pageSize}>
                    Filas por página {pageSize}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-lg border-[1px]">
                <button
                  className="border rounded p-1"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<<'}
                </button>
                <button
                  className="border rounded p-1"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {'<'}
                </button>
                <div>Página</div>
                <strong>
                  {table.getState().pagination.pageIndex + 1} de{' '}
                  {table.getPageCount()}
                </strong>
                <button
                  className="border rounded p-1"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {'>'}
                </button>
                <button
                  className="border rounded p-1"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  {'>>'}
                </button>
              </div>
              <div className="inline-flex space-x-2">
                <span>total de registros {table.getPrePaginationRowModel().rows.length}</span>
              </div>
            </div>
          </div>}
        </div>
      </div>
      <style>{`
      #loader {
        border: 16px solid #f3f3f3;
        border-top: 16px solid #3498db;
        border-radius: 50%;
        width: 120px;
        height: 120px;
        animation: spin 2s linear infinite;
        display: block;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      tfoot {
        color: gray;
      }

      tfoot th {
        font-weight: normal;
      }

      table tbody {
        display: block;
        max-height: calc(100vh - 340px);
        width: calc(100% + 8px);
        overflow-y: scroll;
      }

      thead, tbody tr, tfoot {
        display: table;
        width: 100%;
        table-layout: fixed;
      }

      `}</style>
    </div >
  )
}

function Filter({ column, table }: { column: Column<any, unknown>, table: Table<any> }) {
  const [isMounted, setIsMounted] = useState<any>(false)

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true)
    }
    return () => {
      column.setFilterValue("")
      setIsMounted(false)
    }
  }, [])

  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === 'number'
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  )

  return typeof firstValue === 'number' ? (
    <>
      <div className="w-[calc(100%-10px)]">
        <div className="flex space-x-2">
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[0] ?? ''}
            onChange={value =>
              column.setFilterValue((old: [number, number]) => [value, old?.[1]])
            }
            placeholder={`Min`}
            className="flex-1 text-xs font-normal w-10 h-4 border shadow rounded-[0.25rem] text-right"
          />
          <DebouncedInput
            type="number"
            min={Number(column.getFacetedMinMaxValues()?.[0] ?? '')}
            max={Number(column.getFacetedMinMaxValues()?.[1] ?? '')}
            value={(columnFilterValue as [number, number])?.[1] ?? ''}
            onChange={value =>
              column.setFilterValue((old: [number, number]) => [old?.[0], value])
            }
            placeholder={`Max`}
            className="flex-1 text-xs font-normal w-10 h-4 border shadow rounded-[0.25rem] text-right"
          />
        </div>
      </div>
      <div className="relative">
        <span onClick={() => column.setFilterValue("")} className="absolute select-none translate-x-0.5 -translate-y-3 text-sm font-medium text-gray-700 w-3 h-3 cursor-pointer">x</span>
      </div>
    </>
  ) : (
    <>
      <DebouncedInput
        type="text"
        value={(columnFilterValue ?? '') as string}
        onChange={value => column.setFilterValue(value)}
        placeholder={`${column.id}`}
        className="text-xs font-normal w-full h-4 rounded-[0.25rem]"
        list={column.id + 'list'}
      />
      <div className="relative">
        <span onClick={() => column.setFilterValue("")} className="absolute select-none -translate-x-3.5 -translate-y-3 text-sm font-medium text-gray-700 w-3 h-3 cursor-pointer">x</span>
      </div>
    </>
  )
}

// A debounced input react component
function DebouncedInput({ value: initialValue, onChange, debounce = 500, ...props }: {
  value: string | number,
  onChange: (value: string | number) => void,
  debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
  }, [value])

  return (
    <input className="text-xs" {...props} value={value} onChange={e => setValue(e.target.value)} />
  )
}

const TableForward = ({ table, setTableMaster }) => {
  useEffect(() => {
    setTableMaster(table)
  }, [])

  return (<></>)
} 
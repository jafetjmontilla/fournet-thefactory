"use client"
import { RiFileExcel2Fill } from "react-icons/ri";
import { IoReceiptOutline } from "react-icons/io5";
import { FiPackage, FiPrinter } from "react-icons/fi";
import { GrDocumentPdf } from "react-icons/gr";
import { TbSettingsFilled } from "react-icons/tb";
import { BiSearchAlt2 } from "react-icons/bi";
import { TiArrowSortedDown } from "react-icons/ti";
import { TiArrowSortedUp } from "react-icons/ti";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import es from 'date-fns/locale/es';
registerLocale('es', es)
import { generateXLSX, getDataTreeFacturaWispHup, getDataTreeTransaction } from "../utils/funciones.js"
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
import { Factura, FetchFacturas, FetchTransaction, Transaction } from "../interfaces";
import { Column, ColumnDef, ColumnFiltersState, FilterFn, SortingFn, Table, createColumnHelper, flexRender, getCoreRowModel, getFacetedMinMaxValues, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, sortingFns, useReactTable } from "@tanstack/react-table";
import { RankingInfo, rankItem, compareItems } from '@tanstack/match-sorter-utils'
import { getDate, getDateTime, obtenerPrimerYUltimoDiaSemana } from "../utils/time";
import { get } from "http";
import ClickAwayListener from "react-click-away-listener";
import { PDFViewer } from "@react-pdf/renderer";
import { TreeItem } from "../components/TreeItem";

const columnHelperFactura = createColumnHelper<Factura>()
const columnHelperTransaction = createColumnHelper<Transaction>()

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


export default function Home() {
  const { toPDF, targetRef } = usePDF({ filename: 'page.pdf' })
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const [file, setFile] = useState<any>()
  const [showFacturaAndTransaction, setShowFacturaAndTransaction] = useState<any>({ state: false, title: "", payload: {} })
  const [showPreviewPdf, setShowPreviewPdf] = useState<any>({ state: false, title: "", payload: {} })
  const [selectRow, setSelectRow] = useState<string | null>(null)
  const [searchColumn, setSearchColumn] = useState<string | null>(null)
  const [search, setSearch] = useState<boolean>(false)
  const [columnsView, setColumnsView] = useState<boolean>(false)
  const [inputView, setInputView] = useState<boolean>(false)
  const [showTable, setShowTable] = useState<boolean>(true)
  const [data, setData] = useState<Factura[] | Transaction[]>([])
  const rerender = useReducer(() => ({}), {})[1]
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = useState('')

  const [typeFilter, setTypeFilter] = useState("factura")//transaccion
  const [dateFilter, setDateFilter] = useState("month")
  const [stateFilter, setStateFilter] = useState("conciliated")
  const [rangeFilter, setRangeFilter] = useState(null)
  const d = new Date()
  const [startDateFilter, setStartDateFilter] = useState<Date>(new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-`));
  const [endDateFilter, setEndDateFilter] = useState<Date>(new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}-`));
  const inputRef = useRef(null);
  const [updated, setUpdated] = useState('');
  const [uploading, setUploading] = useState<boolean>(false)
  const [showSpinner, setShowSpinner] = useState<boolean>(false)
  const [columnVisibility, setColumnVisibility] = React.useState({ recargado: false, forma_pago: false, cajeroID: false, cajero: false, banco: false, conciliado: false, updatedAt: false })
  const [tableMaster, setTableMaster] = useState<any>()

  const handleChange = (event) => {
    if (event.key === 'Enter') {
      console.log(inputRef.current.ref)
      setUpdated(inputRef.current.value);
    }
  };
  const onOptionChangeType: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value)
    setShowTable(false)
    setTimeout(() => {
      setShowTable(true)
    }, 3000);
    setTypeFilter(e.target.value)
  }
  const onOptionChangeDate: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value)
    setDateFilter(e.target.value)
  }
  const onOptionChangeState: ChangeEventHandler<HTMLInputElement> = (e) => {
    console.log(e.target.value)
    setStateFilter(e.target.value)
  }

  const handleGetFactura = (id_factura: string) => {
    setShowFacturaAndTransaction({ state: true, title: "factura" })
    fetchApiJaihom({
      query: queries.getFacturaWispHup,
      variables: {
        id_factura
      },
    }).then((resp: string) => {
      console.log(JSON.parse(resp))

      setShowFacturaAndTransaction({ state: true, title: "factura", payload: getDataTreeFacturaWispHup(JSON.parse(resp)) })
    })
  }

  const handleGetReferencia = (id_referencia: string) => {
    setShowFacturaAndTransaction({ state: true, title: "transacción" })
    console.log(id_referencia)
    fetchApiJaihom({
      query: queries.getTransacciones,
      variables: {
        args: { referencia: id_referencia }
      },
    }).then((resp: FetchTransaction) => {
      console.log(1005, resp.results[0])

      setShowFacturaAndTransaction({ state: true, title: "transacción", payload: getDataTreeTransaction(resp.results[0]) })
    })
  }

  const columnsFactura = useMemo<ColumnDef<Factura>[]>(() => [
    columnHelperFactura.accessor('id_factura', {
      id: 'id_factura',
      header: () => <span>id_factura</span>,
      cell: info => <div onClick={() => handleGetFactura(info.getValue())} className="text-center">{info.getValue()}</div>,
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
      enableHiding: false,
    }),
    columnHelperFactura.accessor('criterio', {
      header: () => <span>criterio</span>,
      cell: info => info.getValue(),
      footer: info => info.column.id,
      enableColumnFilter: false,
    }),
    columnHelperFactura.accessor('recargado', {
      header: () => <span>recargado</span>,
      cell: info => <span>{info.getValue() ? "recargado" : null}</span>,
      footer: info => info.column.id,
      enableColumnFilter: false,
    }),
    columnHelperFactura.accessor('forma_pago', {
      header: () => <span>forma_pago</span>,
      cell: info => info.getValue(),
      footer: info => info.column.id,
      enableColumnFilter: false,
    }),
    columnHelperFactura.accessor('total_cobrado', {
      header: () => <span>total_cobrado</span>,
      cell: info => <div className="text-right">{info.getValue().toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>,
      footer: info => info.column.id,
      enableHiding: false,
    }),
    columnHelperFactura.accessor('fecha_pago', {
      header: () => <span>fecha_pago</span>,
      cell: info => <div className="text-center">{getDate(info.getValue())}</div>,
      footer: info => info.column.id,
      enableColumnFilter: false,
      enableHiding: false,
    }),
    columnHelperFactura.accessor('fecha_pago_ref', {
      header: () => <span>fecha_pago_ref</span>,
      cell: info => <div className="text-center">{info.getValue()}</div>,
      footer: info => info.column.id,
      enableColumnFilter: false,
      enableHiding: false,
    }),
    columnHelperFactura.accessor('referencia', {
      header: () => <span>referencia</span>,
      cell: info => <div className="text-right" >{info.getValue()}</div>,
      footer: info => info.column.id,
    }),
    columnHelperFactura.accessor('cajeroID', {
      header: () => <span>cajeroID</span>,
      cell: info => <div className="text-right" >{info.getValue()}</div>,
      footer: info => info.column.id,
    }),
    columnHelperFactura.accessor('cajero', {
      header: () => <span>cajero</span>,
      cell: info => <div className="text-right" >{info.getValue()}</div>,
      footer: info => info.column.id,
    }),
    columnHelperFactura.accessor('transacciones', {
      header: () => <span>transacciones</span>,
      footer: info => info.column.id,
      cell: info => {
        if (info.getValue().length) {
          return (
            <div className="w-full flex flex-wrap space-x-2 justify-end">
              {info.getValue().map((elem, idx) =>
                <span onClick={() => handleGetReferencia(elem.referencia)} key={idx} className="">
                  {elem.referencia}
                </span>)}
            </div>
          )
        }
      },
      enableColumnFilter: false
    }),
    columnHelperFactura.accessor('updatedAt', {
      header: () => <span>updatedAt</span>,
      cell: info => { return <div className="text-center">{getDateTime(info.getValue())}</div> },
      footer: info => info.column.id,
      enableColumnFilter: false
    }),
  ], [typeFilter])

  const columnsTransaction = useMemo<ColumnDef<Transaction>[]>(() => [
    columnHelperTransaction.accessor('referencia', {
      id: 'referencia',
      header: () => <span>referencia banco</span>,
      cell: info => <div onClick={() => handleGetReferencia(info.getValue())} className="text-end">{info.getValue()}</div>,
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
    }),
    columnHelperTransaction.accessor('criterio', {
      id: 'criterio',
      header: () => <span>criterio</span>,
      cell: info => <div className="text-center">{info.getValue()}</div>,
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
    }),
    columnHelperTransaction.accessor('banco', {
      id: 'banco',
      header: () => <span>banco</span>,
      cell: info => <div className="text-center">{info.getValue()}</div>,
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
    }),
    columnHelperTransaction.accessor('conciliado', {
      id: 'conciliado',
      header: () => <span>conciliado</span>,
      cell: info => <div className="text-center">{info.getValue() && "ok"}</div>,
      footer: info => info.column.id,
      filterFn: 'fuzzy',
      sortingFn: fuzzySort,
    }),
    columnHelperTransaction.accessor('monto', {
      header: () => <span>monto banco</span>,
      cell: info => <div className="text-right">{info.getValue().toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>,
      footer: info => info.column.id,
    }),
    columnHelperTransaction.accessor('monto_facturas', {
      id: "monto_facturas",
      header: () => <span>monto facturas</span>,
      footer: info => info.column.id,
      cell: info => {
        return <div className="text-right" >{info.getValue().toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

        // return (
        //   <>
        //     {selectRow === info.row.id && <div className="w-full bg-blue-300 ">
        //       <input value={info.row.id} ref={inputRef} type="number" onKeyDown={handleChange} className="w-full h-4 text-right text-xs font-medium" />

        //     </div>}
        //   </>
        // )
      },
      enableColumnFilter: false
    }),
    columnHelperTransaction.accessor('diferencia', {
      id: "diferencia",
      header: () => <span>diferencia</span>,
      footer: info => info.column.id,
      cell: info => {
        return <div className="text-right" >{info.getValue().toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>

        // return (
        //   <>
        //     {selectRow === info.row.id && <div className="w-full bg-blue-300 ">
        //       <input value={info.row.id} ref={inputRef} type="number" onKeyDown={handleChange} className="w-full h-4 text-right text-xs font-medium" />

        //     </div>}
        //   </>
        // )
      },
      enableColumnFilter: false
    }),
    columnHelperTransaction.accessor('facturas', {
      header: () => <span>nº facturas</span>,
      footer: info => info.column.id,
      cell: info => {
        if (info.getValue().length) {
          return (
            <div className="w-full flex flex-wrap space-x-2 justify-end">
              {info.getValue().map((elem, idx) =>
                <span onClick={() => handleGetFactura(elem.id_factura)} key={idx} className="">
                  {elem.id_factura}
                </span>)}
            </div>
          )
        }
      },
      enableColumnFilter: false
    }),
    columnHelperTransaction.accessor('fecha', {
      header: () => <span>fecha</span>,
      cell: info => { return <div className="text-center">{getDateTime(info.getValue()).slice(0, -6)}</div> },
      footer: info => info.column.id,
      enableColumnFilter: false
    }),
  ], [typeFilter])

  const table = useReactTable({
    data,
    columns:
      useMemo(() =>
        typeFilter === "factura" ? columnsFactura : columnsTransaction,
        [typeFilter]),
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
    // const visibility = tableMaster?.getVisibleLeafColumns().map(elem => elem.id)
    // console.log(data, visibility)
    // // const dataFiltrada = data.results.map((obj) => {
    // //   const newObj = {};
    // //   for (const prop in obj) {
    // //     if (columnVisibility[prop]) {
    // //       newObj[prop] = obj[prop];
    // //     }
    // //   }
    // //   return newObj;
    // // });

    // const dataFiltrada = data.map((obj) => {
    //   const newObj = {};
    //   for (const prop of visibility) {
    //     if (obj.hasOwnProperty(prop)) {
    //       newObj[prop] = obj[prop];
    //     }
    //   }
    //   return newObj;
    // });

    // console.log(dataFiltrada);
  }, [data, columnVisibility])

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
    if (dateFilter === "lastmonth") {
      const dt = new Date()
      const y = dt.getFullYear()
      const m = dt.getMonth()
      args = {
        rangeDate: {
          gt: new Date(`${y}-${m}-1`),
          lt: new Date(new Date(`${y}-${m + 1}-1 23:59:59`).getTime() - 86400000),
        }
      }
    }
    if (dateFilter === "month") {
      const dt = new Date()
      const y = dt.getFullYear()
      const m = dt.getMonth()
      args = {
        rangeDate: {
          gt: new Date(`${y}-${m + 1}-1`),
          lt: new Date(new Date(`${y}-${m + 2}-1 23:59:59`).getTime() - 86400000),
        }
      }
    }
    if (dateFilter === "week") {
      const r = obtenerPrimerYUltimoDiaSemana()
      args = {
        rangeDate: {
          gt: r.primero,
          lt: r.ultimo,
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
          gt: new Date(`${y}-${m + 1}-${d}`),
          lt: new Date(`${y}-${m + 1}-${d} 23:59:59`),
        }
      }
    }
    if (rangeFilter && dateFilter === "range") {
      args = {
        rangeDate: {
          gt: new Date(rangeFilter.startDateFilter),
          lt: new Date(rangeFilter.endDateFilter),
        }
      }
    }
    if (stateFilter === "all") { }
    if (typeFilter === "factura") {
      if (stateFilter === "noConciliated") { { args = { ...args, pagado: false } } }
      if (stateFilter === "conciliated") { args = { ...args, pagado: true } }
      fetchApiJaihom({
        query: queries.getFacturas,
        variables: {
          args,
          skip: 0,
          limit: 0
        },
      }).then((resp: FetchFacturas) => {
        console.log(resp)
        setData(resp?.results)
      })
    }
    if (typeFilter === "transaccion") {
      if (stateFilter === "noConciliated") { args = { ...args, conciliado: false } }
      if (stateFilter === "conciliated") { args = { ...args, conciliado: true } }
      delete args.pagado
      fetchApiJaihom({
        query: queries.getTransacciones,
        variables: {
          args,
          skip: 0,
          limit: 0
        },
      }).then((resp: FetchTransaction) => {
        const results: Transaction[] = resp.results.map((elem: Transaction) => {
          const monto_facturas = elem.facturas.reduce((acc, item) => {
            return acc + item.total_cobrado
          }, 0)
          const diferencia = elem.monto - monto_facturas
          return {
            ...elem,
            monto_facturas,
            diferencia
          }
        })
        console.log(resp)
        setData(results)
      })
    }
  }, [typeFilter, dateFilter, stateFilter, rangeFilter])

  useEffect(() => {
    if (table.getState().columnFilters[0]?.id === 'fullName') {
      if (table.getState().sorting[0]?.id !== 'fullName') {
        table.setSorting([{ id: 'fullName', desc: false }])
      }
    }
  }, [table.getState().columnFilters[0]?.id])

  const handleChangeFile = (e, banco) => {
    e.preventDefault();
    setShowSpinner(true)
    setUploading(true)
    let reader = new FileReader();
    let file = e.target.files[0];
    setFile(file)
    fetchApiJaihom({
      query: queries.uploadBanco,
      variables: { file, banco },
      type: "formData"
    }).then((result) => {
      if (result === "ok") {
        setUploading(false)
      }
      setShowSpinner(false)
    })
  };
  const handleConciliar = (e) => {
    e.preventDefault();
    setShowSpinner(true)
    setUploading(true)
    setFile(file)
    fetchApiJaihom({
      query: queries.runConciliation,
      variables: {},
    }).then((result) => {
      if (result === "ok") {
        setUploading(false)
      }
      setShowSpinner(false)
    })
  };

  const handleRecargar = (e) => {
    e.preventDefault();
    console.log(showFacturaAndTransaction.payload[0].value)
    // fetchApiJaihom({
    //       query: queries.runConciliation,
    //       variables: {},
    //     }).then((result) => {
    //       if (result === "ok") {
    //         setUploading(false)
    //       }
    // })
  };

  const handleRecargarAll = (e) => {
    e.preventDefault()
    const ids_factura = data.map(elem => elem.id_factura)
    fetchApiJaihom({
      query: queries.refreshFacturaWispHup,
      variables: { ids_factura },
    }).then((result) => {
      console.log(result)
    })
  };

  return (
    <div className="flex w-full text-xs capitalize">
      {showFacturaAndTransaction.state &&
        <div className="absolute w-full h-[calc(100%-100px)] z-50 justify-center flex">
          {/* <ClickAwayListener onClickAway={() => setShowFacturaWispHup({ state: false })}> */}
          <div className="bg-gray-200 flex flex-col w-[500px] h-[calc(100%-84px)] translate-y-[46px] rounded-xl shadow-lg border-[1px] border-gray-300">
            <div className="bg-white flex w-full h-10 rounded-xl rounded-b-none items-center px-2 border-b-[1px] border-gray-300 shadow-sm">
              <div className="flex-1 flex items-center" >
                <span className="capitalize text-lg font-semibold text-gray-700">{showFacturaAndTransaction.title}</span>
                <div className="flex-1" />
                <button onClick={handleRecargar} disabled={uploading} type="button" className={`w-28 h-7 bg-blue-500 hover:bg-blue-400 rounded-lg flex items-center justify-center select-none font-medium text-xs text-white mr-4`}>RECARGAR</button>
              </div>
              <div onClick={() => setShowFacturaAndTransaction(false)} className="bg-gray-50 w-8 h-8 hover:bg-gray-200 rounded-full flex justify-center cursor-pointer text-lg text-gray-700 pt-0">x</div>
            </div>
            <div className="flex-1 overflow-y-scroll p-2">
              <div className="w-full bg-white rounded-xl">
                <TreeItem data={showFacturaAndTransaction.payload} />
              </div>
            </div>
            <div className="bg-gray-200 h-2" />
          </div>
          {/* </ClickAwayListener> */}
        </div>
      }

      {showPreviewPdf.state &&
        <div className="absolute w-full h-[calc(100%-100px)] z-50 justify-center flex">
          {/* <ClickAwayListener onClickAway={() => setShowFacturaWispHup({ state: false })}> */}
          <div className="bg-gray-200 flex flex-col w-[764px] h-[615px] translate-y-[46px] rounded-xl shadow-lg border-[1px] border-gray-300">
            <div className="bg-white flex w-full h-10 rounded-xl rounded-b-none items-center px-2 border-b-[1px] border-gray-300 shadow-sm">
              <div className="flex-1 flex items-center" >
                <span className="capitalize text-lg font-semibold text-gray-700">{showFacturaAndTransaction.title}</span>
                <div className="flex-1" />
              </div>
              <div onClick={() => setShowPreviewPdf(false)} className="bg-gray-50 w-8 h-8 hover:bg-gray-200 rounded-full flex justify-center cursor-pointer text-lg text-gray-700 pt-0">x</div>
            </div>
            <div className="w-full h-[555px]">
              <div className="w-[980px] h-[740px] scale-75 bg-white -translate-x-[109px] -translate-y-[84px] border-[1px] rounded-none ">

              </div>
            </div>
          </div>
          {/* </ClickAwayListener> */}
        </div>
      }

      {
        showSpinner && <div className="absolute z-50 w-full top-0 left-0 h-full bg-gray-600 opacity-50 flex items-center justify-center ">
          <div id="loader" className="absolute"></div>
        </div>
      }
      <input id="child" type="number" onKeyDown={handleChange} className={`${!inputView && "hidden"} h-4 text-right text-xs font-medium`} />
      <div className="w-full h-[calc(100vh-120px)] overflow-auto">
        <div className="bg-white flex flex-col w-[calc(1280px-40px)] xl:w-[calc(100%-64px)] h-[calc(100vh-160px)] border border-gray-300 rounded-xl mt-10 p-2 mx-2 xl:ml-8">
          <div className="flex space-x-4">
            <div className="inline-flex items-center space-x-3">
              <IoReceiptOutline className="w-10 h-10" />
              <span className="font-display text-xl font-medium">{typeFilter === "factura" ? "Facturas" : "Estados de Cuentas"}</span>
            </div>

            {/* <div className="w-100 h-10 flex-1 border-[1px] border-gray-300 rounded-full m-1 flex items-center justify-start">
              <div>
                <DebouncedInput
                  value={globalFilter ?? ''}
                  onChange={value => setGlobalFilter(String(value))}
                  className="p-2 font-lg shadow border border-block"
                  placeholder="Search all columns..."
                />
              </div>
            </div> */}
            <div className="flex-1 flex justify-end py-1">
              <div className="w-72 flex flex-col px-2 pb-1">
                {/* filtrar por estado de factura */}
                <div className="border-[1px] border-gray-300 flex-1 rounded-xl inline-flex flex-col px-1 pt-2 pb-1 space-y-1">
                  <div className="space-x-3">
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="type" value="factura" id="factura" onChange={onOptionChangeType} checked={"factura" === typeFilter} />
                      <label htmlFor="factura">facturas</label>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="type" value="transaccion" id="transaccion" onChange={onOptionChangeType} checked={"transaccion" === typeFilter} />
                      <label htmlFor="transaccion">transacciones</label>
                    </div>
                  </div>
                  <div className="space-x-3">
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="state" value="all" id="all" onChange={onOptionChangeState} checked={"all" === stateFilter} />
                      <label htmlFor="all">todas</label>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="state" value="conciliated" id="conciliated" onChange={onOptionChangeState} checked={"conciliated" === stateFilter} />
                      <label htmlFor="conciliated">conciliadas</label>
                    </div>
                    <div className="inline-flex items-center space-x-1">
                      <input type="radio" name="state" value="noConciliated" id="noConciliated" onChange={onOptionChangeState} checked={"noConciliated" === stateFilter} />
                      <label htmlFor="noConciliated">no conciliadas</label>
                    </div>
                  </div>
                  <div className="flex items-center flex-1">
                    <div className="flex-1"></div>
                    <button
                      onClick={handleRecargarAll}
                      disabled={stateFilter !== "noConciliated" || typeFilter !== "factura"}
                      type="button"
                      className={`w-28 h-6  ${stateFilter !== "noConciliated" || typeFilter !== "factura" ? "bg-gray-300" : "bg-blue-500"} hover:bg-blue-400 rounded-lg flex items-center justify-center select-none font-medium text-xs text-white`}>RECARGAR</button>
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
                    {/* <div className="relative">
                      <span onClick={() => {
                        setStartDateFilter(null)
                        setEndDateFilter(null)
                      }} className="absolute select-none translate-x-2 -translate-y-0 text-sm font-medium text-gray-700 w-3 h-3 cursor-pointer">x</span>
                    </div> */}
                  </div>

                </div>
              </div>
            </div>
            <div className="h-10 py-1 space-y-4 text-gray-600 items-center justify-center">
              <div className="space-x-3 flex px-2">
                <div className="w-6 h-6" >
                  <input
                    id="fileBanesco"
                    type="file"
                    name="fileBanesco"
                    required
                    onChange={(e) => handleChangeFile(e, "banesco")}
                    className="hidden"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="fileBanesco"
                    className={`hover:scale-120 transform  flex flex-col items-center justify-center gap-1 cursor-pointer relative`}
                  >
                    <img src="https://confirmado.com.ve/conf/conf-upload/uploads/2016/05/logo_banesco_51.jpg" />
                  </label>
                </div>
                <div className="w-6 h-6" >
                  <input
                    id="fileVenezuela"
                    type="file"
                    name="fileVenezuela"
                    required
                    onChange={(e) => handleChangeFile(e, "venezuela")}
                    className="hidden"
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="fileVenezuela"
                    className={`hover:scale-120 transform  flex flex-col items-center justify-center gap-1 cursor-pointer relative`}
                  >
                    <img src="https://tramitesenlineabdv.banvenez.com/img/LogoSolo.png" />
                  </label>
                </div>
                <div onClick={() => generateXLSX({ data, tableMaster })} className="w-6 h-6" >
                  <label className={`hover:scale-120 transform  flex flex-col items-center justify-center gap-1 cursor-pointer relative`} >
                    <RiFileExcel2Fill className="w-6 h-6 text-green-700" />
                  </label>
                </div>
                {/* <div onClick={() => setShowPreviewPdf({ state: true })} className="w-6 h-6" >
                  <label className={`hover:scale-120 transform  flex flex-col items-center justify-center gap-1 cursor-pointer relative`} >
                    <RiFileExcel2Fill className="w-6 h-6 text-green-700" />
                  </label>
                </div> */}
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
                      {columnsView && <div className="bg-white w-36 h-64 m-2 inline-block border border-black shadow rounded space-y-1">
                        <div className="px-1 border-b border-black">
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
                            <div key={column.id} className="px-1">
                              <label>
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
              <button onClick={handleConciliar} disabled={uploading} type="button" className={`w-full h-full ${uploading ? "bg-blue-400 hover:bg-blue-500" : "bg-blue-500 hover:bg-blue-400"} rounded-lg flex items-center justify-center select-none font-medium text-white `}>CONCILIAR</button>
            </div>
          </div>
          {/*https://stackoverflow.com/questions/56373850/how-can-i-create-a-table-using-the-react-pdf-library-for-generation-pdf-report*/}
          {showTable && <div ref={targetRef} className="flex flex-col flex-1 border-[1px] border-gray-300 !rounded-xl">
            <table className="w-full">
              <thead className="top-0 left-0">
                {table.getHeaderGroups().map(headerGroup => {
                  return (
                    <tr key={headerGroup.id} className="border-b-[1px] border-gray-300">
                      <TableForward table={table} typeFilter={typeFilter} setTableMaster={setTableMaster} />
                      {headerGroup.headers.map((header, idx) => (
                        <th key={header.id} className={`h-6 ${idx !== 0 && "border-l-[1px] border-gray-300"}`}>
                          {header.isPlaceholder
                            ? null
                            : (<div className="space-y-1 flex flex-col justify-start h-full">
                              <div className="flex items-center">
                                {idx === 0 && <BiSearchAlt2
                                  onClick={() => {
                                    setSearch(!search)
                                    //setSearchColumn(searchColumn === header.id ? null : header.id)
                                    //searchColumn === header.id && header.column.setFilterValue(null)
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
                      ))}
                    </tr>
                  )
                })}
              </thead>
              <tbody className="block overflow-y-scroll w-[calc(100%+8px)] h-[calc(100vh-340px)]">
                {table.getRowModel().rows.map(row => {
                  return (
                    <tr key={row.id} onClick={() => setSelectRow(row.id === selectRow ? null : row.id)} className={`${row.id === selectRow && "bg-gray-300"} hover:bg-gray-200 select-none`}>
                      {row.getVisibleCells().map(cell => {
                        // console.log(122211100, flexRender(cell.column.columnDef.cell, cell.getContext()))
                        return (
                          <td className="px-2" key={cell.id}
                            onClick={(e: any) => {
                              if (cell.column.id === "transacciones") {
                                const rootelementOld = document.getElementById("parent")
                                if (rootelementOld) rootelementOld.removeAttribute("id")
                                e.target.id = "parent"
                                const rootelement = document.getElementById("parent")
                                const child = document.getElementById("child")
                                // if (rootelement) {
                                //   rootelement?.appendChild(child)
                                //   setInputView(true)
                                //   child.focus()
                                // }
                              }
                            }}
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
                {/* <span className="flex items-center gap-1">
                  Ir a página:
                  <input
                    type="number"
                    defaultValue={table.getState().pagination.pageIndex + 1}
                    onChange={e => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0
                      table.setPageIndex(page)
                    }}
                    className="p-1 rounded-lg w-8 h-6 border-[1px] border-gray-300 text-xs"
                  />
                </span> */}

              </div>
            </div>
            {/* <div>{table.getRowModel().rows.length} Rows</div> */}
            {/* <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre> */}
          </div>}
          {/* <div className="h-4" /> */}
          {/* <button onClick={() => rerender()} className="border p-2">
            Rerender
          </button> */}
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
        display: block; /* El spinner debe estar oculto por defecto */
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

      table *tbody {
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
      {/* <datalist id={column.id + 'list'}>
        {sortedUniqueValues.slice(0, 5000).map((value: any) => (
          <option value={value} key={value} />
        ))}
      </datalist> */}
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



const TableForward = ({ table, typeFilter, setTableMaster }) => {
  useEffect(() => {
    setTableMaster(table)
  }, [typeFilter])


  return (<></>)
}
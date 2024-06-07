interface Fectching {
  total: number
}

export interface FetchFacturas extends Fectching {
  results: Factura[]
}

export interface FetchTransaction extends Fectching {
  results: Transaction[]
}

export interface Transaction {
  _id: string
  banco: string
  fecha: Date
  referencia: string
  descripcion: string
  monto: number
  conciliado: boolean
  criterio: string
  facturas: Factura[]
  diferencia: number
  monto_facturas: number
  createdAt: Date
  updatedAt: Date
}

export interface Factura {
  _id: string
  id_factura: string
  fecha_pago: Date
  scanedFacturas: Date
  scanedFacturasTotal: number
  fecha_pago_ref: string
  total_cobrado: number
  referencia: string
  forma_pagoID: number
  forma_pago: String
  cajeroID: number
  cajero: String
  pagado: boolean
  recargado: boolean
  criterio: string
  transacciones: Transaction[]
  monto_facturas: number
  diferencia: number
  createdAt: Date
  updatedAt: Date
}


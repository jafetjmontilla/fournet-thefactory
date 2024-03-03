const getTreeArr = (f) => {
  let arr = []
  for (const key in f) {
    f[key] && arr.push({ key, value: f[key] })
  }
  return arr
}

export const getDataTreeFacturaWispHup = (facturaWispHup) => {
  const f = {
    id_factura: facturaWispHup.id_factura,
    folio: facturaWispHup.folio,
    fecha_emision: facturaWispHup.fecha_emision,
    fecha_vencimiento: facturaWispHup.fecha_vencimiento,
    fecha_pago: facturaWispHup.fecha_pago,
    estado: facturaWispHup.estado,
    tipo: facturaWispHup.tipo,
    id_zona: facturaWispHup.zona.id,
    nombre_zona: facturaWispHup.nombre_zona,
    sub_total: facturaWispHup.sub_total,
    descuento: facturaWispHup.descuento,
    saldo: facturaWispHup.saldo,
    saldo_nuevo: facturaWispHup.saldo_nuevo,
    impuestos_total: facturaWispHup.impuestos_total,
    total_cobrado: facturaWispHup.total_cobrado,
    total: facturaWispHup.total,
    comprobante_pago: facturaWispHup.comprobante_pago,
    referencia: facturaWispHup.referencia,
    referencia_oxxo: facturaWispHup.referencia_oxxo,
    total_oxxo: facturaWispHup.total_oxxo,
    id_mercadopago: facturaWispHup.id_mercadopago,
    id_payu: facturaWispHup.id_payu,
    url_payu: facturaWispHup.url_payu,
    total_pasarela: facturaWispHup.total_pasarela,
    total_openpay: facturaWispHup.total_openpay,
    retencion_porcentaje: facturaWispHup.retencion_porcentaje,
    retenciones_total: facturaWispHup.retenciones_total,
    id_forma_pago: facturaWispHup.forma_pago.id,
    nombre_forma_pago: facturaWispHup.forma_pago.nombre,
    id_cajero: facturaWispHup.cajero.id,
    nombre_cajero: facturaWispHup.cajero.nombre,
    usuario_cliente: facturaWispHup.cliente.usuario,
    nombre_cliente: facturaWispHup.cliente.nombre,
    email_cliente: facturaWispHup.cliente.email,
    cedula_cliente: facturaWispHup.cliente.cedula,
    direccion_cliente: facturaWispHup.cliente.direccion,
    localidad_cliente: facturaWispHup.cliente.localidad,
    telefono_cliente: facturaWispHup.cliente.telefono,
    rfc_cliente: facturaWispHup.rfc_cliente,
    id_articulos: facturaWispHup.articulos[0].id,
    uuid_equipo_articulos: facturaWispHup.articulos[0].uuid_equipo,
    categoria_stock_articulos: facturaWispHup.articulos[0].categoria_stock,
    cantidad_articulos: facturaWispHup.articulos[0].cantidad,
    descripcion_articulos: facturaWispHup.articulos[0].descripcion,
    precio_articulos: facturaWispHup.articulos[0].precio,
    id_servicio: facturaWispHup.articulos[0].servicio.id_servicio,
  }

  return getTreeArr(f)
}

export const getDataTreeTransaction = (transaction) => {
  const detallesFacturasArr = transaction.facturas.map(elem => {
    const asd = getTreeArr(elem)
    return asd
  })
  const fd = detallesFacturasArr
  let arr = []
  for (const key in fd) {
    if (fd[key]) {
      arr.push({ key: `fact-${fd[key].find(elem => elem.key === "id_factura").value}`, value: fd[key] })
    }
  }
  const f = {
    referencia: transaction.referencia,
    banco: transaction.banco,
    monto: transaction.monto,
    fecha: transaction.fecha,
    fecha_conciliacion: transaction.updatedAt,
    total_facturas: transaction.facturas.reduce((acc, item) => {
      return acc + item.total_cobrado
    }, 0),
  }
  return [...getTreeArr(f), ...arr]
}
import { useState, useRef, RefObject } from "react";
import { InputWithLabel } from "../components/InputWithLabel";
import { IconDelete } from "../icons";

const getToday = () => new Date().toISOString().slice(0, 10);

// Simulación de proveedores guardados
const proveedoresGuardados = [
  {
    id: 1,
    TipoIdentificacion: "J",
    NumeroIdentificacion: "12345678",
    RazonSocial: "Proveedor Ejemplo 1",
    Direccion: "Calle 1",
    Telefono: "04141234567",
    Correo: "ejemplo1@mail.com"
  },
  {
    id: 2,
    TipoIdentificacion: "V",
    NumeroIdentificacion: "87654321",
    RazonSocial: "Proveedor Ejemplo 2",
    Direccion: "Calle 2",
    Telefono: "04147654321",
    Correo: "ejemplo2@mail.com"
  }
];

export default function RetentionIVA() {
  const [retencion, setRetencion] = useState({
    Serie: "",
    NumeroDocumento: "",
    FechaEmision: getToday()
  });
  const [proveedor, setProveedor] = useState({
    TipoIdentificacion: "",
    NumeroIdentificacion: "",
    RazonSocial: "",
    Direccion: "",
    Telefono: "",
    Correo: "",
    TotalBaseImponible: "",
    TotalIVA: "",
    TotalRetenido: ""
  });
  const [proveedorId, setProveedorId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const inputRef = useRef();
  const [facturas, setFacturas] = useState([
    {
      FechaDocumento: "",
      SerieDocumento: "",
      NumeroDocumento: "",
      NumeroControl: "",
      MontoTotal: "",
      MontoExento: "",
      BaseImponible: "",
      PorcentajeIVA: "",
      MontoIVA: "",
      Retenido: "",
      Porcentaje: "",
      RetenidoIVA: "",
      Percibido: ""
    }
  ]);

  // Refs para inputs de proveedor y retención
  const retencionRefs: RefObject<HTMLInputElement>[] = [useRef(null), useRef(null), useRef(null)];
  const proveedorRefs: RefObject<HTMLInputElement>[] = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  // Para facturas: matriz de refs [fila][columna]
  const facturaCampos = [
    'FechaDocumento', 'SerieDocumento', 'NumeroDocumento', 'NumeroControl',
    'MontoTotal', 'MontoExento', 'BaseImponible', 'PorcentajeIVA',
    'MontoIVA', 'Retenido', 'Porcentaje', 'RetenidoIVA', 'Percibido'
  ];
  const facturaRefs = facturas.map((_, rowIdx) =>
    facturaCampos.map(() => useRef<HTMLInputElement>(null))
  );

  // Buscar proveedores por nombre o número de identificación
  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    if (valor.length > 1) {
      const sugeridos = proveedoresGuardados.filter(p =>
        p.RazonSocial.toLowerCase().includes(valor.toLowerCase()) ||
        p.NumeroIdentificacion.includes(valor)
      );
      setSugerencias(sugeridos);
    } else {
      setSugerencias([]);
    }
  };

  // Seleccionar proveedor de la lista
  const seleccionarProveedor = (p) => {
    setProveedor({ ...p });
    setProveedorId(p.id);
    setBusqueda("");
    setSugerencias([]);
  };

  // Guardar nuevo proveedor
  const guardarNuevoProveedor = () => {
    // Aquí iría la lógica para guardar en backend
    alert("Proveedor guardado (simulado)");
    setProveedorId(null);
  };

  // Guardar cambios en proveedor existente
  const guardarCambiosProveedor = () => {
    // Aquí iría la lógica para actualizar en backend
    alert("Cambios guardados (simulado)");
  };

  // Aquí puedes agregar funciones para manejar los cambios en los formularios y el envío de datos

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Retenciones IVA</h1>
      <div className="mb-8 border p-4 rounded bg-gray-50">
        <h2 className="font-semibold mb-2">RETENCIÓN</h2>
        <div className="grid md:grid-cols-12 gap-4">
          <InputWithLabel label="Serie" value={retencion.Serie} onChange={e => setRetencion({ ...retencion, Serie: e.target.value })} colSpan="md:col-span-1" ref={retencionRefs[0]} onEnterNext={() => retencionRefs[1].current && retencionRefs[1].current.focus()} />
          <InputWithLabel label="Número Documento" value={retencion.NumeroDocumento} onChange={e => setRetencion({ ...retencion, NumeroDocumento: e.target.value })} colSpan="md:col-span-2" ref={retencionRefs[1]} onEnterNext={() => retencionRefs[2].current && retencionRefs[2].current.focus()} />
          <InputWithLabel label="Fecha Emisión" type="date" value={retencion.FechaEmision} onChange={e => setRetencion({ ...retencion, FechaEmision: e.target.value })} colSpan="md:col-span-2" ref={retencionRefs[2]} onEnterNext={() => proveedorRefs[0].current && proveedorRefs[0].current.focus()} />
        </div>
      </div>
      <div className="mb-8 border p-4 rounded bg-gray-50">
        <h2 className="font-semibold mb-2">DATOS PROVEEDOR</h2>
        <div className="mb-2 flex flex-col md:flex-row md:items-center gap-2">
          <div className="relative w-full md:w-1/2">
            <input
              ref={inputRef}
              type="text"
              value={busqueda}
              onChange={handleBusqueda}
              className="border rounded px-2 py-1 w-full"
              placeholder="Buscar proveedor por nombre o identificación..."
            />
            {sugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto shadow">
                {sugerencias.map((p) => (
                  <li key={p.id} className="px-2 py-1 hover:bg-violet-100 cursor-pointer" onClick={() => seleccionarProveedor(p)}>
                    {p.RazonSocial} ({p.NumeroIdentificacion})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={guardarNuevoProveedor}>Guardar nuevo</button>
          {proveedorId && (
            <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={guardarCambiosProveedor}>Guardar cambios</button>
          )}
        </div>
        <div className="grid md:grid-cols-12 gap-2">
          <InputWithLabel label="Tipo Identificación" value={proveedor.TipoIdentificacion} onChange={e => setProveedor({ ...proveedor, TipoIdentificacion: e.target.value })} colSpan="md:col-span-2" ref={proveedorRefs[0]} onEnterNext={() => proveedorRefs[1].current && proveedorRefs[1].current.focus()} />
          <InputWithLabel label="Número Identificación" value={proveedor.NumeroIdentificacion} onChange={e => setProveedor({ ...proveedor, NumeroIdentificacion: e.target.value })} colSpan="md:col-span-2" ref={proveedorRefs[1]} onEnterNext={() => proveedorRefs[2].current && proveedorRefs[2].current.focus()} />
          <InputWithLabel label="Razón Social" value={proveedor.RazonSocial} onChange={e => setProveedor({ ...proveedor, RazonSocial: e.target.value })} colSpan="md:col-span-8" ref={proveedorRefs[2]} onEnterNext={() => proveedorRefs[3].current && proveedorRefs[3].current.focus()} />
          <InputWithLabel label="Dirección" value={proveedor.Direccion} onChange={e => setProveedor({ ...proveedor, Direccion: e.target.value })} colSpan="md:col-span-12" ref={proveedorRefs[3]} onEnterNext={() => proveedorRefs[4].current && proveedorRefs[4].current.focus()} />
          <InputWithLabel label="Teléfono" value={proveedor.Telefono} onChange={e => setProveedor({ ...proveedor, Telefono: e.target.value })} colSpan="md:col-span-3" ref={proveedorRefs[4]} onEnterNext={() => proveedorRefs[5].current && proveedorRefs[5].current.focus()} />
          <InputWithLabel label="Correo" value={proveedor.Correo} onChange={e => setProveedor({ ...proveedor, Correo: e.target.value })} colSpan="md:col-span-5" ref={proveedorRefs[5]} />
        </div>
      </div>
      <div className="mb-8 border p-4 rounded bg-gray-50">
        <h2 className="font-semibold mb-2">DATOS FACTURAS</h2>
        <table className="min-w-full text-[11px] border">
          <thead>
            <tr className="bg-gray-200">
              <th>Fecha</th>
              <th>Serie</th>
              <th>No. Doc.</th>
              <th>No. Control</th>
              <th>Monto Total</th>
              <th>Monto Exento</th>
              <th>Base Imponible</th>
              <th>% IVA</th>
              <th>Monto IVA</th>
              <th>Monto Ret</th>
              <th>% Ret</th>
              <th>Ret IVA</th>
              <th>Percibido</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, idx) => {
              const textSize = "text-[12px]";
              const wFecha = "w-26";
              const wSerie = "w-14 text-center";
              const wNo = "w-[86px] text-center";
              const wMonto = "w-[106px] text-right";
              const wPorcentaje = "w-[48px] text-center";
              return (
                <tr key={idx} className="text-[11px]">
                  <td><InputWithLabel type="date" value={factura.FechaDocumento} onChange={e => { const f = [...facturas]; f[idx].FechaDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wFecha}`} /></td>
                  <td><InputWithLabel value={factura.SerieDocumento} onChange={e => { const f = [...facturas]; f[idx].SerieDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wSerie}`} /></td>
                  <td><InputWithLabel value={factura.NumeroDocumento} onChange={e => { const f = [...facturas]; f[idx].NumeroDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wNo}`} /></td>
                  <td><InputWithLabel value={factura.NumeroControl} onChange={e => { const f = [...facturas]; f[idx].NumeroControl = e.target.value; setFacturas(f); }} className={`${textSize} ${wNo}`} /></td>
                  <td><InputWithLabel value={factura.MontoTotal} onChange={e => { const f = [...facturas]; f[idx].MontoTotal = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.MontoExento} onChange={e => { const f = [...facturas]; f[idx].MontoExento = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.BaseImponible} onChange={e => { const f = [...facturas]; f[idx].BaseImponible = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.PorcentajeIVA} onChange={e => { const f = [...facturas]; f[idx].PorcentajeIVA = e.target.value; setFacturas(f); }} className={`${textSize} ${wPorcentaje}`} /></td>
                  <td><InputWithLabel value={factura.MontoIVA} onChange={e => { const f = [...facturas]; f[idx].MontoIVA = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.Retenido} onChange={e => { const f = [...facturas]; f[idx].Retenido = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.Porcentaje} onChange={e => { const f = [...facturas]; f[idx].Porcentaje = e.target.value; setFacturas(f); }} className={`${textSize} ${wPorcentaje}`} /></td>
                  <td><InputWithLabel value={factura.RetenidoIVA} onChange={e => { const f = [...facturas]; f[idx].RetenidoIVA = e.target.value; setFacturas(f); }} className={`${textSize} ${wPorcentaje}`} /></td>
                  <td><InputWithLabel value={factura.Percibido} onChange={e => { const f = [...facturas]; f[idx].Percibido = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td className="w-full h-8 flex justify-center items-center"><IconDelete className="w-4 h-4 text-gray-700 cursor-pointer hover:text-gray-800" onClick={() => { const f = [...facturas]; f.splice(idx, 1); setFacturas(f); }} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setFacturas([...facturas, { FechaDocumento: "", SerieDocumento: "", NumeroDocumento: "", NumeroControl: "", MontoTotal: "", MontoExento: "", BaseImponible: "", PorcentajeIVA: "", MontoIVA: "", Retenido: "", Porcentaje: "", RetenidoIVA: "", Percibido: "" }])}>Agregar Factura</button>
      </div>
      <button className="px-6 py-2 bg-green-600 text-white rounded">Guardar</button>
    </div>
  );
} 
import { useState, useRef, RefObject, useEffect } from "react";
import { InputWithLabel } from "../components/InputWithLabel";
import { IconDelete } from "../icons";
import { fetchApiJaihom, queries } from "../utils/Fetching";
import { useToast } from "../components/Toast";

const getToday = () => new Date().toISOString().slice(0, 10);

// Simulación de proveedores guardados
const proveedoresGuardados = [
  {
    id: 1,
    letterIdentifier: "J",
    numberIdentifier: 12345678,
    name: "Proveedor Ejemplo 1",
    address: "Calle 1",
    phone: "04141234567",
    email: "ejemplo1@mail.com"
  },
  {
    id: 2,
    letterIdentifier: "V",
    numberIdentifier: 87654321,
    name: "Proveedor Ejemplo 2",
    address: "Calle 2",
    phone: "04147654321",
    email: "ejemplo2@mail.com"
  }
];

export default function RetentionIVA() {
  const { showToast, ToastContainer } = useToast();
  const [retencion, setRetencion] = useState({
    Serie: "",
    NumeroDocumento: "",
    FechaEmision: getToday()
  });
  const [proveedor, setProveedor] = useState({
    letterIdentifier: "",
    numberIdentifier: "",
    name: "",
    address: "",
    phone: "",
    email: "",
    TotalBaseImponible: "",
    TotalIVA: "",
    TotalRetenido: ""
  });
  const [proveedorId, setProveedorId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [sugerencias, setSugerencias] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();
  const debounceRef = useRef<NodeJS.Timeout>();

  // Refs para inputs de proveedor y retención
  const retencionRefs: RefObject<HTMLInputElement>[] = [useRef(null), useRef(null), useRef(null)];
  const proveedorRefs: RefObject<HTMLInputElement>[] = [useRef(null), useRef(null), useRef(null), useRef(null), useRef(null), useRef(null)];

  const [facturas, setFacturas] = useState([
    {
      FechaDocumento: getToday(),
      SerieDocumento: "",
      NumeroDocumento: "",
      NumeroControl: "",
      MontoTotal: "",
      MontoExento: "",
      BaseImponible: "",
      PorcentajeIVA: "16", // Valor constante
      MontoIVA: "",
      Retenido: "",
      Porcentaje: "",
      RetenidoIVA: "",
      Percibido: ""
    }
  ]);

  // Función para calcular automáticamente los montos
  const calcularMontos = (factura, index) => {
    const baseImponible = parseFloat(factura.BaseImponible) || 0;
    const porcentajeRetencion = parseFloat(factura.Porcentaje) || 0;

    // Calcular Monto IVA (Base Imponible * 16%)
    const montoIVA = baseImponible * 0.16;

    // Calcular Monto Retenido (Monto IVA * % Retención)
    const montoRetenido = montoIVA * (porcentajeRetencion / 100);

    const facturasActualizadas = [...facturas];
    facturasActualizadas[index] = {
      ...factura,
      MontoIVA: montoIVA.toFixed(2),
      Retenido: montoRetenido.toFixed(2)
    };

    setFacturas(facturasActualizadas);
  };

  // Para facturas: matriz de refs [fila][columna]
  const facturaCampos = [
    'FechaDocumento', 'SerieDocumento', 'NumeroDocumento', 'NumeroControl',
    'MontoTotal', 'MontoExento', 'BaseImponible', 'PorcentajeIVA',
    'MontoIVA', 'Retenido', 'Porcentaje', 'RetenidoIVA', 'Percibido'
  ];
  const facturaRefs = facturas.map((_, rowIdx) =>
    facturaCampos.map(() => useRef<HTMLInputElement>(null))
  );

  // Función de búsqueda con debounce
  const buscarProveedores = async (valor: string) => {
    if (valor.length > 1) {
      try {
        const result = await fetchApiJaihom({
          query: queries.searchSupplier,
          variables: {
            text: valor
          },
          type: "json"
        });

        if (result && result.results) {
          setSugerencias(result.results);
        } else {
          setSugerencias([]);
        }
      } catch (error) {
        console.error("Error buscando proveedores:", error);
        setSugerencias([]);
      }
    } else {
      setSugerencias([]);
    }
  };

  // Buscar proveedores por nombre o número de identificación con debounce
  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);

    // Limpiar el timeout anterior
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Crear nuevo timeout para ejecutar la búsqueda después de 500ms de pausa
    debounceRef.current = setTimeout(() => {
      buscarProveedores(valor);
    }, 500);
  };

  // Limpiar timeout al desmontar el componente
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Seleccionar proveedor de la lista
  const seleccionarProveedor = (p) => {
    setProveedor({
      letterIdentifier: p.letterIdentifier || "",
      numberIdentifier: p.numberIdentifier?.toString() || "",
      name: p.name || "",
      address: p.address || "",
      phone: p.phone || "",
      email: p.email || "",
      TotalBaseImponible: "",
      TotalIVA: "",
      TotalRetenido: ""
    });
    setProveedorId(p._id);
    setBusqueda("");
    setSugerencias([]);
  };

  // Guardar nuevo proveedor
  const guardarNuevoProveedor = async () => {
    if (!proveedor.name || !proveedor.letterIdentifier || !proveedor.numberIdentifier) {
      showToast("Por favor complete los campos obligatorios: Razón Social, Tipo y Número de Identificación", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = await fetchApiJaihom({
        query: queries.createSupplier,
        variables: {
          args: [{
            letterIdentifier: proveedor.letterIdentifier,
            numberIdentifier: proveedor.numberIdentifier,
            name: proveedor.name,
            address: proveedor.address,
            phone: proveedor.phone,
            email: proveedor.email
          }]
        },
        type: "json"
      });

      if (result && result.results && result.results.length > 0) {
        const nuevoProveedor = result.results[0];
        setProveedorId(nuevoProveedor._id);
        showToast("Proveedor guardado exitosamente", "success");
      } else {
        showToast("Error al guardar el proveedor", "error");
      }
    } catch (error) {
      console.error("Error guardando proveedor:", error);
      showToast("Error al guardar el proveedor", "error");
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios en proveedor existente
  const guardarCambiosProveedor = async () => {
    if (!proveedorId) {
      showToast("No hay un proveedor seleccionado para actualizar", "warning");
      return;
    }

    if (!proveedor.name || !proveedor.letterIdentifier || !proveedor.numberIdentifier) {
      showToast("Por favor complete los campos obligatorios: Razón Social, Tipo y Número de Identificación", "warning");
      return;
    }

    setLoading(true);
    try {
      const result = await fetchApiJaihom({
        query: queries.updateSupplier,
        variables: {
          args: {
            _id: proveedorId,
            letterIdentifier: proveedor.letterIdentifier,
            numberIdentifier: proveedor.numberIdentifier,
            name: proveedor.name,
            address: proveedor.address,
            phone: proveedor.phone,
            email: proveedor.email
          }
        },
        type: "json"
      });

      if (result && result._id) {
        showToast("Cambios guardados exitosamente", "success");
      } else {
        showToast("Error al actualizar el proveedor", "error");
      }
    } catch (error) {
      console.error("Error actualizando proveedor:", error);
      showToast("Error al actualizar el proveedor", "error");
    } finally {
      setLoading(false);
    }
  };

  // Función para formatear fecha en formato dd/mm/yyyy
  const formatearFecha = (fecha: string | Date) => {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  // Función para formatear hora en formato HH:MM:SS am/pm
  const formatearHora = (fecha: Date = new Date()) => {
    const horas = fecha.getHours();
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    const ampm = horas >= 12 ? 'pm' : 'am';
    const horas12 = horas % 12 || 12;
    const horasFormateadas = horas12.toString().padStart(2, '0');
    return `${horasFormateadas}:${minutos}:${segundos} ${ampm}`;
  };

  // Función para generar ZIP con JSONs
  const generarZip = async () => {
    try {
      // Obtener numeración continua del localStorage
      const lastNumber = localStorage.getItem('retencion_iva_counter') || '0';
      const nextNumber = parseInt(lastNumber) + 1;
      localStorage.setItem('retencion_iva_counter', nextNumber.toString());

      // Formatear fecha para el nombre del archivo
      const today = new Date();
      const yyyymmdd = today.getFullYear().toString() +
        (today.getMonth() + 1).toString().padStart(2, '0') +
        today.getDate().toString().padStart(2, '0');

      const fileName = `J402014171-${yyyymmdd}-${nextNumber.toString().padStart(3, '0')}.zip`;

      // Crear estructura base del JSON
      const baseJson = {
        "DocumentoElectronico": {
          "Encabezado": {
            "IdentificacionDocumento": {
              "TipoDocumento": "05",
              "NumeroDocumento": retencion.NumeroDocumento || "00002",
              "TipoProveedor": null,
              "TipoTransaccion": "01",
              "NumeroPlanillaImportacion": null,
              "NumeroExpedienteImportacion": null,
              "SerieFacturaAfectada": null,
              "NumeroFacturaAfectada": null,
              "FechaFacturaAfectada": null,
              "MontoFacturaAfectada": null,
              "ComentarioFacturaAfectada": null,
              "RegimenEspTributacion": null,
              "FechaEmision": retencion.FechaEmision ? formatearFecha(retencion.FechaEmision) : formatearFecha(new Date()),
              "FechaVencimiento": null,
              "HoraEmision": formatearHora(),
              "Anulado": false,
              "TipoDePago": "importado",
              "Serie": retencion.Serie || "",
              "Sucursal": "0000",
              "TipoDeVenta": "interna",
              "Moneda": "VES"
            },
            "Vendedor": null,
            "Comprador": null,
            "SujetoRetenido": {
              "TipoIdentificacion": proveedor.letterIdentifier || "V",
              "NumeroIdentificacion": proveedor.numberIdentifier || "26159207",
              "RazonSocial": proveedor.name || "Proveedor de Prueba",
              "Direccion": proveedor.address || "Av principal de prueba, donde estan los proveedores",
              "Pais": "VE",
              "Telefono": proveedor.phone ? [proveedor.phone] : ["02122447664"],
              "Correo": proveedor.email ? [proveedor.email] : ["jafetmontilla@gmail.com"]
            },
            "Totales": null,
            "TotalesRetencion": {
              "FechaEmisionCR": retencion.FechaEmision ? formatearFecha(retencion.FechaEmision) : formatearFecha(new Date()),
              "NumeroCompRetencion": retencion.NumeroDocumento || "00002",
              "TotalBaseImponible": "0.00", // Se calculará sumando todas las facturas
              "TotalIVA": "0.00", // Se calculará sumando todas las facturas
              "TotalRetenido": "0.00" // Se calculará sumando todas las facturas
            }
          },
          "DetallesItems": null,
          "DetallesRetencion": [],
          "Viajes": null,
          "InfoAdicional": null,
          "GuiaDespacho": null
        }
      };

      // Calcular totales
      let totalBaseImponible = 0;
      let totalIVA = 0;
      let totalRetenido = 0;

      // Agregar cada factura como DetalleRetencion
      facturas.forEach((factura, index) => {
        const baseImponible = parseFloat(factura.BaseImponible) || 0;
        const montoIVA = parseFloat(factura.MontoIVA) || 0;
        const retenido = parseFloat(factura.Retenido) || 0;

        totalBaseImponible += baseImponible;
        totalIVA += montoIVA;
        totalRetenido += retenido;

        const detalleRetencion = {
          "NumeroLinea": (index + 1).toString(),
          "FechaDocumento": factura.FechaDocumento ? formatearFecha(factura.FechaDocumento) : formatearFecha(new Date()),
          "SerieDocumento": factura.SerieDocumento || "A",
          "TipoDocumento": "01",
          "NumeroDocumento": factura.NumeroDocumento || "000070",
          "NumeroControl": factura.NumeroControl || "00-000070",
          "TipoTransaccion": "01",
          "MontoTotal": factura.MontoTotal || "11.60",
          "MontoExento": factura.MontoExento || "0",
          "BaseImponible": factura.BaseImponible || "10.00",
          "PorcentajeIVA": factura.PorcentajeIVA || "16.00",
          "MontoIVA": factura.MontoIVA || "1.60",
          "Retenido": factura.Retenido || "100",
          "Porcentaje": factura.Porcentaje || "100",
          "RetenidoIVA": factura.Porcentaje || "100",
          "Percibido": factura.Retenido || "100",
          "Moneda": "VES",
          "InfoAdicionalItem": [
            {
              "Campo": "prueba pdf",
              "Valor": "resutado prueba"
            }
          ]
        };

        baseJson.DocumentoElectronico.DetallesRetencion.push(detalleRetencion);
      });

      // Actualizar totales
      baseJson.DocumentoElectronico.Encabezado.TotalesRetencion.TotalBaseImponible = totalBaseImponible.toFixed(2);
      baseJson.DocumentoElectronico.Encabezado.TotalesRetencion.TotalIVA = totalIVA.toFixed(2);
      baseJson.DocumentoElectronico.Encabezado.TotalesRetencion.TotalRetenido = totalRetenido.toFixed(2);

      // Crear archivo JSON
      const jsonContent = JSON.stringify(baseJson, null, 2);
      const jsonBlob = new Blob([jsonContent], { type: 'application/json' });

      // Crear ZIP usando JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Agregar el JSON al ZIP
      zip.file('retencion_iva.json', jsonBlob);

      // Generar y descargar el ZIP
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast(`Archivo ZIP generado exitosamente: ${fileName}`, "success");
    } catch (error) {
      console.error("Error generando ZIP:", error);
      showToast("Error al generar el archivo ZIP", "error");
    }
  };

  return (
    <div className="p-8 max-w-screen-xl mx-auto">
      <ToastContainer />
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
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
            {sugerencias.length > 0 && (
              <ul className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto shadow">
                {sugerencias.map((p) => (
                  <li key={p._id} className="px-2 py-1 hover:bg-violet-100 cursor-pointer" onClick={() => seleccionarProveedor(p)}>
                    {p.name} ({p.numberIdentifier})
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            className={`px-3 py-1 text-white rounded ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}`}
            onClick={guardarNuevoProveedor}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar nuevo'}
          </button>
          {proveedorId && (
            <button
              className={`px-3 py-1 text-white rounded ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={guardarCambiosProveedor}
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </button>
          )}
        </div>
        <div className="grid md:grid-cols-12 gap-2">
          <InputWithLabel label="Tipo Identificación" value={proveedor.letterIdentifier} onChange={e => setProveedor({ ...proveedor, letterIdentifier: e.target.value })} colSpan="md:col-span-2" ref={proveedorRefs[0]} onEnterNext={() => proveedorRefs[1].current && proveedorRefs[1].current.focus()} />
          <InputWithLabel label="Número Identificación" value={proveedor.numberIdentifier} onChange={e => setProveedor({ ...proveedor, numberIdentifier: e.target.value })} colSpan="md:col-span-2" ref={proveedorRefs[1]} onEnterNext={() => proveedorRefs[2].current && proveedorRefs[2].current.focus()} />
          <InputWithLabel label="Razón Social" value={proveedor.name} onChange={e => setProveedor({ ...proveedor, name: e.target.value })} colSpan="md:col-span-8" ref={proveedorRefs[2]} onEnterNext={() => proveedorRefs[3].current && proveedorRefs[3].current.focus()} />
          <InputWithLabel label="Dirección" value={proveedor.address} onChange={e => setProveedor({ ...proveedor, address: e.target.value })} colSpan="md:col-span-12" ref={proveedorRefs[3]} onEnterNext={() => proveedorRefs[4].current && proveedorRefs[4].current.focus()} />
          <InputWithLabel label="Teléfono" value={proveedor.phone} onChange={e => setProveedor({ ...proveedor, phone: e.target.value })} colSpan="md:col-span-3" ref={proveedorRefs[4]} onEnterNext={() => proveedorRefs[5].current && proveedorRefs[5].current.focus()} />
          <InputWithLabel label="Correo" value={proveedor.email} onChange={e => setProveedor({ ...proveedor, email: e.target.value })} colSpan="md:col-span-5" ref={proveedorRefs[5]} />
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
              {/* <th>Ret IVA</th> */}
              {/* <th>Percibido</th> */}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, idx) => {
              const textSize = "text-[14px]";
              const wFecha = "w-26";
              const wSerie = "w-14 text-center";
              const wNo = "w-[110px] text-center";
              const wMonto = "w-[122px] text-right";
              const wPorcentaje = "w-[60px] text-center";
              return (
                <tr key={idx} className="text-[11px]">
                  <td><InputWithLabel type="date" value={factura.FechaDocumento} onChange={e => { const f = [...facturas]; f[idx].FechaDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wFecha}`} /></td>
                  <td><InputWithLabel value={factura.SerieDocumento} onChange={e => { const f = [...facturas]; f[idx].SerieDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wSerie}`} /></td>
                  <td><InputWithLabel value={factura.NumeroDocumento} onChange={e => { const f = [...facturas]; f[idx].NumeroDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wNo}`} /></td>
                  <td><InputWithLabel value={factura.NumeroControl} onChange={e => { const f = [...facturas]; f[idx].NumeroControl = e.target.value; setFacturas(f); }} className={`${textSize} ${wNo}`} /></td>
                  <td><InputWithLabel value={factura.MontoTotal} onChange={e => { const f = [...facturas]; f[idx].MontoTotal = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.MontoExento} onChange={e => { const f = [...facturas]; f[idx].MontoExento = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.BaseImponible} onChange={e => {
                    const f = [...facturas];
                    f[idx].BaseImponible = e.target.value;
                    setFacturas(f);
                    // Calcular montos automáticamente cuando cambia la base imponible
                    setTimeout(() => calcularMontos(f[idx], idx), 0);
                  }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.PorcentajeIVA} disabled={true} className={`${textSize} ${wPorcentaje} bg-gray-100`} /></td>
                  <td><InputWithLabel value={factura.MontoIVA} disabled={true} className={`${textSize} ${wMonto} bg-gray-100`} /></td>
                  <td><InputWithLabel value={factura.Retenido} disabled={true} className={`${textSize} ${wMonto} bg-gray-100`} /></td>
                  <td><InputWithLabel value={factura.Porcentaje} onChange={e => {
                    const f = [...facturas];
                    f[idx].Porcentaje = e.target.value;
                    setFacturas(f);
                    // Calcular montos automáticamente cuando cambia el porcentaje de retención
                    setTimeout(() => calcularMontos(f[idx], idx), 0);
                  }} className={`${textSize} ${wPorcentaje}`} /></td>
                  {/* <td><InputWithLabel value={factura.RetenidoIVA} onChange={e => { const f = [...facturas]; f[idx].RetenidoIVA = e.target.value; setFacturas(f); }} className={`${textSize} ${wPorcentaje}`} /></td> */}
                  {/* <td><InputWithLabel value={factura.Percibido} onChange={e => { const f = [...facturas]; f[idx].Percibido = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td> */}
                  <td className="w-full h-8 flex justify-center items-center"><IconDelete className="w-4 h-4 text-gray-700 cursor-pointer hover:text-gray-800" onClick={() => { const f = [...facturas]; f.splice(idx, 1); setFacturas(f); }} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setFacturas([
          ...facturas,
          {
            FechaDocumento: getToday(),
            SerieDocumento: "",
            NumeroDocumento: "",
            NumeroControl: "",
            MontoTotal: "",
            MontoExento: "",
            BaseImponible: "",
            PorcentajeIVA: "16", // Valor constante
            MontoIVA: "",
            Retenido: "",
            Porcentaje: "",
            RetenidoIVA: "",
            Percibido: ""
          }
        ])}>Agregar Factura</button>
      </div>
      <button className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700" onClick={generarZip}>
        Generar ZIP
      </button>
    </div>
  );
} 
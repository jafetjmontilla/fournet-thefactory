import { useState, useRef, RefObject, useEffect, useMemo, createRef } from "react";
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
    SerieIva: "",
    NumeroDocumentoIva: "",
    SerieIslr: "",
    NumeroDocumentoIslr: "",
    FechaEmision: getToday(),
    CodigoConcepto: ""
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
  const [isIva, setIsIva] = useState(false);
  const [isIslr, setIsIslr] = useState(false);

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
      Percibido: "",
      PorcentajeISLR: "",
      RetenidoISLR: "",
      CodigoConcepto: ""
    }
  ]);

  // Para facturas: matriz de refs [fila][columna]
  const facturaCampos = [
    'FechaDocumento', 'SerieDocumento', 'NumeroDocumento', 'NumeroControl',
    'MontoTotal', 'MontoExento', 'BaseImponible', 'PorcentajeIVA',
    'MontoIVA', 'Retenido', 'Porcentaje', 'RetenidoIVA', 'Percibido',
    'PorcentajeISLR', 'RetenidoISLR', 'CodigoConcepto'
  ];

  // Crear refs de manera estática - máximo 10 facturas para evitar problemas
  const maxFacturas = 10;
  const facturaRefs = useMemo(() => {
    return Array.from({ length: maxFacturas }, () =>
      Array.from({ length: facturaCampos.length }, () => createRef<HTMLInputElement>())
    );
  }, []);

  // Función para calcular automáticamente los montos iva
  const calcularMontos = (factura, index) => {
    const baseImponible = parseFloat(factura.BaseImponible) || 0;
    const porcentajeRetencion = parseFloat(factura.Porcentaje) || 0;
    const porcentajeRetencionISLR = parseFloat(factura.PorcentajeISLR) || 0;

    // Calcular Monto IVA (Base Imponible * 16%)
    const montoIVA = baseImponible * 0.16;

    // Calcular Monto Retenido (Monto IVA * % Retención)
    const montoRetenido = montoIVA * (porcentajeRetencion / 100);
    const montoRetenidoISLR = baseImponible * (porcentajeRetencionISLR / 100);

    const facturasActualizadas = [...facturas];
    facturasActualizadas[index] = {
      ...factura,
      MontoIVA: montoIVA.toFixed(2),
      Retenido: montoRetenido.toFixed(2),
      RetenidoISLR: montoRetenidoISLR.toFixed(2)
    };

    setFacturas(facturasActualizadas);
  };

  // Función de búsqueda con debounce
  const buscarProveedores = async (valor: string) => {
    if (valor.length) {
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
    if (fecha instanceof Date) {
      fecha = fecha.toISOString().split('T')[0];
    }
    const d = fecha.split('-');
    const dia = d[2].padStart(2, '0');
    const mes = d[1].padStart(2, '0');
    const año = d[0];
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
  const generarZip = async ({ isIva, isIslr }: { isIva: boolean, isIslr: boolean }) => {
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
              "TipoDocumento": "",
              "NumeroDocumento": null,
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
              "Serie": null,
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
              "Telefono": proveedor.phone ? [proveedor.phone] : ["02121234567"],
              "Correo": proveedor.email ? [proveedor.email] : ["jafetmontilla@gmail.com"]
            },
            "Totales": null,
            "TotalesRetencion": {
              "FechaEmisionCR": retencion.FechaEmision ? formatearFecha(retencion.FechaEmision) : formatearFecha(new Date()),
              "NumeroCompRetencion": null,
              "TotalBaseImponible": null, // Se calculará sumando todas las facturas
              "TotalIVA": null, // Se calculará sumando todas las facturas
              "TotalRetenido": null, // Se calculará sumando todas las facturas
              "TotalISRL": null, // Se calculará sumando todas las facturas
              "TipoComprobante": null
            }
          },
          "DetallesItems": null,
          "DetallesRetencion": [],
          "Viajes": null,
          "InfoAdicional": null,
          "GuiaDespacho": null
        }
      };


      // Agregar cada factura como DetalleRetencion IVA
      const ivaJson = structuredClone(baseJson);
      if (isIva) {
        let totalBaseImponible = 0;
        let totalIVA = 0;
        let totalRetenido = 0;
        facturas.forEach((factura, index) => {
          const baseImponible = parseFloat(factura.BaseImponible) || 0;
          const montoIVA = parseFloat(factura.MontoIVA) || 0;
          const retenido = parseFloat(factura.Retenido) || 0;

          // Calcular totales
          totalBaseImponible += baseImponible;
          totalIVA += montoIVA;
          totalRetenido += retenido;

          const detalleRetencion = {
            "NumeroLinea": (index + 1).toString(),
            "FechaDocumento": factura.FechaDocumento ? formatearFecha(factura.FechaDocumento) : formatearFecha(new Date()),
            "SerieDocumento": factura.SerieDocumento || "",
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

          ivaJson.DocumentoElectronico.DetallesRetencion.push(detalleRetencion);
        });
        ivaJson.DocumentoElectronico.Encabezado.IdentificacionDocumento.NumeroDocumento = retencion.NumeroDocumentoIva || "";
        ivaJson.DocumentoElectronico.Encabezado.IdentificacionDocumento.Serie = retencion.SerieIva || "";
        ivaJson.DocumentoElectronico.Encabezado.TotalesRetencion.NumeroCompRetencion = retencion.NumeroDocumentoIva || "";
        // Actualizar totales
        ivaJson.DocumentoElectronico.Encabezado.TotalesRetencion.TotalBaseImponible = totalBaseImponible.toFixed(2);
        ivaJson.DocumentoElectronico.Encabezado.TotalesRetencion.TotalIVA = totalIVA.toFixed(2);
        ivaJson.DocumentoElectronico.Encabezado.TotalesRetencion.TotalRetenido = totalRetenido.toFixed(2);
      }

      // Agregar cada factura como DetalleRetencion ISLR
      const islrJson = structuredClone(baseJson);
      if (isIslr) {
        let totalBaseImponible = 0;
        let totalISRL = 0;
        facturas.forEach((factura, index) => {
          const baseImponible = parseFloat(factura.BaseImponible) || 0;
          const montoISRL = parseFloat(factura.RetenidoISLR) || 0;

          // Calcular totales
          totalBaseImponible += baseImponible;
          totalISRL += montoISRL;

          const detalleRetencion = {
            "NumeroLinea": (index + 1).toString(),
            "FechaDocumento": factura.FechaDocumento ? formatearFecha(factura.FechaDocumento) : formatearFecha(new Date()),
            "SerieDocumento": factura.SerieDocumento || "",
            "TipoDocumento": "01",
            "NumeroDocumento": factura.NumeroDocumento || "",
            "NumeroControl": factura.NumeroControl || "",
            "MontoTotal": factura.MontoTotal || "",
            "BaseImponible": factura.BaseImponible || "",
            "Porcentaje": factura.PorcentajeISLR || "",
            "PorcentajeRetencion": factura.PorcentajeISLR || "",
            "Sustraendo": "1.00",
            "CodigoConcepto": factura.CodigoConcepto || "",
            "Retenido": factura.RetenidoISLR || "",
            "Moneda": "VES",
            "InfoAdicionalItem": [
              {
                "Campo": "prueba pdf",
                "Valor": "resutado prueba"
              }
            ]
          };

          islrJson.DocumentoElectronico.DetallesRetencion.push(detalleRetencion);
        });
        islrJson.DocumentoElectronico.Encabezado.IdentificacionDocumento.NumeroDocumento = retencion.NumeroDocumentoIslr || "";
        islrJson.DocumentoElectronico.Encabezado.IdentificacionDocumento.Serie = retencion.SerieIslr || "";
        islrJson.DocumentoElectronico.Encabezado.TotalesRetencion.NumeroCompRetencion = retencion.NumeroDocumentoIslr || "";
        // Actualizar totales
        islrJson.DocumentoElectronico.Encabezado.TotalesRetencion.TotalBaseImponible = totalBaseImponible.toFixed(2);
        islrJson.DocumentoElectronico.Encabezado.TotalesRetencion.TotalISRL = totalISRL.toFixed(2);
        islrJson.DocumentoElectronico.Encabezado.TotalesRetencion.TipoComprobante = "1";
      }

      // Crear ZIP usando JSZip
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();



      // Agregar el JSON al ZIP
      if (isIva) {
        // Crear archivo JSON
        ivaJson.DocumentoElectronico.Encabezado.IdentificacionDocumento.TipoDocumento = "05";
        const jsonContent = JSON.stringify(ivaJson, null, 2);
        const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
        zip.file('retencion_iva.json', jsonBlob);
      }
      if (isIslr) { // Crear archivo JSON
        islrJson.DocumentoElectronico.Encabezado.IdentificacionDocumento.TipoDocumento = "06";
        const jsonContent = JSON.stringify(islrJson, null, 2);
        const jsonBlob = new Blob([jsonContent], { type: 'application/json' });
        zip.file('retencion_islr.json', jsonBlob);
      }

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
      <h1 className="text-2xl font-bold">Retenciones</h1>
      <div className="flex items-end mb-2 border px-4 py-2 gap-10 rounded bg-gray-50">
        <InputWithLabel label="Fecha Emisión" type="date" value={retencion.FechaEmision} onChange={e => setRetencion({ ...retencion, FechaEmision: e.target.value })} ref={retencionRefs[2]} onEnterNext={() => proveedorRefs[0].current && proveedorRefs[0].current.focus()} />
        <div className={`flex flex-col px-4 pt-1 rounded-md border border-gray-300  ${isIva ? 'bg-gray-200' : ''}`}>
          <div className="flex gap-2">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">IVA</h2>
              <input type="checkbox" checked={isIva} onChange={() => setIsIva(!isIva)} className="rounded-full" />
            </div>
            <InputWithLabel label="Serie IVA" value={retencion.SerieIva} onChange={e => setRetencion({ ...retencion, SerieIva: e.target.value })} ref={retencionRefs[0]} onEnterNext={() => retencionRefs[1].current && retencionRefs[1].current.focus()} className="w-16" />
            <InputWithLabel label="Número Documento IVA" value={retencion.NumeroDocumentoIva} onChange={e => setRetencion({ ...retencion, NumeroDocumentoIva: e.target.value })} ref={retencionRefs[1]} onEnterNext={() => retencionRefs[2].current && retencionRefs[2].current.focus()} />
          </div>
        </div>
        <div className={`flex flex-col px-4 pt-1 rounded-md border border-gray-300  ${isIslr ? 'bg-gray-200' : ''}`}>
          <div className="flex gap-2">
            <div className="flex items-center gap-4">
              <h2 className="font-semibold">ISLR</h2>
              <input type="checkbox" checked={isIslr} onChange={() => setIsIslr(!isIslr)} className="rounded-full" />
            </div>
            <InputWithLabel label="Serie ISLR" value={retencion.SerieIslr} onChange={e => setRetencion({ ...retencion, SerieIslr: e.target.value })} ref={retencionRefs[0]} onEnterNext={() => retencionRefs[1].current && retencionRefs[1].current.focus()} className="w-16" />
            <InputWithLabel label="Número Documento ISLR" value={retencion.NumeroDocumentoIslr} onChange={e => setRetencion({ ...retencion, NumeroDocumentoIslr: e.target.value })} ref={retencionRefs[1]} onEnterNext={() => retencionRefs[2].current && retencionRefs[2].current.focus()} />
          </div>
        </div>
      </div>
      <div className="mb-2 border p-4 rounded bg-gray-50">
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
      <div className="mb-4 border p-4 rounded bg-gray-50">
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
              <th>% Ret IVA</th>
              <th>Monto Ret IVA</th>
              <th>Cod.</th>
              <th>% Ret ISLR</th>
              <th>Monto Ret ISLR</th>
              {/* <th>Ret IVA</th> */}
              {/* <th>Percibido</th> */}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura, idx) => {
              const textSize = "text-[13px]";
              const wFecha = "w-28";
              const wSerie = "w-10 text-center";
              const wNo = "w-[80px] text-center";
              const wMonto = "w-[92px] text-right";
              const wPorcentaje = "w-[66px] text-center";
              return (
                <tr key={idx} className="text-[11px]">
                  <td><InputWithLabel type="date" value={factura.FechaDocumento} onChange={e => { const f = [...facturas]; f[idx].FechaDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wFecha}`} /></td>
                  <td><InputWithLabel value={factura.SerieDocumento} onChange={e => { const f = [...facturas]; f[idx].SerieDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wSerie}`} /></td>
                  <td><InputWithLabel value={factura.NumeroDocumento} onChange={e => { const f = [...facturas]; f[idx].NumeroDocumento = e.target.value; setFacturas(f); }} className={`${textSize} ${wNo}`} /></td>
                  <td><InputWithLabel value={factura.NumeroControl} onChange={e => { const f = [...facturas]; f[idx].NumeroControl = e.target.value; setFacturas(f); }} className={`${textSize} ${wNo}`} /></td>
                  <td><InputWithLabel type="number" value={factura.MontoTotal} onChange={e => { const f = [...facturas]; f[idx].MontoTotal = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel type="number" value={factura.MontoExento} onChange={e => { const f = [...facturas]; f[idx].MontoExento = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel type="number" value={factura.BaseImponible} onChange={e => {
                    const f = [...facturas];
                    f[idx].BaseImponible = e.target.value;
                    setFacturas(f);
                    // Calcular montos automáticamente cuando cambia la base imponible
                    setTimeout(() => calcularMontos(f[idx], idx), 0);
                  }} className={`${textSize} ${wMonto}`} /></td>
                  <td><InputWithLabel value={factura.PorcentajeIVA} disabled={true} className={`${textSize} ${wPorcentaje} bg-gray-100 ${isIva ? "" : "text-gray-300 border-gray-300"}`} /></td>
                  <td><InputWithLabel value={factura.MontoIVA} disabled={true} className={`${textSize} ${wMonto} bg-gray-100 ${isIva ? "" : "text-gray-300 border-gray-300"}`} /></td>
                  <td><InputWithLabel type="number" value={factura.Porcentaje} disabled={!isIva} onChange={e => {
                    const f = [...facturas];
                    f[idx].Porcentaje = e.target.value;
                    setFacturas(f);
                    // Calcular montos automáticamente cuando cambia el porcentaje de retención
                    setTimeout(() => calcularMontos(f[idx], idx), 0);
                  }} className={`${textSize} ${wPorcentaje} ${isIva ? "" : "bg-gray-100 text-gray-300 border-gray-300"}`} /></td>
                  <td><InputWithLabel value={factura.Retenido} disabled={true} className={`${textSize} ${wMonto} bg-gray-100 ${isIva ? "" : "text-gray-300 border-gray-300"}`} /></td>
                  {/* <td><InputWithLabel value={factura.RetenidoIVA} onChange={e => { const f = [...facturas]; f[idx].RetenidoIVA = e.target.value; setFacturas(f); }} className={`${textSize} ${wPorcentaje}`} /></td> */}
                  {/* <td><InputWithLabel value={factura.Percibido} onChange={e => { const f = [...facturas]; f[idx].Percibido = e.target.value; setFacturas(f); }} className={`${textSize} ${wMonto}`} /></td> */}
                  <td><InputWithLabel value={factura.CodigoConcepto} disabled={!isIslr} onChange={e => { const f = [...facturas]; f[idx].CodigoConcepto = e.target.value; setFacturas(f); }} className={`${textSize} ${wSerie}  ${isIslr ? '' : 'bg-gray-100 text-gray-300 border-gray-300'}`} /></td>
                  <td><InputWithLabel type="number" value={factura.PorcentajeISLR} disabled={!isIslr} onChange={e => {
                    const f = [...facturas];
                    f[idx].PorcentajeISLR = e.target.value;
                    setFacturas(f);
                    // Calcular montos automáticamente cuando cambia el porcentaje de retención
                    setTimeout(() => calcularMontos(f[idx], idx), 0);
                  }} className={`${textSize} ${wPorcentaje} ${isIslr ? '' : 'bg-gray-100 text-gray-300 border-gray-300'}`} /></td>
                  <td><InputWithLabel value={factura.RetenidoISLR} disabled={true} className={`${textSize} ${wMonto} bg-gray-100 ${isIslr ? "" : "text-gray-300 border-gray-300"}`} /></td>
                  <td className="w-full h-8 flex justify-center items-center"><IconDelete className="w-4 h-4 text-gray-700 cursor-pointer hover:text-gray-800" onClick={() => { const f = [...facturas]; f.splice(idx, 1); setFacturas(f); }} /></td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setFacturas([
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
              Percibido: "",
              PorcentajeISLR: "",
              RetenidoISLR: "",
              CodigoConcepto: ""
            }
          ])}>Agregar Factura</button>
          <button className={`w-60 px-4 py-2 text-white rounded ${isIva || isIslr ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`} onClick={() => generarZip({ isIva, isIslr })}>
            Generar .zip con {isIva ? "IVA" : ""} {isIva && isIslr ? "y" : ""} {isIslr ? "ISLR" : ""}
          </button>
        </div>
      </div>
    </div>
  );
} 
import { apiBodas, apiJaihom } from "../api";

const types = {
  json: "",
  formData: "",
};

interface conector {
  api?: any
  query: string;
  variables: object;
  type: keyof typeof types;
}
export const fetchApiBodas: CallableFunction = async ({ query, type, variables }: conector): Promise<any> => {
  return await conector({ api: apiBodas, query, variables, type })
}

export const fetchApiJaihom: CallableFunction = async ({ query, type, variables }: conector): Promise<any> => {
  return await conector({ api: apiJaihom, query, variables, type })
}

const conector: CallableFunction = async ({ api, query = ``, variables = {}, type = "json", }: conector): Promise<any> => {
  try {
    if (type === "json") {
      const {
        data: { data },
      } = await api.graphql({ query, variables });
      return Object.values(data)[0];
    } else if (type === "formData") {
      const formData = new FormData();
      const values = Object?.entries(variables);

      // Generar el map del Form Data para las imagenes
      const map = values?.reduce((acc: any, item: any) => {
        if (item[1] instanceof File) {
          acc[item[0]] = [`variables.${item[0]}`];
        }
        if (item[1] instanceof Object) {
          Object.entries(item[1]).forEach((el) => {
            if (el[1] instanceof File) {
              acc[el[0]] = [`variables.${item[0]}.${el[0]}`];
            }
            if (el[1] instanceof Object) {
              Object.entries(el[1]).forEach((elemento) => {
                if (elemento[1] instanceof File) {
                  acc[elemento[0]] = [
                    `variables.${item[0]}.${el[0]}.${elemento[0]}`,
                  ];
                }
              });
            }
          });
        }
        return acc;
      }, {});

      // Agregar filas al FORM DATA

      formData.append("operations", JSON.stringify({ query, variables }));
      formData.append("map", JSON.stringify(map));
      values.forEach((item) => {
        if (item[1] instanceof File) {
          formData.append(item[0], item[1]);
        }
        if (item[1] instanceof Object) {
          Object.entries(item[1]).forEach((el) => {
            if (el[1] instanceof File) {
              formData.append(el[0], el[1]);
            }
            if (el[1] instanceof Object) {
              Object.entries(el[1]).forEach((elemento) => {
                if (elemento[1] instanceof File) {
                  formData.append(elemento[0], elemento[1]);
                }
              });
            }
          });
        }
      });

      const { data } = await api.graphql(formData);

      if (data.errors) {
        throw new Error(JSON.stringify(data.errors));
      }

      return Object.values(data.data)[0];
    }
  } catch (error) {
    console.log(error);
  }
};

type queries = {
  fileUpload: string
  getUploadFiles: string
  createTasaBCV: String
  getTasaBCV: String
  deleteTasaBCV: String
  getLog: string
  resyncOnus: string
  getFacturas: string
  getTransacciones: string
  uploadBanco: String
  runConciliation: String
  getFacturaWispHup: String
  refreshFacturaWispHup: string
};

export const queries: queries = {
  refreshFacturaWispHup: `mutation($ids_factura:[String] ){
    refreshFacturaWispHup(ids_factura:$ids_factura)
  }`,
  getFacturaWispHup: `query($id_factura:String ){
    getFacturaWispHup(id_factura:$id_factura)
  }`,
  getTransacciones: `query($args:inputTransaccion,  $sort:sortCriteriaTransaccion, $skip:Int, $limit:Int ){
    getTransacciones(args:$args, sort:$sort, skip:$skip, limit:$limit){
      total
      results{
        _id
        referencia
        banco
        monto
        facturas{
          id_factura
          total_cobrado
          fecha_pago
          fecha_pago_ref
          referencia
          forma_pago
          cajero
        }
        conciliado
        criterio
        fecha
        createdAt
        updatedAt
      }
    }
  }`,
  getFacturas: `query($args:inputFactura,  $sort:sortCriteriaFactura, $skip:Int, $limit:Int ){
    getFacturas(args:$args, sort:$sort, skip:$skip, limit:$limit){
      total
      results{
        _id
        id_factura
        fecha_pago
        scanedFacturas
        scanedFacturasTotal
        fecha_pago_ref
        total_cobrado
        referencia
        forma_pagoID
        forma_pago
        cajeroID
        cajero
        pagado
        recargado
        criterio
        transacciones{
          _id
          banco
          fecha
          referencia
          descripcion
          monto
          conciliado
          criterio
          facturas{
            _id
            id_factura
          }
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }`,
  fileUpload: `mutation($file:Upload!, $args:String)
  {
    fileUpload(file:$file, args:$args){
      _id
      lote
      path
      createdAt
    }
  }`,
  runConciliation: `mutation
  {
    runConciliation
  }`,
  uploadBanco: `mutation($file:Upload!, $banco:String!)
  {
    uploadBanco(file:$file, banco:$banco)
  }`,
  getUploadFiles: `query ( $skip: Int, $limit: Int )
  {
    getUploadFiles(skip:$skip, limit:$limit, ){
      total
      results{
        _id
        lote
        path
        createdAt
      }
    }
  }`,
  createTasaBCV: `mutation($fecha:Date, $tasa:Float)
  {
    createTasaBCV(fecha:$fecha, tasa:$tasa){
      _id
      tasa
      fecha
      createdAt
    }
  }`,
  getTasaBCV: `query ($sort:sortCriteriaTasaBCV, $skip:Int, $limit:Int )
  {
    getTasaBCV(skip:$skip, limit:$limit, sort:$sort ){
      total
      results{
        _id
        tasa
        fecha
        createdAt
      }
    }
  }`,
  deleteTasaBCV: `mutation ($_id:ID )
  {
    deleteTasaBCV(_id:$_id)
  }`,
  getLog: `query ( $skip:Int, $limit:Int, $time:Date )
  {
    getLog( skip:$skip, limit:$limit, time:$time ){
      total
      results{
        sn_onu
        id_servicio
        estado
        estadoValir
        usuario
        smartOlt
        confirmation
        createdAt
      }
    }
  }`,
  resyncOnus: `mutation ( $args:[String] )
  {
    resyncOnus( args:$args )
  }`,
};



export const getDate = (date: Date): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d).replace(/\//g, '-')
}

export const getDateTime = (date: Date): string => {
  const d = new Date(date)
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    //second: "numeric",
    hour12: false,
    //timeZone: "America/Los_Angeles",
  }).format(d).replace(/\//g, '-')
}

export function obtenerPrimerYUltimoDiaSemana() {
  const dI = new Date()
  const d = new Date(dI.getFullYear(), dI.getMonth(), dI.getDate(), 0, 0, 0);
  const dF = new Date(dI.getFullYear(), dI.getMonth(), dI.getDate(), 23, 59, 59);
  const day = d.getDay()
  const dateEpoch = Math.trunc(d.getTime())
  const primero = day === 1 ? d : day > 1 ? new Date((dateEpoch - (day - 1) * 86400000)) : new Date((dateEpoch - 6 * 86400000))
  const ultimo = day === 0 ? dF : new Date((dateEpoch + (7 - day) * 86400000) + 86399000)
  return { primero, ultimo }
}
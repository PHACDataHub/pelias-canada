import { read, utils, WorkBook } from 'xlsx'

const signal = (evt: ParseEventLoadingState | ParseEventDoneState) =>
  postMessage({ type: 'ParseEvent', ...evt } as ParseEvent)

export const parse = async (file: File) => {
  const fileData = await file.arrayBuffer()
  signal({ state: 'LOADING' })
  const workbook = read(fileData)
  const sheets: { sheetName: string; data: any }[] = []
  workbook.SheetNames.forEach((sheetName) => {
    sheets.push({
      sheetName,
      data: utils.sheet_to_json(workbook.Sheets[sheetName], { header: 'A' }),
    })
  })
  if (workbook.SheetNames.length > 0) {
    signal({ state: 'DONE', workbook, sheets })
    // const payload_str = JSON.stringify(payload)
  } else postMessage('ERROR!')
}

export type SheetData = { sheetName: string; data: any };

interface ParseEventLoadingState {
  state: 'LOADING'
}

interface ParseEventDoneState {
  state: 'DONE'
  workbook: WorkBook
  sheets: SheetData[]
}

export type ParseEvent = { type: 'ParseEvent' } & (
  | ParseEventLoadingState
  | ParseEventDoneState
)
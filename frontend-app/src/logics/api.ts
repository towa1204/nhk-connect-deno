import {
  Config,
  SetNHKAPIRequest,
  SetNotificationRequest,
  SetProgramRequest
} from 'domain/schema'

const APIKEY = import.meta.env.VITE_APIKEY
let APIURL = import.meta.env.VITE_APIURL
if (import.meta.env.PROD) {
  APIURL = location.origin
}

// GET /api/config/all
export async function loadConfing() {
  const res = await fetch(`${APIURL}/api/config/all?key=${APIKEY}`)
  if (!res.ok) {
    throw new Error(await res.json())
  }
  const json = (await res.json()) as Config
  console.log(json)
  return json
}

// POST /api/config/nhkapi
export async function postPrograms(
  programs: {
    title: string
    keyword: string
  }[]
) {
  const bodyJson: SetProgramRequest = {
    programs: programs
  }

  // 送信(押下時、Loading表示しdisableにする)
  const res = await fetch(`${APIURL}/api/config/programs?key=${APIKEY}`, {
    method: 'POST',
    body: JSON.stringify(bodyJson)
  })
  if (!res.ok) {
    throw new Error(await res.json())
  }
}

// POST /api/config/nhkapi
export async function postNHKAPI(area: string, nhkAPIKey: string) {
  const bodyJson: SetNHKAPIRequest = {
    area: area,
    services: ['g1', 'e1'],
    nhkAPIKey: nhkAPIKey
  }

  // 送信(押下時、Loading表示しdisableにする)
  const res = await fetch(`${APIURL}/api/config/nhkapi?key=${APIKEY}`, {
    method: 'POST',
    body: JSON.stringify(bodyJson)
  })
  if (!res.ok) {
    throw new Error(await res.json())
  }
}

// POST /api/config/nhkapi
export async function postNotification(
  selectNow: string,
  lineUserID: string,
  lineAccessToken: string
) {
  const bodyJson: SetNotificationRequest = {
    selectNow: selectNow,
    LINEAPI: {
      userID: lineUserID,
      accessToken: lineAccessToken
    }
  }

  // 送信(押下時、Loading表示しdisableにする)
  const res = await fetch(`${APIURL}/api/config/notification?key=${APIKEY}`, {
    method: 'POST',
    body: JSON.stringify(bodyJson)
  })
  if (!res.ok) {
    throw new Error(await res.json())
  }
}

import { NextApiRequest, NextApiResponse } from "next"

export default function coverage(
  { body, query: { zone, endpoint } }: NextApiRequest,
  res: NextApiResponse,
) {
  if (!process.env.FAKE_CLOUDFLARE_DOMAIN) {
    return res.status(404).send("")
  }

  console.log(
    `Called cloudflare api with zone: ${zone} and endpoint: ${endpoint} body: ${JSON.stringify(
      body,
    )}`,
  )

  res.status(200).send("")
}

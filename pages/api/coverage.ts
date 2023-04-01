import { NextApiRequest, NextApiResponse } from "next"

export default function coverage(_req: NextApiRequest, res: NextApiResponse) {
  process.env.APP_ENV === "test"
    ? res.status(200).json(global.__coverage__)
    : res.status(404).send("Not found")
}

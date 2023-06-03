import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse ) {
    res.status( 200 ).json({
        ApiVersion: '1.0.0',
        Owner: 'SinLess Games LLC',
        description: 'Authentication routes',
        disclaimer: "For Official use only."
    })
}
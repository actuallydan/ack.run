import type { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

export default async (req: NextRequest) => {
  return new Response(
    JSON.stringify({
      data: "👍",
    }),
    {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept, Authorization",
      },
    }
  );
};

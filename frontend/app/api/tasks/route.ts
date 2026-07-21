import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

import { api } from "../api";

export async function GET(request: NextRequest) {
  try {
    const res = await api("/tasks", { params: request.nextUrl.searchParams });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const status = error.response?.status || 503;
      const message =
        error.response?.data?.error || "Backend server is unreachable";
      return NextResponse.json(
        { error: message, code: "BACKEND_ERROR" },
        { status },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error", code: "UNKNOWN_ERROR" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await api.post("/tasks", body);
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      
      const backendMessage = error.response?.data?.message || "Failed to create task";
      const status = error.response?.status || 500;

      return NextResponse.json(
        { error: backendMessage },
        { status }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

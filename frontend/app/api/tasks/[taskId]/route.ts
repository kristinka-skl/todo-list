import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { api } from "../../api"; 

type Props = {
  params: Promise<{ taskId: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  try {
    const { taskId } = await params;
    const body = await request.json();

    const res = await api.patch(`/tasks/${taskId}`, body);
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const backendMessage = error.response?.data?.message || "Failed to update task";
      const status = error.response?.status || 500;

      return NextResponse.json({ error: backendMessage }, { status });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Props) {
  try {
    const { taskId } = await params;

    const res = await api.delete(`/tasks/${taskId}`);
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      const backendMessage = error.response?.data?.message || "Failed to delete task";
      const status = error.response?.status || 500;

      return NextResponse.json({ error: backendMessage }, { status });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
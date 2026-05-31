import { isAxiosError } from "axios";
import { NextResponse } from "next/server";
import { api } from "../../api";

type Props = {
  params: Promise<{ taskId: string }>;
};

export async function PATCH(request: Request, { params }: Props) {
  const { taskId } = await params;
  const body = await request.json();

  try {
    const res = await api.patch(`/tasks/${taskId}`, body);
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: Props) {
  const { taskId } = await params;

  try {
    const res = await api.delete(`/tasks/${taskId}`);
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

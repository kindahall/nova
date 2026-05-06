import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { defaultNovaSystemState, mergeNovaSystemState } from "@/lib/nova-system";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const runtimeDirectory = path.join(process.cwd(), ".nova-runtime");
const stateFile = path.join(runtimeDirectory, "system-state.json");

async function readRuntimeState() {
  try {
    const raw = await readFile(stateFile, "utf8");
    return {
      source: "runtime" as const,
      state: mergeNovaSystemState(JSON.parse(raw)),
    };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return {
        source: "default" as const,
        state: defaultNovaSystemState,
      };
    }

    throw error;
  }
}

async function writeRuntimeState(value: unknown) {
  const state = mergeNovaSystemState(value);
  await mkdir(runtimeDirectory, { recursive: true });
  await writeFile(stateFile, JSON.stringify(state, null, 2), "utf8");
  return state;
}

export async function GET() {
  const payload = await readRuntimeState();
  return NextResponse.json(payload);
}

export async function PATCH(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { state?: unknown };
  const current = await readRuntimeState();
  const state = await writeRuntimeState({
    ...current.state,
    ...(body.state ?? {}),
  });

  return NextResponse.json({ source: "runtime", state });
}

export async function DELETE() {
  const state = await writeRuntimeState(defaultNovaSystemState);
  return NextResponse.json({ source: "runtime", state });
}

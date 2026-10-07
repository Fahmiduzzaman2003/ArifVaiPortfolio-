import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ ok: false, message, ...(details ? { details } : {}) }, { status });
}

export function handleRouteError(error: unknown) {
  console.error(error);
  if (error instanceof ZodError) {
    return fail("Please correct the highlighted values.", 422, error.flatten());
  }
  if (error instanceof mongoose.Error.ValidationError) {
    const fieldErrors = Object.fromEntries(Object.entries(error.errors).map(([key, value]) => [key, [value.message]]));
    return fail("Some values are not valid.", 422, { fieldErrors, formErrors: [] });
  }
  if (error instanceof mongoose.Error.CastError) {
    return fail(`Invalid ${error.path}.`, 400);
  }
  if (error instanceof MongoServerError && error.code === 11000) {
    const field = Object.keys((error.keyPattern ?? error.keyValue ?? {}) as Record<string, unknown>)[0] ?? "value";
    return fail(`That ${field} is already in use. Please choose another.`, 409, { field });
  }
  if (error instanceof SyntaxError) return fail("The request body is not valid JSON.", 400);
  return fail("The request could not be completed. Please try again.", 500);
}

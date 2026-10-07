import { Suspense } from "react";
import { AuthPage } from "@/components/admin/auth-page";
export default function ResetPage() { return <Suspense><AuthPage mode="reset" title="Choose a new password." description="This single-use link expires after thirty minutes and invalidates all existing sessions." /></Suspense>; }

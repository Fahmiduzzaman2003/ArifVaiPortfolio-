import { SingletonForm } from "@/components/admin/singleton-form";

export default function SettingsAdminPage() {
  return <SingletonForm
    kind="settings"
    title="General site settings"
    description="Control the public title, footer language, and CV visibility."
    fields={[
      { name: "siteTitle", label: "Site title" },
      { name: "footer.statement", label: "Footer statement", multiline: true },
      { name: "cvVisible", label: "Show CV publicly", type: "checkbox" },
    ]}
  />;
}

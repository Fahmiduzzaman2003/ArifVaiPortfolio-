import { CloudinaryUploader } from "@/components/admin/cloudinary-uploader";
import { ContentManager } from "@/components/admin/content-manager";
import { adminModules } from "@/config/admin-modules";
export default function MediaAdminPage() { return <><CloudinaryUploader /><ContentManager module={adminModules.media} /></>; }

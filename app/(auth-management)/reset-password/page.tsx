import AuthPage from "@/components/auth-page";
import { AuthMode } from "@/enums/auth.enum";

export default function ResetPasswordPage() {
  return <AuthPage authMode={AuthMode.RESET_PASSWORD} />;
}

import AuthPage from "@/components/auth-page";
import { AuthMode } from "@/enums/auth.enum";

export default function SignInPage() {
  return <AuthPage authMode={AuthMode.SIGN_IN} />;
}

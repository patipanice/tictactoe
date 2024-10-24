import AuthPage from "@/components/auth-page";
import { AuthMode } from "@/enums/auth.enum";


export default function SignUpPage() {
  return <AuthPage authMode={AuthMode.SIGN_UP} />;
}

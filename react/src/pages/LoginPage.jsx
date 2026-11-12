import LoginForm from "@/features/auth/components/LoginForm";

// পেজ পাতলা: শুধু কাঠামো সাজায়, আসল logic features/ ফোল্ডারের component-এ
function LoginPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Sign in</h1>
        <p className="text-sm text-content-muted">
          Enter your username and password to continue.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}

export default LoginPage;
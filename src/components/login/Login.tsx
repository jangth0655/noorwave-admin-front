import LoginInput from "./LoginInput";

export default function Login() {
  return (
    <section className="h-screen flex justify-center items-center text-slate-700">
      <div className="w-[512px]">
        <h1 className="text-4xl font-bold mb-10 text-center">Noorwave Admin</h1>

        <form action="" className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <LoginInput labelText="Email" htmlFor="email" />
            <LoginInput
              labelText="Password"
              type="password"
              htmlFor="password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 flex justify-center items-center bg-slate-600 text-white text-xl rounded-xl active:bg-slate-800 transition-all active:scale-95"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
}

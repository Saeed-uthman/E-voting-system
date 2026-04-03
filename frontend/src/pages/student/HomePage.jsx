export default function HomePage() {
  return (
    <section className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
      <div className="bg-gradient-to-r from-blue-700 to-brand-900 px-6 py-8 text-white">
        <h2 className="text-2xl font-bold md:text-3xl">Northwest University Kano Student Election Portal</h2>
        <p className="mt-2 max-w-3xl text-sm text-blue-100 md:text-base">
          Welcome to the secure e-voting platform. Students can quickly verify identity, cast votes, and receive instant confirmation.
        </p>
      </div>
      <div className="grid gap-4 px-6 py-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900">1. Verify</h3>
          <p className="mt-1 text-sm text-slate-600">Login with your registration number and password.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900">2. Vote</h3>
          <p className="mt-1 text-sm text-slate-600">Select candidates by position using a simple ballot layout.</p>
        </div>
        <div className="rounded-xl border border-slate-200 p-4">
          <h3 className="font-semibold text-slate-900">3. Confirm</h3>
          <p className="mt-1 text-sm text-slate-600">Receive immediate confirmation after successful submission.</p>
        </div>
      </div>
    </section>
  )
}

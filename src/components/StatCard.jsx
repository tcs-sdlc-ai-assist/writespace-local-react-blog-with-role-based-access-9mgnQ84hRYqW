export default function StatCard({ label, count, icon, color }) {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    violet: 'bg-violet-100 text-violet-600',
    blue: 'bg-blue-100 text-blue-600',
    gray: 'bg-gray-100 text-gray-600',
  }

  const badgeClass = colorClasses[color] || colorClasses.indigo

  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex items-center space-x-4">
      {icon && (
        <div
          className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-xl ${badgeClass}`}
        >
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  )
}
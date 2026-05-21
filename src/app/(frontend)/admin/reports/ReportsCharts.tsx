'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type UnitDatum = { unit: string; completionRate: number }
type CourseDatum = { course: string; passRate: number }

const NAVY = '#1a3a66'
const GOLD = '#c9a961'

export const ReportsCharts = ({
  byUnit,
  byCourse,
}: {
  byUnit: UnitDatum[]
  byCourse: CourseDatum[]
}) => {
  return (
    <div className="grid-2 stack-3">
      <div className="card">
        <p className="t-eyebrow">By unit</p>
        <h2 className="t-h3 mt-2 mb-3">Completion rate</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={byUnit}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde1ea" />
              <XAxis dataKey="unit" tick={{ fontSize: 12, fill: '#4a5566' }} />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: '#4a5566' }}
              />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Bar dataKey="completionRate" name="Completion rate" fill={NAVY} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <p className="t-eyebrow">By quiz</p>
        <h2 className="t-h3 mt-2 mb-3">Pass rate</h2>
        <div className="h-72">
          <ResponsiveContainer>
            <BarChart data={byCourse}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dde1ea" />
              <XAxis dataKey="course" tick={{ fontSize: 10, fill: '#4a5566' }} />
              <YAxis
                domain={[0, 100]}
                tickFormatter={(v) => `${v}%`}
                tick={{ fontSize: 12, fill: '#4a5566' }}
              />
              <Tooltip formatter={(v) => `${v}%`} />
              <Legend />
              <Bar dataKey="passRate" name="Pass rate" fill={GOLD} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

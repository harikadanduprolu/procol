// frontend/src/components/ActiveDaysComponent.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Star, Flame, BarChart3 } from "lucide-react";

interface ActivityDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

const ActiveDaysComponent = () => {
  // Generate mock activity data for the last 365 days
  const generateActivityData = (): ActivityDay[] => {
    const data: ActivityDay[] = [];
    const today = new Date();

    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);

      // Random activity level (0-4)
      const count = Math.floor(Math.random() * 15);
      const level =
        count === 0 ? 0 :
        count <= 2 ? 1 :
        count <= 5 ? 2 :
        count <= 9 ? 3 : 4;

      data.push({
        date: date.toISOString().split('T')[0],
        count,
        level: level as 0 | 1 | 2 | 3 | 4
      });
    }
    return data;
  };

  const activityData = generateActivityData();

  // Calculate streaks and total contributions
  const totalContributions = activityData.reduce((sum, day) => sum + day.count, 0);
  const currentStreak = activityData.slice().reverse().findIndex(day => day.count === 0);
  const maxStreak = 47; // Mock max streak

  // --- Highlights
  const mostActiveDay = activityData.reduce((max, day) => day.count > max.count ? day : max, activityData[0]);
  const firstActiveDay = activityData.find(day => day.count > 0);

  // --- Recent Activity
  const recentActivity = activityData
    .slice(-7) // last 7 days
    .reverse();

  // --- Activity Graph Data (last 30 days)
  const last30 = activityData.slice(-30);
  const maxCount = Math.max(...last30.map(d => d.count), 1);

  // Get level colors
  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return 'bg-muted';
      case 1: return 'bg-neon-purple/20';
      case 2: return 'bg-neon-purple/40';
      case 3: return 'bg-neon-purple/60';
      case 4: return 'bg-neon-purple/80';
      default: return 'bg-muted';
    }
  };

  // Group by weeks
  const weeks: ActivityDay[][] = [];
  const reversedData = [...activityData].reverse();

  for (let i = 0; i < reversedData.length; i += 7) {
    weeks.push(reversedData.slice(i, i + 7));
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  // Helper to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-neon-purple" />
          Activity Overview
        </CardTitle>
        <CardDescription>Your collaboration activity over the past year</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-purple">{totalContributions}</div>
            <div className="text-xs text-muted-foreground">Total contributions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-blue">{currentStreak === -1 ? activityData.length : currentStreak}</div>
            <div className="text-xs text-muted-foreground">Current streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-neon-pink">{maxStreak}</div>
            <div className="text-xs text-muted-foreground">Longest streak</div>
          </div>
        </div>

        {/* Month labels */}
        <div className="flex gap-1 mb-2 text-xs text-muted-foreground">
          {months.map((month, index) => (
            <div key={month} className="w-11 text-center">
              {index % 3 === 0 ? month : ''}
            </div>
          ))}
        </div>

        {/* Activity grid */}
        <div className="flex gap-1 overflow-x-auto">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {Array.from({ length: 7 }).map((_, dayIndex) => {
                const day = week[dayIndex];
                return (
                  <div
                    key={dayIndex}
                    className={`w-3 h-3 rounded-sm ${day ? getLevelColor(day.level) : 'bg-muted'}`}
                    title={day ? `${day.date}: ${day.count} contributions` : ''}
                  />
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-3 h-3 rounded-sm ${getLevelColor(level)}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>

        {/* --- Activity Graph --- */}
        <div className="mt-8">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-neon-blue" />
            Contribution Graph (Last 30 Days)
          </div>
          <div className="w-full overflow-x-auto">
            <svg width={last30.length * 10} height={60} style={{ display: "block" }}>
              {last30.map((day, i) => (
                <rect
                  key={day.date}
                  x={i * 10}
                  y={60 - (day.count / maxCount) * 50}
                  width={8}
                  height={(day.count / maxCount) * 50}
                  fill="#a78bfa" // neon-purple-400
                  rx={2}
                >
                  <title>{`${formatDate(day.date)}: ${day.count} contributions`}</title>
                </rect>
              ))}
            </svg>
            <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
              <span>{formatDate(last30[0].date)}</span>
              <span>{formatDate(last30[last30.length - 1].date)}</span>
            </div>
          </div>
        </div>

        {/* --- Recent Activity --- */}
        <div className="mt-6">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Flame className="h-4 w-4 text-orange-500" />
            Recent Activity
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            {recentActivity.map((day, idx) => (
              <li key={idx} className="flex justify-between">
                <span>{formatDate(day.date)}</span>
                <span className="font-medium text-foreground">{day.count} contributions</span>
              </li>
            ))}
          </ul>
        </div>

        {/* --- Highlights --- */}
        <div className="mt-6">
          <div className="font-semibold mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-400" />
            Highlights
          </div>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>
              <span className="font-medium text-foreground">Most active day:</span>{" "}
              {formatDate(mostActiveDay.date)} ({mostActiveDay.count} contributions)
            </li>
            {firstActiveDay && (
              <li>
                <span className="font-medium text-foreground">First activity:</span>{" "}
                {formatDate(firstActiveDay.date)} ({firstActiveDay.count} contributions)
              </li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveDaysComponent;
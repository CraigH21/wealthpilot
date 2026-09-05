import GoalCards, { type GoalCardData } from "../../components/goals/GoalCards";
import GoalInsights from "../../components/goals/GoalInsights";
import GoalPlanner from "../../components/goals/GoalPlanner";
import GoalTimeline from "../../components/goals/GoalTimeline";
import GoalsHero from "../../components/goals/GoalsHero";
import MonthlyContributions from "../../components/goals/MonthlyContributions";
import { planGoal } from "../../lib/goals/planning";
import { getGoalsValueHistory, getPortfolioContext } from "../../lib/mock/portfolioContext";

export default function GoalsPage() {
  const context = getPortfolioContext();
  const goals = context.goals;
  const history = getGoalsValueHistory();

  const goalCards: GoalCardData[] = goals
    .map((goal) => ({ ...goal, ...planGoal(goal) }))
    .sort((a, b) => a.monthsUntilDeadline - b.monthsUntilDeadline);

  const timelineGoals = [...goalCards].sort(
    (a, b) => a.monthsAtCurrentPace - b.monthsAtCurrentPace
  );

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const savedThisMonth = goals.reduce((sum, g) => sum + g.monthlyContribution, 0);
  const onTrackCount = goalCards.filter((g) => g.status !== "Slightly behind").length;
  const completionPct = Math.round(
    goalCards.reduce((sum, g) => sum + g.progressPct, 0) / (goalCards.length || 1)
  );

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">Goals</h1>
          <p className="mt-1.5 text-sm text-zinc-600">Your goals, your plan, your bigger future.</p>
        </div>
      </div>

      <GoalsHero
        completionPct={completionPct}
        totalSaved={totalSaved}
        totalTarget={totalTarget}
        savedThisMonth={savedThisMonth}
        onTrackCount={onTrackCount}
        goalCount={goals.length}
        history={history}
      />

      <GoalCards goals={goalCards} />

      <GoalTimeline
        goals={timelineGoals.map((g) => ({ id: g.id, name: g.name, estimatedCompletion: g.estimatedCompletion }))}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <MonthlyContributions goals={goals} />
        <GoalInsights goals={goals} />
      </div>

      <GoalPlanner initialGoals={goals} />
    </div>
  );
}

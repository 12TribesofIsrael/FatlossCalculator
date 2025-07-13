import React, { useState } from 'react';
import { Calculator, Info, Target, TrendingDown, Flame, Crown } from 'lucide-react';

interface CalculatorInputs {
  age: number;
  gender: 'male' | 'female';
  weight: number;
  heightFeet: number;
  heightInches: number;
  dailyCalories: number;
  activityLevel: string;
  weightLossGoal: number;
  timeframe: number;
  weeklyLossGoal?: number;
  calculationMethod: 'timeframe' | 'weekly';
}

interface Results {
  tdee: number;
  dailyDeficit: number;
  targetDailyDeficit: number;
  exerciseCalories: number;
  walkingMiles: number;
  runningMiles: number;
  projectedWeeklyLoss: number;
  timeToGoal: number;
  caloriesPerMileWalking: number;
  caloriesPerMileRunning: number;
}

function App() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    age: 30,
    gender: 'male',
    weight: 180,
    heightFeet: 5,
    heightInches: 10,
    dailyCalories: 2000,
    activityLevel: '1.55', // Moderately Active
    weightLossGoal: 20,
    timeframe: 12,
    weeklyLossGoal: 2,
    calculationMethod: 'timeframe'
  });

  const [results, setResults] = useState<Results | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const activityLevels = [
    { value: '1.2', label: 'Sedentary (desk job, no exercise)' },
    { value: '1.375', label: 'Lightly Active (1–2x/week)' },
    { value: '1.55', label: 'Moderately Active (3–4x/week)' },
    { value: '1.725', label: 'Very Active (5–6x/week)' },
    { value: '1.9', label: 'Extremely Active (2-a-day workouts)' }
  ];

  const calculateResults = () => {
    // Convert height to inches
    const totalHeightInches = (inputs.heightFeet * 12) + inputs.heightInches;
    
    // Calculate BMR using Harris-Benedict equation
    let bmr: number;
    if (inputs.gender === 'male') {
      bmr = 66 + (6.23 * inputs.weight) + (12.7 * totalHeightInches) - (6.8 * inputs.age);
    } else {
      bmr = 655 + (4.35 * inputs.weight) + (4.7 * totalHeightInches) - (4.7 * inputs.age);
    }

    // Calculate TDEE
    const tdee = bmr * parseFloat(inputs.activityLevel);

    // Calculate current daily deficit
    const dailyDeficit = tdee - inputs.dailyCalories;

    // Calculate target daily deficit needed for goal
    // 1 pound of fat = 3500 calories
    let targetDailyDeficit: number;
    let calculatedTimeframe: number;
    
    if (inputs.calculationMethod === 'weekly') {
      // Calculate based on weekly loss goal
      const weeklyLoss = inputs.weeklyLossGoal || 2;
      targetDailyDeficit = (weeklyLoss * 3500) / 7;
      calculatedTimeframe = inputs.weightLossGoal / weeklyLoss;
    } else {
      // Calculate based on timeframe
      targetDailyDeficit = (inputs.weightLossGoal * 3500) / (inputs.timeframe * 7);
      calculatedTimeframe = inputs.timeframe;
    }

    // Calculate exercise calories needed
    // Calculate additional exercise calories needed beyond current diet deficit
    const exerciseCalories = Math.max(0, targetDailyDeficit - Math.max(0, dailyDeficit));

    // Calculate calories burned per mile
    const caloriesPerMileWalking = inputs.weight * 0.57;
    const caloriesPerMileRunning = inputs.weight * 0.75;

    // Calculate miles needed
    const walkingMiles = exerciseCalories / caloriesPerMileWalking;
    const runningMiles = exerciseCalories / caloriesPerMileRunning;

    // Calculate projected weekly loss
    // Total daily deficit combines current diet deficit plus additional exercise
    const currentDietDeficit = Math.max(0, dailyDeficit);
    const totalDailyDeficit = currentDietDeficit + exerciseCalories;
    const projectedWeeklyLoss = totalDailyDeficit * 7 / 3500;

    // Calculate time to reach goal
    const timeToGoal = inputs.calculationMethod === 'weekly' 
      ? calculatedTimeframe 
      : (projectedWeeklyLoss > 0 ? inputs.weightLossGoal / projectedWeeklyLoss : 0);

    setResults({
      tdee: Math.round(tdee),
      dailyDeficit: Math.round(dailyDeficit),
      targetDailyDeficit: Math.round(targetDailyDeficit),
      exerciseCalories: Math.round(exerciseCalories),
      walkingMiles: parseFloat(walkingMiles.toFixed(1)),
      runningMiles: parseFloat(runningMiles.toFixed(1)),
      projectedWeeklyLoss: parseFloat(projectedWeeklyLoss.toFixed(1)),
      timeToGoal: parseFloat(timeToGoal.toFixed(1)),
      caloriesPerMileWalking: Math.round(caloriesPerMileWalking),
      caloriesPerMileRunning: Math.round(caloriesPerMileRunning),
    });
  };

  const updateInput = (field: keyof CalculatorInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const isExtremeDeficit = results && results.targetDailyDeficit > 2000;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-900">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black py-4 px-4 text-center shadow-lg">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <img 
            src="/BMB AI Automations Logo.png" 
            alt="BMB AI Automations" 
            className="w-8 h-8"
          />
          <Crown className="w-6 h-6" />
          <Flame className="w-6 h-6" />
          <Crown className="w-6 h-6" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">🔥 Born Made Bosses Fat Loss Calculator</h1>
        <p className="text-lg font-semibold mt-2">Discipline {'>'} Excuses. Let's break cycles and burn fat daily.</p>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid lg:grid-cols-2 gap-8 justify-center">
          {/* Input Section */}
          <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-yellow-500 w-full max-w-2xl mx-auto lg:mx-0">
            <div className="flex items-center space-x-2 mb-6">
              <Calculator className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Your Information</h2>
            </div>

            <div className="space-y-4">
              {/* Age & Gender */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    value={inputs.age}
                    onChange={(e) => updateInput('age', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                  <select
                    value={inputs.gender}
                    onChange={(e) => updateInput('gender', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>

              {/* Weight */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Current Weight (lbs)</label>
                <input
                  type="number"
                  value={inputs.weight}
                  onChange={(e) => updateInput('weight', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              {/* Height */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Feet"
                    value={inputs.heightFeet}
                    onChange={(e) => updateInput('heightFeet', parseInt(e.target.value))}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  />
                  <input
                    type="number"
                    placeholder="Inches"
                    value={inputs.heightInches}
                    onChange={(e) => updateInput('heightInches', parseInt(e.target.value))}
                    className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
              </div>

              {/* Daily Calories */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Daily Calorie Intake</label>
                <p className="text-xs text-gray-400 mb-2">How many calories you currently eat per day on average</p>
                <input
                  type="number"
                  value={inputs.dailyCalories}
                  onChange={(e) => updateInput('dailyCalories', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                />
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Activity Level</label>
                <select
                  value={inputs.activityLevel}
                  onChange={(e) => updateInput('activityLevel', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                >
                  {activityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goals */}
              <div className="space-y-4">
                {/* Calculation Method Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Calculate By</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => updateInput('calculationMethod', 'timeframe')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        inputs.calculationMethod === 'timeframe'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      Target Timeframe
                    </button>
                    <button
                      type="button"
                      onClick={() => updateInput('calculationMethod', 'weekly')}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        inputs.calculationMethod === 'weekly'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-gray-700 text-white hover:bg-gray-600'
                      }`}
                    >
                      Weekly Loss Rate
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weight Loss Goal (lbs)</label>
                  <input
                    type="number"
                    value={inputs.weightLossGoal}
                    onChange={(e) => updateInput('weightLossGoal', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                  />
                </div>
                  {inputs.calculationMethod === 'timeframe' ? (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Timeframe (weeks)</label>
                      <input
                        type="number"
                        value={inputs.timeframe}
                        onChange={(e) => updateInput('timeframe', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Target Weekly Loss (lbs)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={inputs.weeklyLossGoal || 2}
                        onChange={(e) => updateInput('weeklyLossGoal', parseFloat(e.target.value))}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={calculateResults}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 px-4 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-5 h-5" />
                  <span>Calculate My Fat Loss Plan</span>
                </div>
              </button>
            </div>
          </div>

          {/* Results Section */}
          {results && (
            <div className="bg-gray-800 rounded-lg shadow-2xl p-6 border border-yellow-500 w-full max-w-2xl mx-auto lg:mx-0">
              {/* Fat Loss Science Explanation */}
              <div className="bg-gradient-to-r from-yellow-900 to-yellow-800 rounded-lg p-4 mb-6 border border-yellow-600">
                <h3 className="text-lg font-bold text-yellow-200 mb-2">📚 Fat Loss Science</h3>
                <div className="text-sm text-yellow-100 space-y-1">
                  <p><strong>1 pound of body fat = 3,500 calories</strong></p>
                  <p><strong>Safe fat loss rate:</strong> 1-2 lbs per week (3,500-7,000 calorie deficit weekly)</p>
                  <p><strong>Daily deficit needed:</strong> 500-1,000 calories per day for 1-2 lbs/week loss</p>
                  <p><strong>Extreme deficits (2,000+ calories/day) are unsustainable and can slow metabolism</strong></p>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <TrendingDown className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold text-white">Your Fat Loss Blueprint</h2>
              </div>

              {isExtremeDeficit && (
                <div className="bg-red-900 border border-red-700 rounded-lg p-4 mb-6">
                  <p className="text-red-200 font-semibold">⚠️ Warning: Your target deficit is very aggressive. Consider extending your timeframe for sustainable results.</p>
                </div>
              )}

              <div className="space-y-6">
                {/* TDEE */}
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">TDEE (Total Daily Energy Expenditure)</h3>
                      <p className="text-xs text-gray-400 mt-1">The total calories your body burns in 24 hours</p>
                    </div>
                    <div className="relative">
                      <Info 
                        className="w-4 h-4 text-gray-400 cursor-help"
                        onMouseEnter={() => setShowTooltip('tdee')}
                        onMouseLeave={() => setShowTooltip(null)}
                      />
                      {showTooltip === 'tdee' && (
                        <div className="absolute bottom-full mb-2 right-0 bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                          Your daily calorie burn including activity
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">{results.tdee.toLocaleString()} calories/day</p>
                  <p className="text-sm text-gray-300 mt-2">This is the total number of calories your body burns daily based on your activity and body size. Eating below this creates fat loss.</p>
                </div>

                {/* Current Daily Deficit */}
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Current Daily Calorie Deficit</h3>
                    <p className="text-xs text-gray-400 mt-1">How many calories below maintenance you're eating</p>
                  </div>
                  <p className="text-2xl font-bold text-red-400">{results.dailyDeficit.toLocaleString()} calories/day</p>
                  <p className="text-sm text-gray-300 mt-2">This is the gap between what you eat and what your body burns — the key to weight loss.</p>
                </div>

                {/* Target Daily Deficit */}
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Target Daily Deficit Needed</h3>
                    <p className="text-xs text-gray-400 mt-1">Required daily calorie deficit to reach your goal</p>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">{results.targetDailyDeficit.toLocaleString()} calories/day</p>
                  <p className="text-sm text-gray-300 mt-2">
                    {inputs.calculationMethod === 'weekly' 
                      ? `To lose ${inputs.weeklyLossGoal} pounds per week, you need this daily deficit (${inputs.weeklyLossGoal} lbs × 3,500 calories ÷ 7 days).`
                      : `To lose ${inputs.weightLossGoal} pounds in ${inputs.timeframe} weeks, you need this daily deficit (${inputs.weightLossGoal} lbs × 3,500 calories ÷ ${inputs.timeframe * 7} days).`
                    }
                  </p>
                </div>

                {/* Exercise Calories */}
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-red-500">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Exercise Calories to Reach Target Deficit</h3>
                    <p className="text-xs text-gray-400 mt-1">Additional calories to burn through physical activity</p>
                  </div>
                  <p className="text-2xl font-bold text-red-400">{results.exerciseCalories.toLocaleString()} calories/day</p>
                  <p className="text-sm text-gray-300 mt-2">To reach your target deficit of {results.targetDailyDeficit} calories/day, you can burn this amount through exercise. Adjust your diet and exercise balance as needed.</p>
                </div>

                {/* Walking/Running Miles */}
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Miles You Need to Walk or Run Daily</h3>
                    <p className="text-xs text-gray-400 mt-1">Distance needed to burn your target exercise calories</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div className="text-center">
                      <p className="text-lg font-semibold text-yellow-400">Walking (3 mph)</p>
                      <p className="text-2xl font-bold text-white">{results.walkingMiles} miles</p>
                      <p className="text-xs text-gray-400">{results.caloriesPerMileWalking} cal/mile</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-semibold text-red-400">Running (5-6 mph)</p>
                      <p className="text-2xl font-bold text-white">{results.runningMiles} miles</p>
                      <p className="text-xs text-gray-400">{results.caloriesPerMileRunning} cal/mile</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mt-3">Based on your current weight, walking burns about {results.caloriesPerMileWalking} calories/mile and running burns about {results.caloriesPerMileRunning} calories/mile.</p>
                </div>

                {/* Projected Weekly Loss */}
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-green-500">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Projected Weekly Fat Loss</h3>
                    <p className="text-xs text-gray-400 mt-1">Expected pounds lost per week with your current plan</p>
                  </div>
                  <p className="text-2xl font-bold text-green-400">{results.projectedWeeklyLoss} lbs/week</p>
                  <p className="text-sm text-gray-300 mt-2">Based on your total daily deficit, this is how many pounds of fat you can expect to lose each week.</p>
                </div>

                {/* Time to Goal */}
                <div className="bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Time to Reach Your Goal</h3>
                    <p className="text-xs text-gray-400 mt-1">Estimated weeks to achieve your weight loss target</p>
                  </div>
                  <p className="text-2xl font-bold text-yellow-400">{results.timeToGoal} weeks</p>
                  <p className="text-sm text-gray-300 mt-2">
                    {inputs.calculationMethod === 'weekly' 
                      ? `Based on your target weekly loss rate, this is your calculated timeframe.`
                      : `If you maintain this daily deficit, you'll hit your goal in this many weeks.`
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Motivational Footer */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Crown className="w-6 h-6" />
              <Flame className="w-6 h-6" />
            </div>
            <p className="text-xl font-bold">This isn't just weight loss — it's legacy.</p>
            <p className="text-lg mt-2">Every calorie burned, every mile walked, every rep completed builds the boss within.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
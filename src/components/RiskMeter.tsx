import React from 'react';

const RiskMeter: React.FC<{ risk: number; level: string }> = ({ risk, level }) => {

  const bg = risk >= 80 ? 'bg-red-600' : risk >= 60 ? 'bg-orange-600' : risk >= 30 ? 'bg-yellow-500' : 'bg-green-600';
  return (
    <div className="mb-4">
      <div className="w-full bg-gray-200 h-4 rounded overflow-hidden" aria-hidden>
        <div style={{ width: `${risk}%` }} className={`h-4 rounded transition-all duration-500 ${bg}`} />
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span>0</span>
        <span>{level}</span>
        <span>100</span>
      </div>
    </div>
  );
};

export default RiskMeter;

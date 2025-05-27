
import React, { useState } from 'react';
import AuditScoreChart from './AuditScoreChart';
import AuditHistoryTable from './AuditHistoryTable';
import EmptyAuditState from './EmptyAuditState';

interface AuditHistoryProps {
  facilityId: number;
}

interface AuditRecord {
  id: number;
  date: string;
  auditor: string;
  score: number;
  previousScore: number | null;
  categories: {
    name: string;
    score: number;
  }[];
}

const AuditHistory: React.FC<AuditHistoryProps> = ({ facilityId }) => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  const auditHistory: AuditRecord[] = [
    {
      id: 1,
      date: '2023-04-15',
      auditor: 'Dr. Jean Mutabazi',
      score: 92,
      previousScore: 87,
      categories: [
        { name: 'Infrastructure', score: 95 },
        { name: 'Staffing', score: 90 },
        { name: 'Treatment', score: 94 },
        { name: 'Rights', score: 89 }
      ]
    },
    {
      id: 2,
      date: '2022-10-22',
      auditor: 'Dr. Alice Uwimana',
      score: 87,
      previousScore: 82,
      categories: [
        { name: 'Infrastructure', score: 90 },
        { name: 'Staffing', score: 85 },
        { name: 'Treatment', score: 89 },
        { name: 'Rights', score: 84 }
      ]
    },
    {
      id: 3,
      date: '2022-04-05',
      auditor: 'Dr. Robert Mugisha',
      score: 82,
      previousScore: 76,
      categories: [
        { name: 'Infrastructure', score: 80 },
        { name: 'Staffing', score: 78 },
        { name: 'Treatment', score: 85 },
        { name: 'Rights', score: 85 }
      ]
    },
    {
      id: 4,
      date: '2021-09-18',
      auditor: 'Dr. Sara Niragire',
      score: 76,
      previousScore: null,
      categories: [
        { name: 'Infrastructure', score: 75 },
        { name: 'Staffing', score: 72 },
        { name: 'Treatment', score: 80 },
        { name: 'Rights', score: 77 }
      ]
    }
  ];

  const sortedAudits = [...auditHistory].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });

  const toggleSortDirection = () => {
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const chartData = sortedAudits.slice().reverse().map(audit => ({
    name: new Date(audit.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
    score: audit.score
  }));

  return (
    <div className="space-y-6">
      {auditHistory.length > 0 ? (
        <>
          <AuditScoreChart chartData={chartData} />
          <AuditHistoryTable 
            audits={sortedAudits}
            sortDirection={sortDirection}
            toggleSortDirection={toggleSortDirection}
          />
        </>
      ) : (
        <EmptyAuditState />
      )}
    </div>
  );
};

export default AuditHistory;

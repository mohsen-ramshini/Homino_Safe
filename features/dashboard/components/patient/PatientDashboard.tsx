import React, { useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useRecommendation } from '../../api/patient/useGetRecommen';
import { useSummary } from '../../api/patient/useGetSummary';
import { useHistory } from '../../api/patient/useGetHistory';
import { useDashboardOverview } from '../../api/patient/useGetOverview';
import { OverviewSection } from './OverviewSection';
import { SummarySection } from './SummarySection';
import { RecommendSection } from './RecommendSection';
import { HistoryChart } from './HistoryChart';
import { LoaderIcon } from "@/components/chat/icons";

const mockData = [
  { timestamp: '2025-06-20T08:00:00Z', heart_rate: 72 },
  { timestamp: '2025-06-21T08:00:00Z', heart_rate: 78 },
  { timestamp: '2025-06-22T08:00:00Z', heart_rate: 75 },
  { timestamp: '2025-06-23T08:00:00Z', heart_rate: 80 },
  { timestamp: '2025-06-24T08:00:00Z', heart_rate: 76 },
  { timestamp: '2025-06-25T08:00:00Z', heart_rate: 74 },
];

const PatientDashboard = () => {
  const metrics = ['heart_rate'];
  const { user } = useUser();
  const userId = user?.id ?? 0;

  const {
    data: overviewData,
    isLoading: isOverviewLoading,
    error: overviewError,
  } = useDashboardOverview(userId);

  const {
    data: summaryData,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useSummary(userId);

  const {
    data: recommendationData,
    isLoading: isRecommendationLoading,
    error: recommendationError,
  } = useRecommendation(userId);

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useHistory(userId, metrics);

  useEffect(() => {
    console.log('Overview:', overviewData);
    console.log('Summary:', summaryData);
    console.log('Recommendation:', recommendationData);
    console.log('History:', historyData);
  }, [overviewData, summaryData, recommendationData, historyData]);

  const renderSection = (loading: boolean, error: any, data: any, Component: any, fallback: string) => {
    if (loading) return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="animate-spin w-8 h-8 text-blue-500 mb-2 flex items-center justify-center">
          <LoaderIcon size={32} />
        </div>
        <span className="text-muted-foreground">Loading...</span>
      </div>
    );
    if (error || !data) return <p className="text-red-500">{fallback}</p>;
    return <Component data={data} />;
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">📋 Patient Overview</h1>

      {renderSection(isOverviewLoading, overviewError, overviewData, OverviewSection, 'No overview data available')}
      {renderSection(isSummaryLoading, summaryError, summaryData, SummarySection, 'No summary data available')}
      {renderSection(isRecommendationLoading, recommendationError, recommendationData, RecommendSection, 'No recommendation data available')}

      {/* {isHistoryLoading ? (
        <p className="text-gray-500">Loading history...</p>
      ) : historyData?.data?.length ? (
        <HistoryChart
          data={historyData.data}
          metric={historyData.metrics[0]}
          unit={historyData.units?.[historyData.metrics[0]]}
        />
      ) : (
        <p className="text-gray-500">No history data to display.</p>
      )} */}
      <HistoryChart data={mockData} metric="heart_rate" unit="bpm" />
    </div>
  );
};

export default PatientDashboard;

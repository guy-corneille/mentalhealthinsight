import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useFacilities } from '../../services/facilityService';
import { benchmarkService } from '../../services/benchmarkService';
import { BenchmarkComparison } from '../../types/benchmark';
import { Loader2 } from 'lucide-react';
import { Progress } from '../ui/progress';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export function FacilityComparison() {
    const [facilityA, setFacilityA] = useState<string>('');
    const [facilityB, setFacilityB] = useState<string>('');
    const [comparison, setComparison] = useState<BenchmarkComparison | null>(null);
    const [loading, setLoading] = useState(false);
    const { data: facilities, isLoading: loadingFacilities } = useFacilities();

    const handleCompare = async () => {
        if (!facilityA || !facilityB) return;
        
        setLoading(true);
        try {
            const result = await benchmarkService.compareFacilities(
                parseInt(facilityA),
                parseInt(facilityB)
            );
            setComparison(result);
        } catch (error) {
            console.error('Error comparing facilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const getAuditChartData = () => {
        if (!comparison) return [];

        return [{
            name: 'Audit Score (90 days)',
            [comparison.facility_a_name]: comparison.detailed_results.facility_a.audit_scores.average,
            [comparison.facility_b_name]: comparison.detailed_results.facility_b.audit_scores.average,
        }];
    };

    const getAssessmentChartData = () => {
        if (!comparison) return [];

        return [{
            name: 'Assessment Score (30 days)',
            [comparison.facility_a_name]: comparison.detailed_results.facility_a.recent_assessments.average_score,
            [comparison.facility_b_name]: comparison.detailed_results.facility_b.recent_assessments.average_score,
        }];
    };

    if (loadingFacilities) {
        return <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Compare Facilities</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Facility A</label>
                            <Select value={facilityA} onValueChange={setFacilityA}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select facility" />
                                </SelectTrigger>
                                <SelectContent>
                                    {facilities?.map((facility) => (
                                        <SelectItem key={facility.id} value={facility.id.toString()}>
                                            {facility.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Facility B</label>
                            <Select value={facilityB} onValueChange={setFacilityB}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select facility" />
                                </SelectTrigger>
                                <SelectContent>
                                    {facilities?.map((facility) => (
                                        <SelectItem key={facility.id} value={facility.id.toString()}>
                                            {facility.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Button
                        className="mt-4 w-full"
                        onClick={handleCompare}
                        disabled={!facilityA || !facilityB || loading || facilityA === facilityB}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin mr-2" />
                                Comparing Facilities...
                            </>
                        ) : (
                            'Compare Facilities'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {comparison && (
                <>
                    <Card>
                        <CardHeader>
                            <CardTitle>Audit Performance (Last 90 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getAuditChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey={comparison.facility_a_name}
                                            fill="#8884d8"
                                        />
                                        <Bar
                                            dataKey={comparison.facility_b_name}
                                            fill="#82ca9d"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium">{comparison.facility_a_name}</p>
                                    <p>Score: {comparison.detailed_results.facility_a.audit_scores.average.toFixed(1)}</p>
                                    <p>Audits: {comparison.detailed_results.facility_a.audit_scores.count}</p>
                                </div>
                                <div>
                                    <p className="font-medium">{comparison.facility_b_name}</p>
                                    <p>Score: {comparison.detailed_results.facility_b.audit_scores.average.toFixed(1)}</p>
                                    <p>Audits: {comparison.detailed_results.facility_b.audit_scores.count}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Patient Coverage</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">{comparison.facility_a_name}</span>
                                        <span>{comparison.detailed_results.facility_a.patient_coverage.coverage_percentage}%</span>
                                    </div>
                                    <Progress 
                                        value={comparison.detailed_results.facility_a.patient_coverage.coverage_percentage} 
                                    />
                                    <p className="text-sm mt-1">
                                        {comparison.detailed_results.facility_a.patient_coverage.assessed_patients} of {comparison.detailed_results.facility_a.patient_coverage.total_patients} patients assessed
                                    </p>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="font-medium">{comparison.facility_b_name}</span>
                                        <span>{comparison.detailed_results.facility_b.patient_coverage.coverage_percentage}%</span>
                                    </div>
                                    <Progress 
                                        value={comparison.detailed_results.facility_b.patient_coverage.coverage_percentage} 
                                    />
                                    <p className="text-sm mt-1">
                                        {comparison.detailed_results.facility_b.patient_coverage.assessed_patients} of {comparison.detailed_results.facility_b.patient_coverage.total_patients} patients assessed
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Assessment Activity (Last 30 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[200px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getAssessmentChartData()}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar
                                            dataKey={comparison.facility_a_name}
                                            fill="#8884d8"
                                        />
                                        <Bar
                                            dataKey={comparison.facility_b_name}
                                            fill="#82ca9d"
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-medium">{comparison.facility_a_name}</p>
                                    <p>Average Score: {comparison.detailed_results.facility_a.recent_assessments.average_score.toFixed(1)}</p>
                                    <p>Completed: {comparison.detailed_results.facility_a.recent_assessments.count}</p>
                                </div>
                                <div>
                                    <p className="font-medium">{comparison.facility_b_name}</p>
                                    <p>Average Score: {comparison.detailed_results.facility_b.recent_assessments.average_score.toFixed(1)}</p>
                                    <p>Completed: {comparison.detailed_results.facility_b.recent_assessments.count}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
} 
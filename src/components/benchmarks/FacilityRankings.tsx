import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { benchmarkService } from '../../services/benchmarkService';
import { FacilityRanking } from '../../types/benchmark';
import { Loader2, TrendingDown, TrendingUp, Minus, AlertCircle } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../ui/table';
import { Alert, AlertDescription } from '../ui/alert';

export function FacilityRankings() {
    const [rankings, setRankings] = useState<FacilityRanking[]>([]);
    const [loading, setLoading] = useState(true);
    const [calculating, setCalculating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadRankings = async () => {
        try {
            const data = await benchmarkService.getCurrentRankings();
            console.log('Received rankings:', data); // Debug log
            setRankings(data);
            setError(null);
        } catch (error) {
            console.error('Error loading rankings:', error);
            setError('Failed to load rankings. Please try again later.');
            setRankings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRankings();
    }, []);

    const handleCalculateRankings = async () => {
        setCalculating(true);
        setError(null);
        try {
            const data = await benchmarkService.calculateRankings();
            console.log('Calculated rankings:', data); // Debug log
            setRankings(data);
        } catch (error) {
            console.error('Error calculating rankings:', error);
            setError('Failed to calculate rankings. Please try again later.');
        } finally {
            setCalculating(false);
        }
    };

    const getRankChange = (current: number, previous: number | null) => {
        if (previous === null) return null;
        return previous - current;
    };

    const renderRankChange = (change: number | null) => {
        if (change === null) return <Minus className="h-4 w-4" />;
        if (change > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
        if (change < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
        return <Minus className="h-4 w-4" />;
    };

    const renderAuditScore = (score: number) => {
        if (score === 0) return 'No Audit';
        return score.toFixed(2);
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex justify-center p-4">
                    <Loader2 className="animate-spin" />
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Facility Rankings</CardTitle>
                    <Button onClick={handleCalculateRankings} disabled={calculating}>
                        {calculating ? <Loader2 className="animate-spin mr-2" /> : null}
                        Update Rankings
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Rank</TableHead>
                                <TableHead>Facility</TableHead>
                                <TableHead className="text-right">Audit Score</TableHead>
                                <TableHead className="w-[100px] text-center">Trend</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rankings && rankings.length > 0 ? (
                                rankings.map((ranking) => (
                                    <TableRow 
                                        key={ranking.id}
                                        className={ranking.audit_score === 0 ? "opacity-60" : ""}
                                    >
                                        <TableCell className="font-medium">
                                            #{ranking.overall_rank}
                                        </TableCell>
                                        <TableCell>{ranking.facility_name}</TableCell>
                                        <TableCell className="text-right">
                                            {renderAuditScore(ranking.audit_score)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {renderRankChange(getRankChange(ranking.overall_rank, ranking.previous_rank))}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-4">
                                        No rankings available. Click "Update Rankings" to generate new rankings.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
} 